package com.A409.backend.global.rabbitmq;

import aj.org.objectweb.asm.TypeReference;
import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.global.ai.AIClient;
import com.A409.backend.global.ai.STTData;
import com.A409.backend.global.config.RabbitMQConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class SttRequestConsumer {

    private final AIClient aiClient;
    private final ObjectMapper objectMapper;
    private final TreatmentService treatmentService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receive(String message) {
        log.info("Received STT Request: {}", message);

        try {
            STTData sttData = objectMapper.readValue(message, STTData.class);
            Long treatmentId = sttData.getTreatmentId();
            String content = sttData.getContent();

            String summary = aiClient.sendChatRequest(content);

            log.info("Treatment ID: {} , Summary: {}", treatmentId,summary);

            //treatmentService.saveAISummary(treatmentId,summary);

        } catch (Exception e) {
            log.error("STT Request fail: {}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }
}

