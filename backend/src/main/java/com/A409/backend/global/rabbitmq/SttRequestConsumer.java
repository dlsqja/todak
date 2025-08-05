package com.A409.backend.global.rabbitmq;

import com.A409.backend.global.config.RabbitMQConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SttRequestConsumer {

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receive(String message) {
        log.info("Received STT Request: {}", message);

        try {
        } catch (Exception e) {
            log.error("STT Reqeust fail: {}", e.getMessage());
            throw e;
        }
    }
}

