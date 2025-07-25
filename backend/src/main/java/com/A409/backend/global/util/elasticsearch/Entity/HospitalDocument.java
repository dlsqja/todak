package com.A409.backend.global.util.elasticsearch.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

@Document(indexName = "hospital")
@Setting(settingPath = "/elasticsearch/hospital-settings.json")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDocument {

    @Id
    private Long hospitalId;

    @Field(type = FieldType.Text, analyzer = "autocomplete", searchAnalyzer = "autocomplete_search")
    private String name;

    @Field(type = FieldType.Text)
    private String location;
}