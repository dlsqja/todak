CREATE TABLE auth (
  auth_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  auth_code VARCHAR(6) UNIQUE COMMENT '구분용 base64 문자열'
);

CREATE TABLE hospital (
  hospital_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  hospital_code VARCHAR(6) UNIQUE COMMENT '우리 구분용 랜덤번호',
  name VARCHAR(100),
  registration_number VARCHAR(30),
  profile TEXT,
  location VARCHAR(255),
  contact VARCHAR(50)
);

CREATE TABLE owner (
  owner_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  owner_code VARCHAR(6) UNIQUE COMMENT '구분용 base64 문자열',
  auth_id BIGINT,
  name VARCHAR(20),
  email VARCHAR(100),
  phone VARCHAR(15),
  birth DATE,
  FOREIGN KEY (auth_id) REFERENCES auth(auth_id)
);

CREATE TABLE staff (
  staff_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  staff_code VARCHAR(6) UNIQUE COMMENT '구분용 base64 문자열',
  auth_id BIGINT,
  hospital_id BIGINT,
  name VARCHAR(100),
  FOREIGN KEY (auth_id) REFERENCES auth(auth_id),
  FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

CREATE TABLE vet (
  vet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  vet_code VARCHAR(6) UNIQUE COMMENT '구분용 base64 문자열',
  hospital_id BIGINT,
  auth_id BIGINT,
  name VARCHAR(20),
  license VARCHAR(25),
  profile TEXT,
  photo VARCHAR(255),
  FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id),
  FOREIGN KEY (auth_id) REFERENCES auth(auth_id)
);

CREATE TABLE pet (
  pet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pet_code VARCHAR(6) UNIQUE COMMENT '구분용 base64 문자열',
  name VARCHAR(30),
  species ENUM('DOG', 'CAT', 'OTHER'),  -- ENUM 값 필요 시 수정
  photo VARCHAR(255),
  gender ENUM('MALE', 'FEMALE'),
  age TINYINT
);

CREATE TABLE owner_pet (
  owner_pet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT,
  pet_id BIGINT,
  FOREIGN KEY (owner_id) REFERENCES owner(owner_id),
  FOREIGN KEY (pet_id) REFERENCES pet(pet_id)
);

CREATE TABLE first_treatment (
  first_treatment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  hospital_id BIGINT,
  pet_id BIGINT,
  owner_id BIGINT,
  FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id),
  FOREIGN KEY (pet_id) REFERENCES pet(pet_id),
  FOREIGN KEY (owner_id) REFERENCES owner(owner_id)
);

CREATE TABLE reservation (
  reservation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT COMMENT '반려인',
  pet_id BIGINT,
  hospital_id BIGINT,
  vet_id BIGINT COMMENT '수의사',
  reservation_day DATE COMMENT '날짜',
  reservation_time TINYINT COMMENT '시간 (0~47)',
  photo VARCHAR(255),
  description TEXT,
  subject ENUM('치과', '피부과', '골절', '안과') COMMENT '0: 치과, 1: 피부과, 2: 골절, 3: 안과',
  status ENUM('신청', '승인', '반려', '완료') COMMENT '0: 신청, 1: 승인, 2: 반려, 3: 완료',
  FOREIGN KEY (owner_id) REFERENCES owner(owner_id),
  FOREIGN KEY (pet_id) REFERENCES pet(pet_id),
  FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id),
  FOREIGN KEY (vet_id) REFERENCES vet(vet_id)
);

CREATE TABLE treatment (
  treatment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reservation_id BIGINT,
  vet_id BIGINT COMMENT '수의사',
  pet_id BIGINT,
  is_completed BOOLEAN COMMENT '0: 대기, 1: 완료',
  start_time DATETIME,
  end_time DATETIME,
  result TEXT,
  ai_summary TEXT COMMENT 'AI 요약',
  FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id),
  FOREIGN KEY (vet_id) REFERENCES vet(vet_id),
  FOREIGN KEY (pet_id) REFERENCES pet(pet_id)
);

CREATE TABLE rejection (
  rejection_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reservation_id BIGINT,
  reason TEXT,
  FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
);

CREATE TABLE working_hour (
  working_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  vet_id BIGINT,
  day ENUM('0', '1', '2', '3', '4', '5', '6') COMMENT '요일(0~6)',
  start_time TINYINT COMMENT '0~47 (00:00 - 24:00)',
  end_time TINYINT COMMENT '0~47 (00:00 - 24:00)',
  FOREIGN KEY (vet_id) REFERENCES vet(vet_id)
);

CREATE TABLE closing_hour (
  closing_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  vet_id BIGINT,
  time TINYINT COMMENT '0~47 (00:00 - 24:00)',
  FOREIGN KEY (vet_id) REFERENCES vet(vet_id)
);

CREATE TABLE payment (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  log TEXT,
  status BOOLEAN COMMENT '0: 미결제, 1: 결제'
);
