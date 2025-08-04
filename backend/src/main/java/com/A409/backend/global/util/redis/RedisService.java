package com.A409.backend.global.util.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;


    public Object getByKey(String cacheKey){
        return redisTemplate.opsForValue().get(cacheKey);
    }

    public void setByKey(String cacheKey,Object value){

        redisTemplate.opsForValue().set(cacheKey, value);
    }

    public void setByKeyWithTTL(String cacheKey,Object value,Long ttl){
        redisTemplate.opsForValue().set(cacheKey, value, ttl, TimeUnit.MINUTES);
    }
}
