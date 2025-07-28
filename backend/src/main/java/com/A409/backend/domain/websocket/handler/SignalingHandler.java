package com.A409.backend.domain.websocket.handler;

import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SignalingHandler extends TextWebSocketHandler {

    // roomId -> userId -> WebSocketSession
    private final Map<String, Map<String, WebSocketSession>> roomMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // 연결 성공 후 초기화 가능
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JSONObject msg = new JSONObject(message.getPayload());

        String type = msg.getString("type");       // offer / answer / ice 등
        String roomId = msg.getString("roomId");   // 방 ID
        String senderId = msg.getString("senderId");
        String targetId = msg.getString("targetId");

        roomMap.putIfAbsent(roomId, new ConcurrentHashMap<>());
        roomMap.get(roomId).put(senderId, session);

        // 상대방이 존재하면 메시지 전달
        WebSocketSession targetSession = roomMap.get(roomId).get(targetId);
        if (targetSession != null && targetSession.isOpen()) {
            targetSession.sendMessage(new TextMessage(msg.toString()));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 세션 정리 로직 (선택)
    }
}
