package com.A409.backend.domain.pet.dto;

import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.global.enums.Gender;
import com.A409.backend.global.enums.Species;
import lombok.Getter;

@Getter
public class PetRequest {

    private String name;
    private Species species;
    private Gender gender;
    private Integer age;

    public Pet toEntity() {
        return Pet.builder()
                .name(this.name)
                .species(this.species)
                .gender(this.gender)
                .age(this.age)
                .build();
    }

}
