package com.A409.backend.domain.pet.dto;

import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.global.enums.Gender;
import com.A409.backend.global.enums.Species;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PetResponse {

    private Long petId;
    private String name;
    private Species species;
    private String photo;
    private Gender gender;
    private Integer age;

    public static PetResponse toResponse(Pet pet){
        return PetResponse.builder()
                .petId(pet.getPetId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .photo(pet.getPhoto())
                .gender(pet.getGender())
                .age(pet.getAge())
                .build();
    }
}
