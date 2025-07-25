package com.A409.backend.global.util.elasticsearch.repository;

import com.A409.backend.domain.hospital.entity.Hospital;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface HospitalElasticRepository extends ElasticsearchRepository<Hospital, Long> {
    List<Hospital> findByNameContaining(String name);
}
