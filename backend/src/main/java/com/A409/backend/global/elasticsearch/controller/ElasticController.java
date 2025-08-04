package com.A409.backend.global.elasticsearch.controller;

import com.A409.backend.global.annotation.LogExecutionTime;
import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.elasticsearch.service.ElasticService;
import com.A409.backend.global.redis.service.RedisService;
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
    private final RedisService redisService;
    private static final long CACHE_TTL_MINUTES = 5;

    @GetMapping("/autocomplete/{keyword}")
    @LogExecutionTime
    public List<HospitalDocument> autocomplete(@PathVariable String keyword) {
        String cacheKey = "autocomplete:" + keyword;

        Object cached = redisService.getByKey(cacheKey);
        if (cached != null) {
            log.info("Cache hit for keyword: {}", keyword);

            return (List<HospitalDocument>) cached;
        }

        List<HospitalDocument> result = elasticService.autocompleteByName(keyword);

        if (result != null) {
            redisService.setByKeyWithTTL(cacheKey, result,CACHE_TTL_MINUTES);
        }

        return result;
    }

    @GetMapping("/autocomplete")
    public void autocomplete() {
        elasticService.syncAllHospitalsToElasticsearch();
    }
}
