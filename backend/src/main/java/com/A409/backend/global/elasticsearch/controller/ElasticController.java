package com.A409.backend.global.elasticsearch.controller;

import com.A409.backend.global.annotation.LogExecutionTime;
import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.elasticsearch.service.ElasticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ElasticController {

    private final ElasticService elasticService;
    private final RedisTemplate<String, Object> redisTemplate;
    private static final long CACHE_TTL_MINUTES = 5;

    @GetMapping("/autocomplete/{keyword}")
    @LogExecutionTime
    public List<HospitalDocument> autocomplete(@PathVariable String keyword) {
        String cacheKey = "autocomplete:" + keyword;

        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.info("Cache hit for keyword: {}", keyword);

            return (List<HospitalDocument>) cached;
        }

        log.info("Cache miss for keyword: {}, querying Elasticsearch...", keyword);
        List<HospitalDocument> result = elasticService.autocompleteByName(keyword);

        redisTemplate.opsForValue().set(cacheKey, result, CACHE_TTL_MINUTES, TimeUnit.MINUTES);

        return result;
    }

    @GetMapping("/autocomplete")
    public void autocomplete() {
        elasticService.syncAllHospitalsToElasticsearch();
    }
}
