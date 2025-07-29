package com.A409.backend.global.response;

import com.A409.backend.global.enums.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ApiResponse<T> extends ResponseEntity<ApiBody<T>> {

    private ApiResponse(HttpStatus status, ApiBody<T> body) {
        super(body, status);
    }

    public static <T> ApiResponse<T> ofSuccess(T data) {
        return new ApiResponse<>(HttpStatus.OK, new ApiBody<>( "SUCCESS", data));
    }

    public static <T> ApiResponse<T> ofFail(ErrorCode errorCode, T data) {
        return new ApiResponse<>(errorCode.getStatus(),
                new ApiBody<>(errorCode.getMessage(), data));
    }
}

