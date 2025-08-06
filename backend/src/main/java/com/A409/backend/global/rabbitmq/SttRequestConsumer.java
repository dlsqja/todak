package com.A409.backend.global.rabbitmq;

import com.A409.backend.global.ai.AIClient;
import com.A409.backend.global.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class SttRequestConsumer {

    private final AIClient aiClient;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receive(String message) {
        log.info("Received STT Request: {}", message);

        aiClient.sendChatRequest(message);

        try {
        } catch (Exception e) {
            log.error("STT Reqeust fail: {}", e.getMessage());
            throw e;
        }
    }
}

