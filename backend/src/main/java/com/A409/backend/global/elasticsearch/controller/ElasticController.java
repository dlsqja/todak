package com.A409.backend.global.elasticsearch.controller;

import com.A409.backend.global.annotation.LogExecutionTime;
import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.elasticsearch.service.ElasticService;
import com.A409.backend.global.redis.RedisService;
import com.A409.backend.global.response.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ElasticController {

    private final ElasticService elasticService;

    @GetMapping("/autocomplete")
    public void autocomplete() {
        elasticService.syncAllHospitalsToElasticsearch();
    }
}
