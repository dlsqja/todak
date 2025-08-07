package com.A409.backend.domain.hospital.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Entity
@Table(name = "hospital")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hospital_id")
    private Long hospitalId;

    @Column(name = "hospital_code", length = 6, nullable = false, unique = true)
    private String hospitalCode;

    @Column(length = 255, nullable = false)
    private String location;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 30, nullable = false)
    private String registrationNumber;

    @Column(columnDefinition = "TEXT")
    private String profile;



    @Column(length = 50)
    private String contact;
}

