package com.A409.backend.global.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

public class ApiResponse<T> extends ResponseEntity<T> {

    private ApiResponse(HttpStatusCode status, T data) {
        super(data, status);
    }

    public static <T> ApiResponse<T> OfSuccess(T data){
        return new ApiResponse<T>(HttpStatus.OK, data);
    }

    public static <T> ApiResponse<T> ofFail(T data){
        return new ApiResponse<T>(HttpStatus.BAD_REQUEST, data);
    }

    public static <T> ApiResponse<T> of(HttpStatus status,T data){
        return new ApiResponse<T>(status, data);
    }

}
