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
        System.out.println("WebSocket 연결 성공: " + session.getId());
    }

    private void handleJoin(WebSocketSession session, JSONObject msg) throws Exception {
        String roomId = msg.getString("roomId");
        String userId = msg.getString("userId");

        // 방이 없으면 생성
        roomMap.putIfAbsent(roomId, new ConcurrentHashMap<>());
        Map<String, WebSocketSession> room = roomMap.get(roomId);

        // 사용자를 방에 추가
        room.put(userId, session);

        System.out.println(userId + "가 방 " + roomId + "에 입장. 현재 인원: " + room.size());

        // 방에 2명이 되면 WebRTC 연결 시작 신호 보내기
        if (room.size() == 2) {
            // 먼저 들어온 사람을 caller로, 나중에 들어온 사람을 callee로 설정
            String[] userIds = room.keySet().toArray(new String[0]);
            String callerId = userIds[0].equals(userId) ? userIds[1] : userIds[0]; // 먼저 들어온 사람
            String calleeId = userId; // 방금 들어온 사람

            // caller에게 연결 시작 신호 보내기
            JSONObject startCall = new JSONObject();
            startCall.put("type", "start-call");
            startCall.put("calleeId", calleeId);

            WebSocketSession callerSession = room.get(callerId);
            if (callerSession != null && callerSession.isOpen()) {
                callerSession.sendMessage(new TextMessage(startCall.toString()));
                System.out.println("연결 시작 신호를 " + callerId + "에게 전송");
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JSONObject msg = new JSONObject(message.getPayload());
        String type = msg.getString("type");

        switch (type) {
            case "join":
                handleJoin(session, msg);
                break;
            case "offer":
            case "answer":
            case "ice-candidate":
            case "leave":
                handleSignalingMessage(msg);
                break;
        }
    }

    private void handleSignalingMessage(JSONObject msg) throws Exception {
        String roomId = msg.getString("roomId");
        String targetId = msg.getString("targetId");
        String type = msg.getString("type");

        Map<String, WebSocketSession> room = roomMap.get(roomId);
        if (room != null) {
            WebSocketSession targetSession = room.get(targetId);
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(msg.toString()));
            }

            if (type.equals("leave")) {
                // 상대방에게 peer-left 알림
                JSONObject peerLeft = new JSONObject();
                peerLeft.put("type", "peer-left");
                peerLeft.put("senderId", msg.getString("senderId"));
                targetSession.sendMessage(new TextMessage(peerLeft.toString()));
            }
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 연결이 끊어진 세션을 모든 방에서 제거
        roomMap.forEach((roomId, room) -> {
            room.entrySet().removeIf(entry -> entry.getValue().equals(session));
            if (room.isEmpty()) {
                roomMap.remove(roomId);
            }
        });
        System.out.println("WebSocket 연결 종료: " + session.getId());
    }
}