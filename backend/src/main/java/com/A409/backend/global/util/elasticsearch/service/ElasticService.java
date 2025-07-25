package com.A409.backend.global.util.elasticsearch.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.global.util.elasticsearch.repository.HospitalElasticRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElasticService {

    private final HospitalRepository hospitalRepository;
    private final HospitalElasticRepository hospitalElasticRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    @Transactional(readOnly = true)
    public void syncAllHospitalsToElasticsearch() {
        log.info("병원 데이터 동기화 시작...");

        // 1. 기존 Elasticsearch 데이터 삭제
        hospitalElasticRepository.deleteAll();
        log.info("기존 Elasticsearch 데이터 삭제 완료");

        // 2. 데이터베이스에서 모든 병원 데이터 조회
        List<Hospital> hospitals = hospitalRepository.findAll();
        log.info("데이터베이스에서 {} 개의 병원 데이터 조회", hospitals.size());

        // 3. Elasticsearch에 저장
        if (!hospitals.isEmpty()) {
            hospitalElasticRepository.saveAll(hospitals);
            log.info("Elasticsearch에 {} 개의 병원 데이터 저장 완료", hospitals.size());
        }

        log.info("병원 데이터 동기화 완료!");
    }

    public List<Hospital> autocompleteByName(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        
        return hospitalElasticRepository.findByNameContaining(keyword.trim());
    }
}
