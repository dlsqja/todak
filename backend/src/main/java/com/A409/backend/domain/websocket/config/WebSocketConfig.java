package com.A409.backend.domain.websocket.config;

import com.A409.backend.domain.websocket.handler.SignalHandler;
import com.A409.backend.domain.websocket.handler.SignalRecordHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final SignalRecordHandler signalHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signalHandler, "/ws")
                .setAllowedOriginPatterns("*");
        ;
    }
}
