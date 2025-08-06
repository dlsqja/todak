package com.A409.backend.domain.websocket.handler;

import com.A409.backend.domain.websocket.dto.SessionWrapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.kurento.client.IceCandidate;
import org.kurento.client.KurentoClient;
import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class SignalHandler extends TextWebSocketHandler {

    private final KurentoClient kurentoClient;

    // 방 ID -> Pipeline
    private final Map<String, MediaPipeline> pipelines = new ConcurrentHashMap<>();
    // 방 ID -> 참가자 Endpoint 목록
    private final Map<String, Map<String, WebRtcEndpoint>> roomParticipants = new ConcurrentHashMap<>();
    // 세션 ID -> SessionWrapper
    private final Map<String, SessionWrapper> sessions = new ConcurrentHashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession ws, TextMessage message) throws Exception {
        JsonNode msg = new ObjectMapper().readTree(message.getPayload());
        String id = msg.get("id").asText();

        switch (id) {
            case "join":
                handleJoin(ws, msg);
                break;
            case "onIceCandidate":
                handleIce(ws, msg);
                break;
        }
    }

    private void handleJoin(WebSocketSession ws, JsonNode msg) throws Exception {
        String sessionId = msg.get("sessionId").asText();
        String sdpOffer = msg.get("sdpOffer").asText();

        // 같은 방 pipeline 재사용
        MediaPipeline pipeline = pipelines.computeIfAbsent(sessionId, k -> kurentoClient.createMediaPipeline());
        WebRtcEndpoint webRtc = new WebRtcEndpoint.Builder(pipeline).build();

        // Kurento → 브라우저 ICE 후보 전달
        webRtc.addIceCandidateFoundListener(event -> {
            ObjectNode candidateMsg = JsonNodeFactory.instance.objectNode();
            candidateMsg.put("id", "iceCandidate");
            candidateMsg.set("candidate", new ObjectMapper().valueToTree(event.getCandidate()));
            try {
                synchronized (ws) {
                    ws.sendMessage(new TextMessage(candidateMsg.toString()));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // 기존 참가자와 연결
        roomParticipants.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .forEach((otherWsId, otherWebRtc) -> {
                    otherWebRtc.connect(webRtc);
                    webRtc.connect(otherWebRtc);
                });

        // 참가자 목록에 새 참가자 추가
        roomParticipants.get(sessionId).put(ws.getId(), webRtc);

        // 세션 저장
        sessions.put(ws.getId(), new SessionWrapper(ws, pipeline, webRtc));

        // Offer → Answer 처리
        String sdpAnswer = webRtc.processOffer(sdpOffer);

        // Answer 전송
        ObjectNode resp = JsonNodeFactory.instance.objectNode();
        resp.put("id", "startResponse");
        resp.put("sdpAnswer", sdpAnswer);
        ws.sendMessage(new TextMessage(resp.toString()));

        // ICE 수집 시작
        webRtc.gatherCandidates();
    }

    private void handleIce(WebSocketSession ws, JsonNode msg) {
        JsonNode candNode = msg.get("candidate");
        IceCandidate cand = new IceCandidate(
                candNode.get("candidate").asText(),
                candNode.get("sdpMid").asText(),
                candNode.get("sdpMLineIndex").asInt()
        );
        sessions.get(ws.getId()).getWebRtc().addIceCandidate(cand);
    }
}
