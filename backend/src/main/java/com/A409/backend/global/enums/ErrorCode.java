package com.A409.backend.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST,  "유효하지 않은 입력 값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED,  "지원하지 않는 HTTP 메서드입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,  "서버 내부 오류가 발생했습니다."),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST,  "유효하지 않은 타입 값입니다."),

    AUTH_INVALID_TOKEN(HttpStatus.UNAUTHORIZED,  "유효하지 않은 토큰입니다."),
    AUTH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED,  "만료된 토큰입니다."),
    AUTH_ACCESS_DENIED(HttpStatus.FORBIDDEN,  "접근 권한이 없습니다."),
    AUTH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED,  "헤더에서 토큰을 찾을 수 없습니다."),


    USER_NOT_FOUND(HttpStatus.NOT_FOUND,  "해당 사용자를 찾을 수 없습니다."),
    USER_EMAIL_DUPLICATED(HttpStatus.CONFLICT,  "이미 가입된 이메일입니다."),
    USER_INVALID_PASSWORD(HttpStatus.BAD_REQUEST,  "비밀번호가 일치하지 않습니다."),

    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND,  "해당 리소스를 찾을 수 없습니다.");


    private final HttpStatus status;
    private final String message;
}
