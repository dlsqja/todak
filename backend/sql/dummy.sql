-- 1. auth
INSERT INTO auth (email)
VALUES ('ssafy1@ssafy.com'),
       ('ssafy2@ssafy.com'),
       ('ssafy3@ssafy.com'),
       ('ssafy4@ssafy.com'),
       ('ssafy5@ssafy.com'),
       ('ssafy6@ssafy.com'),
       ('ssafy7@ssafy.com'),
       ('ssafy8@ssafy.com'),
       ('ssafy9@ssafy.com'),
       ('ssafy10@ssafy.com');

-- 2. hospital
-- csv파일로 넣기 or 활성화
INSERT INTO hospital (hospital_code, name, registration_number, profile, location, contact) VALUES
('HSP001', '행복동물병원', '123-45-67890', '친절한 진료와 최신 장비', '서울 강남구 테헤란로 123', '02-123-4567'),
('HSP002', '러브펫병원', '234-56-78901', '반려동물 전문병원', '서울 마포구 월드컵북로 45', '02-234-5678'),
('HSP003', '펫케어센터', '345-67-89012', '24시간 응급진료', '부산 해운대구 센텀로 50', '051-345-6789'),
('HSP004', '웰니스동물병원', '456-78-90123', '건강검진 및 예방접종 전문', '대구 수성구 동대구로 77', '053-456-7890'),
('HSP005', '스마일펫병원', '567-89-01234', '수술 전문 동물병원', '광주 서구 화정로 88', '062-567-8901');


-- 3. pet
INSERT INTO pet (pet_code, name, species, photo, gender, age)
VALUES ('PET001', '초코', 'DOG', NULL, 'MALE', 3),
       ('PET002', '나비', 'CAT', NULL, 'FEMALE', 2),
       ('PET003', '망고', 'DOG', NULL, 'MALE', 5),
       ('PET004', '루루', 'OTHER', NULL, 'FEMALE', 1),
       ('PET005', '보리', 'DOG', NULL, 'MALE', 4);


-- 4. payment (예시)
-- INSERT INTO payment (log, status)
-- VALUES ('진료비 결제', 1);

-- 5. owner (auth 참조)
INSERT INTO owner (auth_id, name, phone, birth)
VALUES (1, '김철수', '010-1111-2222', '1985-03-15'),
       (2, '이영희', '010-2222-3333', '1990-07-20'),
       (3, '박민수', '010-3333-4444', '1978-11-05');


-- 6. vet (hospital, auth 참조)
INSERT INTO vet (hospital_id, auth_id, name, license, profile, photo)
VALUES (1, 4, '홍길동', 'VET-12345', '내과 전문', NULL),
       (2, 5, '김수진', 'VET-23456', '외과 전문', NULL),
       (3, 6, '이정훈', 'VET-34567', '안과 전문', NULL);


-- 7. staff
INSERT INTO staff (hospital_id, auth_id, name)
VALUES (1, 7, '오하늘'),
       (2, 8, '윤태양'),
       (3, 9, '장미소');

-- 8. owner_pet
INSERT INTO owner_pet (owner_id, pet_id)
VALUES (1, 1),
       (1, 2),
       (2, 3),
       (2, 4),
       (3, 5),
       (3, 1);


-- 9. working_hour
INSERT INTO working_hour (vet_id, day, start_time, end_time)
VALUES (1, 'MON', 9, 18),
       (1, 'Tue', 9, 18),
       (1, 'Wed', 9, 18),
       (1, 'Thu', 9, 18),
       (1, 'Fri', 9, 18),
       (1, 'Sat', 9, 18),
       (1, 'Sun', 9, 18),
       (2, 'MON', 10, 19),
       (2, 'Tue', 10, 19),
       (2, 'Wed', 10, 19),
       (2, 'Thu', 10, 19),
       (2, 'Fri', 10, 19),
       (2, 'Sat', 10, 19),
       (2, 'Sun', 10, 19),
       (3, 'MON', 8, 17),
       (3, 'Tue', 8, 17),
       (3, 'Wed', 8, 17),
       (3, 'Thu', 8, 17),
       (3, 'Fri', 8, 17),
       (3, 'Sat', 8, 17),
       (3, 'Sun', 8, 17);

-- 10. closing_hour
INSERT INTO closing_hour (vet_id, time)
VALUES (1, 10),
       (1, 11),
       (2, 20),
       (2, 21),
       (3, 8),
       (3, 9);

-- 특정 시간 휴무

-- 11. reservation
INSERT INTO reservation (owner_id, pet_id, hospital_id, vet_id, reservation_day, reservation_time, photo, description,
                         subject, status)
VALUES (1, 1, 1, 1, '2025-08-01', 10, NULL, '정기검진', '치과', '신청'),
       (1, 2, 1, 1, '2025-08-02', 15, NULL, '피부 발진', '피부과', '승인'),
       (2, 3, 2, 2, '2025-08-03', 20, NULL, '다리 절뚝거림', '골절', '신청'),
       (2, 4, 2, 2, '2025-08-04', 5, NULL, '눈물 과다', '안과', '승인'),
       (3, 5, 3, 3, '2025-08-05', 8, NULL, '스케일링', '치과', '완료'),
       (3, 1, 3, 3, '2025-08-06', 18, NULL, '귀 염증', '피부과', '반려');

-- 12. first_treatment
INSERT INTO first_treatment (hospital_id, pet_id, owner_id)
VALUES (1, 1, 1),
       (1, 2, 1),
       (2, 3, 2),
       (2, 4, 2),
       (3, 5, 3);


-- 13. treatment (얘는 진료를 봐야 생기는 것)
 INSERT INTO treatment (reservation_id, vet_id,owner_id, pet_id, is_completed, start_time, end_time, result, ai_summary)
 VALUES (13, 1, 1,1, 1, '2025-08-01 10:00:00', '2025-08-01 10:30:00', '이상 없음', '정기검진 양호'),
        (14, 1, 1,1, 0, '2025-08-02 15:00:00', '2025-08-02 15:40:00', '약 처방', '피부 발진 치료'),
        (15, 1, 1,2, 0, '2025-08-03 20:00:00', NULL, NULL, NULL),
        (16, 1, 1,2, 0, '2025-08-04 05:00:00', '2025-08-04 05:20:00', '안약 처방', '결막염 치료'),
       (17, 1, 1,3, 1, '2025-08-05 08:00:00', '2025-08-05 08:50:00', '스케일링 완료', '치석 제거'),
        (18, 1, 1,3, 1, '2025-08-06 18:00:00', '2025-08-06 18:40:00', '항생제 투여', '외이염 치료');

-- 14. rejection
INSERT INTO rejection (reservation_id, reason)
VALUES (17, '환자가 싸가지가 없음'),
       (18, '예약 시간 중복');

