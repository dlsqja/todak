package com.A409.backend.global.util.mapper;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.global.util.elasticsearch.Entity.HospitalDocument;

public class HospitalMapper {

    public static HospitalDocument toDocument(Hospital hospital) {
        if (hospital == null) {
            return null;
        }

        return HospitalDocument.builder()
                .hospitalId(hospital.getHospitalId())
                .name(hospital.getName())
                .location(hospital.getLocation())
                .build();
    }
}