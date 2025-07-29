package com.A409.backend.global.response;

import lombok.Getter;

@Getter
public class ApiBody<T> {
    private String message;
    private T data;

    public ApiBody(String message, T data) {
        this.message = message;
        this.data = data;
    }
}

