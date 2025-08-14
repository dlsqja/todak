package com.A409.backend.global.pay.kakao.service;

import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.repository.OwnerRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.pay.kakao.dto.*;
import com.A409.backend.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

// KakaoPayClient.java
@Service
@RequiredArgsConstructor
public class KakaoPayService {
    private final KakaoPayProperties props;
    private final RestTemplate rest = new RestTemplate();
    private final OwnerRepository ownerRepository;
    private final RedisService redisService;

    public KakaoReadyResponse readyZero(KakaoReadyRequest req) {
        String url = props.getHost() + "/v1/payment/ready";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + props.getAdminKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("cid", props.getCid());                      // TCSUBSCRIP
        body.put("partner_order_id", req.getPartnerOrderId()); // 필수
        body.put("partner_user_id",  req.getPartnerUserId());  // 필수
        body.put("item_name", "정기결제 0원 인증");
        body.put("quantity", "1");
        body.put("total_amount", "0");                         // ✅ 0원
        body.put("tax_free_amount", "0");
        body.put("approval_url", req.getSuccessUrl());         // 성공 콜백
        body.put("cancel_url",   req.getCancelUrl());
        body.put("fail_url",     req.getFailUrl());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<KakaoReadyResponse> res =
                rest.postForEntity(url, entity, KakaoReadyResponse.class);

        return Objects.requireNonNull(res.getBody());
    }

    @Transactional
    public void registPay(Long ownerId, String token) {
        String url = props.getHost() + "/v1/payment/approve";
        String redisKey = "payment-" + ownerId;
        String tid = (String)redisService.getByKey(redisKey);
        if (tid == null) {
            throw new CustomException(ErrorCode.INVALID_ERROR);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + props.getAdminKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("cid", props.getCid());
        body.put("tid", tid);
        body.put("partner_order_id", "sub-" + ownerId);
        body.put("partner_user_id",  ownerId);
        body.put("pg_token", token);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<KakaoApproveResponse> res = rest.postForEntity(url, entity, KakaoApproveResponse.class);
        
        // sid를 저장하기
        if (res.getBody() == null) {
            throw new CustomException(ErrorCode.INVALID_ERROR);
        }
        String sid = res.getBody().getSid();
        Owner owner = ownerRepository.findById(ownerId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        owner.setSID(sid);
        ownerRepository.save(owner);
    }

    @Transactional
    public void pay(KakaoPayRequest req) {
        String url = props.getHost() + "/v1/payment/subscription";
        Long ownerId = Long.parseLong(req.getPartner_user_id());
        Owner owner = ownerRepository.findById(ownerId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        String sid = owner.getSID();
        if (sid == null) {
            throw new CustomException(ErrorCode.INVALID_ERROR);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + props.getAdminKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("cid", props.getCid());
        body.put("sid", sid);
        body.put("partner_order_id", req.getPartner_order_id());
        body.put("partner_user_id",  req.getPartner_user_id());
        body.put("item_name", req.getItem_name());
        body.put("quantity", req.getQuantity());
        body.put("total_amount", req.getTotal_amount());
//        body.put("vat_amount", req.getVat_amount());
        body.put("tax_free_amount", req.getTax_free_amount());

        System.out.println(body.toString());
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        // try - catch로 해야하나?
        ResponseEntity<KakaoApproveResponse> res = rest.postForEntity(url, entity, KakaoApproveResponse.class);
        if (res.getBody() == null) {
            throw new CustomException(ErrorCode.INVALID_ERROR);
        }
        System.out.println(res.getBody());
    }
}

