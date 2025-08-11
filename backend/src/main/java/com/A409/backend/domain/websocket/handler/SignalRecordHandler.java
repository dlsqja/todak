package com.A409.backend.domain.websocket.handler;

import com.A409.backend.domain.websocket.dto.SessionRecordWrapper;
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
import org.kurento.client.RecorderEndpoint;
import org.kurento.client.MediaProfileSpecType;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class SignalRecordHandler extends TextWebSocketHandler {

    private final KurentoClient kurentoClient;

    // 방 ID -> Pipeline
    private final Map<String, MediaPipeline> pipelines = new ConcurrentHashMap<>();
    // 방 ID -> 참가자 Endpoint 목록
    private final Map<String, Map<String, WebRtcEndpoint>> roomParticipants = new ConcurrentHashMap<>();
    // 세션 ID -> SessionWrapper
    private final Map<String, SessionRecordWrapper> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("새 WebSocket 연결: " + session.getId());
        super.afterConnectionEstablished(session);
    }

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
            case "leave":
                handleLeave(ws, msg);
                break;
        }
    }

    private void handleLeave(WebSocketSession ws, JsonNode msg) throws Exception {
        String sessionId = msg.get("sessionId").asText();
        cleanupParticipant(ws, sessionId);
        sendLeftMsg(ws, sessionId);
    }

    private void sendLeftMsg(WebSocketSession ws, String sessionId) throws Exception {
        if (sessionId == null) return;
        ObjectNode resp = JsonNodeFactory.instance.objectNode();
        resp.put("id", "peerLeft");

        // 방 안의 참가자에게 peerLeft 메세지를 보낸다.
        Map<String, WebRtcEndpoint> participants = roomParticipants.get(sessionId);
        if (participants != null) {
            participants.keySet().forEach(otherWsId -> {
                SessionRecordWrapper otherWrap = sessions.get(otherWsId);
                if (otherWrap != null && otherWrap.getWsSession().isOpen()) {
                    try {
                        otherWrap.getWsSession().sendMessage(new TextMessage(resp.toString()));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession ws, CloseStatus status) throws Exception {
        // 브라우저 새로고침·뒤로가기 등으로 연결이 끊겼을 때도 정리
        SessionRecordWrapper wrap = sessions.get(ws.getId());
        String sessionId = findRoomIdBySession(ws.getId());
        if (wrap != null) {
            cleanupParticipant(ws, sessionId);
            sendLeftMsg(ws, sessionId);
        }
        super.afterConnectionClosed(ws, status);
    }

    /** 세션 ID → 방 ID 역 lookup (작은 서비스면 선형 탐색으로 충분) */
    private String findRoomIdBySession(String wsId) {
        return roomParticipants.entrySet().stream()
                .filter(e -> e.getValue().containsKey(wsId))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);
    }

    /** 실제 정리 로직 */
    private void cleanupParticipant(WebSocketSession ws, String sessionId) {
        if (sessionId == null) return;
//        System.out.println("cleanup:" + ws.getId());

        // 1) 참가자 맵에서 본인 endpoint 꺼내서 해제
        Map<String, WebRtcEndpoint> sessionEndpoint = roomParticipants.get(sessionId);
        if (sessionEndpoint == null) return;

        WebRtcEndpoint endpoint = sessionEndpoint.remove(ws.getId());
        if (endpoint != null) {
            try { endpoint.release(); } catch (Exception ignore) {}
        }

        // 2) 세션 래퍼 제거
        SessionRecordWrapper wrap = sessions.remove(ws.getId());
        if (wrap != null) wrap.close();   // 내부적으로 pipeline 은 남아 있음

        // 3) 방에 남은 인원이 없는지 확인
        if (roomParticipants.get(sessionId).isEmpty()) {
            // pipeline 해제 후 맵 제거
            MediaPipeline pipeline = pipelines.remove(sessionId);
            if (pipeline != null) {
                try { pipeline.release(); } catch (Exception ignore) {}
            }
            roomParticipants.remove(sessionId);
            System.out.println("방 '" + sessionId + "'이 비어 파이프라인을 해제했습니다.");
        } else {
            System.out.println("방 '" + sessionId + "'에 남은 인원: "
                    + roomParticipants.get(sessionId).size());
        }
    }


    private void handleJoin(WebSocketSession ws, JsonNode msg) throws Exception {
        String sessionId = msg.get("sessionId").asText();
        String sdpOffer = msg.get("sdpOffer").asText();
        if (sessions.get(ws.getId()) != null) {
            System.out.println("이미 참가한 유저입니다.");
            return;
        }
        Map<String, WebRtcEndpoint> room = roomParticipants.get(sessionId);
        if (room != null && room.size() >= 2) {
            System.out.println("방이 꽉 찼습니다.");
            return;
        }


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

        RecorderEndpoint recorder = null;
        // 같은 방에 참가하면 덮어씌워진다. -> 수의사만 구분해서 저장하도록 해야한다.
        // 방을 여는 사람 = 수의사. -> 처음 방이 만들어 질 때만 저장하도록 한다.
        if (roomParticipants.get(sessionId) == null) {
            String recordPath = "file:///tmp/audio-" + sessionId + ".webm";
            recorder = new RecorderEndpoint.Builder(pipeline, recordPath)
                    .withMediaProfile(MediaProfileSpecType.WEBM_AUDIO_ONLY)
                    .build();

            webRtc.connect(recorder);
            recorder.record();
        }

        // 기존 참가자와 연결
        roomParticipants.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .forEach((otherWsId, otherWebRtc) -> {
                    otherWebRtc.connect(webRtc);
                    webRtc.connect(otherWebRtc);
                });

        // 참가자 목록에 새 참가자 추가
        roomParticipants.get(sessionId).put(ws.getId(), webRtc);

        // 세션 저장
        sessions.put(ws.getId(), new SessionRecordWrapper(ws, pipeline, webRtc, recorder));

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
