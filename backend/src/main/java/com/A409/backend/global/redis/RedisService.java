package com.A409.backend.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Set;
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

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void clearClosingHours() {
        Set<String> keys = redisTemplate.keys("closinghours*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            System.out.println("자정 closingHours 삭제");
        }
    }
}
