package com.A409.backend.domain.pet.controller;

import com.A409.backend.domain.pet.dto.PetCodeRequest;
import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.pet.service.PetService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @Operation(summary = "반려동물 목록 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Pet.class))
            )
    )
    @GetMapping()
    public APIResponse<?> getMyPets(@AuthenticationPrincipal User user) {

        List<PetResponse> petList = petService.getMyPets(user.getId());

        return APIResponse.ofSuccess(petList);
    }


    @Operation(summary = "반려동물 상세 조회")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = PetResponse.class)))
    @GetMapping("/{pet_id}")
    public APIResponse<?> getMyPetDetail(@AuthenticationPrincipal User user, @PathVariable("pet_id") Long petId) {

        Pet petDetail = petService.getMyPetDetail(user.getId(), petId);

        return APIResponse.ofSuccess(PetResponse.toResponse(petDetail));
    }

    @Operation(summary = "반려동물 등록")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<?> registerPet(@AuthenticationPrincipal User user,  @RequestPart("petRequest") PetRequest petRequest,@RequestPart(value = "photo", required = false) MultipartFile photo) {
        petService.registerPet(user.getId(),petRequest,photo);

        return APIResponse.ofSuccess(null);
    }

    @Operation(summary = "반려동물 코드등록")
    @PostMapping("/code")
    public APIResponse<?> registerPetByCode(@AuthenticationPrincipal User user, @RequestBody PetCodeRequest petCodeRequest) {
        petService.registerPetByCode(user.getId(),petCodeRequest.getPetCode());

        return APIResponse.ofSuccess(null);
    }


    @Operation(summary = "반려동물 수정")
    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<?> updatePet(
            @AuthenticationPrincipal User user,
            @RequestPart("petRequest") PetRequest petRequest,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        petService.registerPet(user.getId(), petRequest, photo);
        return APIResponse.ofSuccess(null);
    }
}
