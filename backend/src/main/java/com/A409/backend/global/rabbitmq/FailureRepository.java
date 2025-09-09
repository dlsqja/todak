package com.A409.backend.global.rabbitmq;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class FailureRepository {
    private final JdbcTemplate jdbc;

    public void insertFailure(String type, Long treatmentId) {
        jdbc.update(
                "INSERT INTO task_failures_min(type, treatment_id) VALUES (?, ?)",
                type, treatmentId
        );
    }
}
