package com.A409.backend.global.rabbitmq;

import aj.org.objectweb.asm.TypeReference;
import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.global.ai.AIClient;
import com.A409.backend.global.ai.STTData;
import com.A409.backend.global.config.RabbitMQConfig;
import com.fasterxml.jackson.core.JsonProcessingException;
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
    private final FailureRepository failureRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receive(String message) throws JsonProcessingException {

        final int maxTry = 3;
        boolean summarySuccess = false;
        String lastErr = null;
        STTData sttData = objectMapper.readValue(message, STTData.class);
        Long treatmentId = sttData.getTreatmentId();
        String content    = sttData.getContent();

        for (int i = 1; i <= maxTry; i++) {
            try {
                String summary = aiClient.sendChatRequest(content);
                treatmentService.saveAISummary(treatmentId, summary);

                summarySuccess = true;
                break;
            } catch (Exception e) {
                lastErr = e.getMessage();
                log.warn("요약/분석 시도 실패 {}: {}", i, lastErr);

                try { Thread.sleep(1000L * i); } catch (InterruptedException ignored) {}
            }
        }

        if (!summarySuccess) {
            failureRepository.insertFailure("SUMMARY", treatmentId);
        }
    }

}

