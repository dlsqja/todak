package com.A409.backend.global.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;  // Lettuce 사용 기준
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.scheduling.annotation.EnableScheduling;

@Slf4j
@Configuration
@EnableScheduling
public class RedisConfig {

    //TODO:: 배포용

//    @Bean
//    public RedisConnectionFactory redisConnectionFactory() {
//
//        RedisSentinelConfiguration sentinelConfig = new RedisSentinelConfiguration()
//                .master("mymaster")
//                .sentinel("sentinel1", 26379)
//                .sentinel("sentinel2", 26380)
//                .sentinel("sentinel3", 26381);
//
//        return new LettuceConnectionFactory(sentinelConfig);
//    }


    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        template.afterPropertiesSet();
        return template;
    }

}
