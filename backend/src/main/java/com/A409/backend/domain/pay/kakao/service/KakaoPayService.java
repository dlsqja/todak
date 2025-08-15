package com.A409.backend.domain.pay.kakao.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.pay.kakao.dto.*;
import com.A409.backend.domain.pay.kakao.entity.Payment;
import com.A409.backend.domain.pay.kakao.repository.PaymentRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.repository.OwnerRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final PaymentRepository paymentRepository;
    private final HospitalRepository hospitalRepository;

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
        Owner owner = ownerRepository.findById(ownerId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

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
        owner.setSID(sid);
        ownerRepository.save(owner);
        redisService.deleteByKey(redisKey);
    }

    @Transactional
    public void pay(KakaoPayRequest req) {
        String url = props.getHost() + "/v1/payment/subscription";
        Payment payment = paymentRepository.findByPaymentId(req.getPayment_id())
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));

        Hospital hospital = payment.getHospital();
        Owner owner = payment.getOwner();
        String sid = owner.getSID();
        if (sid == null) {
            throw new CustomException(ErrorCode.PAYMENT_FAIL);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + props.getAdminKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("cid", props.getCid());
        body.put("sid", sid);
        body.put("partner_order_id", "sub-" + owner.getOwnerId());
        body.put("partner_user_id",  owner.getOwnerId());
        body.put("item_name", hospital.getName() + "진료비");
        body.put("quantity", 1L);
        body.put("total_amount", req.getTotal_amount());
        body.put("tax_free_amount", 0);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<KakaoApproveResponse> res = rest.postForEntity(url, entity, KakaoApproveResponse.class);
        if (res.getBody() == null) {
            throw new CustomException(ErrorCode.PAYMENT_FAIL);
        }
        payment.setIsCompleted(true);
        payment.setTid(res.getBody().getTid());
        paymentRepository.save(payment);
    }

    @Transactional
    public List<Payment> getPaymentList(Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new CustomException(ErrorCode.HOSPITAL_NOT_FOUND));
        List<Payment> list = paymentRepository.findByHospital(hospital);

        return list;
    }
}

