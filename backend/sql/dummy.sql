-- 1. auth
INSERT INTO auth (email)
VALUES ('dksdks@kakao.com');

-- 2. hospital
INSERT INTO hospital (hospital_code, name, registration_number, profile, location, contact) VALUES
                                                                                                ('HSP001', '행복동물병원', '123-45-67890', '친절한 진료와 최신 장비', '서울 강남구 테헤란로 123', '02-123-4567'),
                                                                                                ('HSP002', '러브펫병원', '234-56-78901', '반려동물 전문병원', '서울 마포구 월드컵북로 45', '02-234-5678'),
                                                                                                ('HSP003', '펫케어센터', '345-67-89012', '24시간 응급진료', '부산 해운대구 센텀로 50', '051-345-6789'),
                                                                                                ('HSP004', '웰니스동물병원', '456-78-90123', '건강검진 및 예방접종 전문', '대구 수성구 동대구로 77', '053-456-7890'),
                                                                                                ('HSP005', '스마일펫병원', '567-89-01234', '수술 전문 동물병원', '광주 서구 화정로 88', '062-567-8901');

-- 3. pet
INSERT INTO pet (pet_code, name, species, photo, gender, age,weight)
VALUES ('PET001', '초코', 'DOG', NULL, 'MALE', 3,15),
       ('PET002', '나비', 'CAT', NULL, 'FEMALE', 2,20),
       ('PET003', '망고', 'DOG', NULL, 'MALE', 5,10),
       ('PET004', '루루', 'OTHER', NULL, 'FEMALE', 1,5),
       ('PET005', '보리', 'DOG', NULL, 'MALE', 4,2);


-- 5. owner (auth 참조)
INSERT INTO owner (auth_id, name, phone, birth)
VALUES (1, '안성수', '010-1111-2222', '1985-03-15');

-- 6. vet (hospital, auth 참조)
INSERT INTO vet (hospital_id, auth_id, name, license, profile, photo)
VALUES (1, 1, '홍길동', 'VET-12345', '내과 전문', NULL);

INSERT INTO staff (hospital_id, auth_id, name)
VALUES (1, 1, '오하늘');

-- 8. owner_pet
INSERT INTO owner_pet (owner_id, pet_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (1, 5);

-- 9. working_hour
INSERT INTO working_hour (vet_id, day, start_time, end_time)
VALUES (1, 'MON', 9, 18),
       (1, 'Tue', 9, 18),
       (1, 'Wed', 9, 18),
       (1, 'Thu', 9, 18),
       (1, 'Fri', 9, 18),
       (1, 'Sat', 9, 18),
       (1, 'Sun', 9, 18);

INSERT INTO reservation (owner_id, pet_id, hospital_id, vet_id, reservation_day, reservation_time, photo, description,
                         subject, status,is_revisit)
VALUES (1, 1, 1, 1, '2025-08-01', 10, NULL, '정기검진', 'DENTAL', 'COMPLETED',FALSE),
       (1, 1, 1, 1, '2025-08-02', 10, NULL, '정기검진', 'OPHTHALMOLOGY', 'REQUESTED',TRUE)	;

INSERT INTO first_treatment (hospital_id, pet_id, owner_id)
VALUES (1, 1, 1);

INSERT INTO treatment (reservation_id,hospital_id, vet_id,owner_id, pet_id, is_completed, start_time, end_time, result, ai_summary)
VALUES (1, 1,1, 1,1, 1, '2025-08-01 10:00:00', '2025-08-01 10:30:00', '이상 없음', '정기검진 양호');
