package com.A409.backend.global.util.elasticsearch.controller;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.global.util.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.util.elasticsearch.repository.HospitalElasticRepository;
import com.A409.backend.global.util.elasticsearch.service.ElasticService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ElasticController {

    private final ElasticService elasticService;

    @GetMapping("/autocomplete/{keyword}")
    public List<HospitalDocument> autocomplete(@PathVariable String keyword) {
        return elasticService.autocompleteByName(keyword);
    }

    @GetMapping("/autocomplete")
    public void autocomplete() {
        elasticService.syncAllHospitalsToElasticsearch();
    }
}
