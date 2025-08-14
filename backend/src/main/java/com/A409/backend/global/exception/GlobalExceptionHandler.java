package com.A409.backend.global.exception;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.response.APIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 커스텀 예외 처리
    @ExceptionHandler(CustomException.class)
    public APIResponse<?> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.warn(e.getMessage());
        return APIResponse.ofFail(errorCode);
    }
    // 그 외 예외 처리 (알 수 없는 에러)
    @ExceptionHandler(Exception.class)
    public APIResponse<?> handleException(Exception e) {
        log.warn(e.getMessage());
        return APIResponse.ofFail(ErrorCode.INVALID_ERROR,e.getMessage());
    }
}
