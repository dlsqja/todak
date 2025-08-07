package com.A409.backend.global.response;

import com.A409.backend.global.enums.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class APIResponse<T> extends ResponseEntity<ApiBody<T>> {

    private APIResponse(HttpStatus status, ApiBody<T> body) {
        super(body, status);
    }

    public static <T> APIResponse<T> ofSuccess(HttpStatus httpStatus,T data) {
        return new APIResponse<>(httpStatus, new ApiBody<>( "성공", data));
    }
    public static <T> APIResponse<T> ofSuccess(T data) {
        return new APIResponse<>(HttpStatus.OK, new ApiBody<>( "성공", data));
    }

    public static <T> APIResponse<T> ofFail(ErrorCode errorCode) {
        return new APIResponse<>(errorCode.getStatus(),
                new ApiBody<>(errorCode.getMessage(), null));
    }

    public static <T> APIResponse<T> ofFail(ErrorCode errorCode, String customMessage) {
        return new APIResponse<>(errorCode.getStatus(),
                new ApiBody<>(customMessage, null));
    }
}

