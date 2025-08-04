package com.A409.backend.global.exception;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.response.ApiResponse;
import io.jsonwebtoken.JwtException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 커스텀 예외 처리
    @ExceptionHandler(CustomException.class)
    public ApiResponse<?> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        return ApiResponse.ofFail(errorCode);
    }
    // 그 외 예외 처리 (알 수 없는 에러)
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleException(Exception e) {
        return ApiResponse.ofFail(ErrorCode.INVALID_ERROR);
    }
}
