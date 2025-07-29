package com.A409.backend.global.response;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.SuccessCode;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;

@Getter
@JsonPropertyOrder({"status", "message", "data"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final int status;
    private final String message;
    private T data;

    private ApiResponse(SuccessCode successCode, T data) {
        this.status = successCode.getStatus().value();
        this.message = successCode.getMessage();
        this.data = data;
    }

    private ApiResponse(SuccessCode successCode) {
        this.status = successCode.getStatus().value();
        this.message = successCode.getMessage();
    }

    private ApiResponse(ErrorCode errorCode) {
        this.status = errorCode.getStatus().value();
        this.message = errorCode.getMessage();
    }

    public static <T> ApiResponse<T> success(SuccessCode successCode, T data) {
        return new ApiResponse<>(successCode, data);
    }

    // 정적 팩토리 메소드 (성공, 데이터 미포함)
    public static <T> ApiResponse<T> success(SuccessCode successCode) {
        return new ApiResponse<>(successCode);
    }

    // 정적 팩토리 메소드 (실패)
    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(errorCode);
    }
}
