package com.A409.backend.global.elasticsearch.repository;

import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface HospitalElasticRepository extends ElasticsearchRepository<HospitalDocument, Long> {
    List<HospitalDocument> findByNameContaining(String name);
}
