package com.A409.backend.global.elasticsearch.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.elasticsearch.repository.HospitalElasticRepository;
import com.A409.backend.global.util.mapper.HospitalMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
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

    @Transactional(readOnly = true)
    public void syncAllHospitalsToElasticsearch() {
        log.info("병원 데이터 동기화 시작...");
        
        hospitalElasticRepository.deleteAll();
        log.info("기존 Elasticsearch 데이터 삭제 완료");
        
        List<Hospital> hospitals = hospitalRepository.findAll();
        log.info("데이터베이스에서 {} 개의 병원 데이터 조회", hospitals.size());
        
        if (!hospitals.isEmpty()) {
            List<HospitalDocument> documents = hospitals.stream()
                    .map(HospitalMapper::toDocument)
                    .collect(Collectors.toList());

            hospitalElasticRepository.saveAll(documents);
            log.info("Elasticsearch에 {} 개의 병원 데이터 저장 완료", documents.size());
        }

        log.info("병원 데이터 동기화 끝");
    }

    public List<HospitalDocument> autocompleteByName(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        return hospitalElasticRepository.findByNameContaining(keyword.trim());
    }
}
