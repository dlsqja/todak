package com.A409.backend.global.security.jwt;

import com.A409.backend.global.enums.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ExceptionHandlerFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try{
            filterChain.doFilter(request, response);
        }catch (ExpiredJwtException e){
            setErrorResponse(response, ErrorCode.AUTH_TOKEN_EXPIRED);
        }catch (JwtException | IllegalArgumentException e){
            setErrorResponse(response, ErrorCode.AUTH_INVALID_TOKEN);
        }catch (Exception e){
            setErrorResponse(response, ErrorCode.INVALID_ERROR);
        }
    }
    private void setErrorResponse(
            HttpServletResponse response,
            ErrorCode errorCode
    ){
        ObjectMapper objectMapper = new ObjectMapper();
        response.setStatus(errorCode.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        Map<String,Object> map = Map.of("message",errorCode.getMessage(),"data","");
        try{
            response.getWriter().write(objectMapper.writeValueAsString(map));
        }catch (IOException e){
            e.printStackTrace();
        }
    }
}
