package com.A409.backend.global.response;

import com.A409.backend.global.enums.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ApiResponse<T> extends ResponseEntity<ApiBody<T>> {

    private ApiResponse(HttpStatus status, ApiBody<T> body) {
        super(body, status);
    }

    public static <T> ApiResponse<T> ofSuccess(T data) {
        return new ApiResponse<>(HttpStatus.OK, new ApiBody<>( "성공", data));
    }

    public static <T> ApiResponse<T> ofFail(ErrorCode errorCode) {
        return new ApiResponse<>(errorCode.getStatus(),
                new ApiBody<>(errorCode.getMessage(), null));
    }

    public static <T> ApiResponse<T> ofFail(ErrorCode errorCode, String customMessage) {
        return new ApiResponse<>(errorCode.getStatus(),
                new ApiBody<>(customMessage, null));
    }
}

