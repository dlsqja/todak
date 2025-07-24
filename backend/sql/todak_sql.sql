-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.4.6 - MySQL Community Server - GPL
-- 서버 OS:                        Linux
-- HeidiSQL 버전:                  12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 todak.auth 구조 내보내기
CREATE TABLE IF NOT EXISTS `auth` (
  `auth_id` bigint NOT NULL AUTO_INCREMENT,
  `auth_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '구분용 base64 문자열',
  PRIMARY KEY (`auth_id`),
  UNIQUE KEY `auth_code` (`auth_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.closing_hour 구조 내보내기
CREATE TABLE IF NOT EXISTS `closing_hour` (
  `closing_id` bigint NOT NULL AUTO_INCREMENT,
  `vet_id` bigint NOT NULL,
  `time` tinyint NOT NULL COMMENT '0~47 (00:00 - 24:00)',
  PRIMARY KEY (`closing_id`),
  KEY `vet_id` (`vet_id`),
  CONSTRAINT `closing_hour_ibfk_1` FOREIGN KEY (`vet_id`) REFERENCES `vet` (`vet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.first_treatment 구조 내보내기
CREATE TABLE IF NOT EXISTS `first_treatment` (
  `first_treatment_id` bigint NOT NULL AUTO_INCREMENT,
  `hospital_id` bigint NOT NULL,
  `pet_id` bigint NOT NULL,
  `owner_id` bigint NOT NULL,
  PRIMARY KEY (`first_treatment_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `pet_id` (`pet_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `first_treatment_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `first_treatment_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`),
  CONSTRAINT `first_treatment_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.hospital 구조 내보내기
CREATE TABLE IF NOT EXISTS `hospital` (
  `hospital_id` bigint NOT NULL AUTO_INCREMENT,
  `hospital_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '우리 구분용 랜덤번호',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `registration_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profile` text,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`hospital_id`),
  UNIQUE KEY `hospital_code` (`hospital_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.owner 구조 내보내기
CREATE TABLE IF NOT EXISTS `owner` (
  `owner_id` bigint NOT NULL AUTO_INCREMENT,
  `owner_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '구분용 base64 문자열',
  `auth_id` bigint NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `birth` date NOT NULL,
  PRIMARY KEY (`owner_id`),
  UNIQUE KEY `owner_code` (`owner_code`),
  KEY `auth_id` (`auth_id`),
  CONSTRAINT `owner_ibfk_1` FOREIGN KEY (`auth_id`) REFERENCES `auth` (`auth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.owner_pet 구조 내보내기
CREATE TABLE IF NOT EXISTS `owner_pet` (
  `owner_pet_id` bigint NOT NULL AUTO_INCREMENT,
  `owner_id` bigint NOT NULL,
  `pet_id` bigint NOT NULL,
  PRIMARY KEY (`owner_pet_id`),
  KEY `owner_id` (`owner_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `owner_pet_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`),
  CONSTRAINT `owner_pet_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.payment 구조 내보내기
CREATE TABLE IF NOT EXISTS `payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `log` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: 미결제, 1: 결제',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.pet 구조 내보내기
CREATE TABLE IF NOT EXISTS `pet` (
  `pet_id` bigint NOT NULL AUTO_INCREMENT,
  `pet_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '구분용 base64 문자열',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `species` enum('DOG','CAT','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','NON') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'NON',
  `age` tinyint NOT NULL DEFAULT '5',
  PRIMARY KEY (`pet_id`),
  UNIQUE KEY `pet_code` (`pet_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.rejection 구조 내보내기
CREATE TABLE IF NOT EXISTS `rejection` (
  `rejection_id` bigint NOT NULL AUTO_INCREMENT,
  `reservation_id` bigint NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`rejection_id`),
  KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `rejection_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.reservation 구조 내보내기
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` bigint NOT NULL AUTO_INCREMENT,
  `owner_id` bigint NOT NULL COMMENT '반려인',
  `pet_id` bigint NOT NULL,
  `hospital_id` bigint NOT NULL,
  `vet_id` bigint NOT NULL COMMENT '수의사',
  `reservation_day` date NOT NULL COMMENT '날짜',
  `reservation_time` tinyint NOT NULL COMMENT '시간 (0~47)',
  `photo` varchar(255) DEFAULT NULL,
  `description` text,
  `subject` enum('치과','피부과','골절','안과') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '치과' COMMENT '0: 치과, 1: 피부과, 2: 골절, 3: 안과',
  `status` enum('신청','승인','반려','완료') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '신청' COMMENT '0: 신청, 1: 승인, 2: 반려, 3: 완료',
  PRIMARY KEY (`reservation_id`),
  KEY `owner_id` (`owner_id`),
  KEY `pet_id` (`pet_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `vet_id` (`vet_id`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`),
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `reservation_ibfk_4` FOREIGN KEY (`vet_id`) REFERENCES `vet` (`vet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.staff 구조 내보내기
CREATE TABLE IF NOT EXISTS `staff` (
  `staff_id` bigint NOT NULL AUTO_INCREMENT,
  `staff_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '구분용 base64 문자열',
  `auth_id` bigint NOT NULL,
  `hospital_id` bigint NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `staff_code` (`staff_code`),
  KEY `auth_id` (`auth_id`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`auth_id`) REFERENCES `auth` (`auth_id`),
  CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.treatment 구조 내보내기
CREATE TABLE IF NOT EXISTS `treatment` (
  `treatment_id` bigint NOT NULL AUTO_INCREMENT,
  `reservation_id` bigint NOT NULL,
  `vet_id` bigint NOT NULL COMMENT '수의사',
  `pet_id` bigint NOT NULL,
  `is_completed` tinyint NOT NULL DEFAULT '0' COMMENT '0: 대기, 1: 완료',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `result` text,
  `ai_summary` text COMMENT 'AI 요약',
  PRIMARY KEY (`treatment_id`),
  KEY `reservation_id` (`reservation_id`),
  KEY `vet_id` (`vet_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `treatment_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`),
  CONSTRAINT `treatment_ibfk_2` FOREIGN KEY (`vet_id`) REFERENCES `vet` (`vet_id`),
  CONSTRAINT `treatment_ibfk_3` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.vet 구조 내보내기
CREATE TABLE IF NOT EXISTS `vet` (
  `vet_id` bigint NOT NULL AUTO_INCREMENT,
  `vet_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '구분용 base64 문자열',
  `hospital_id` bigint NOT NULL,
  `auth_id` bigint NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `license` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profile` text,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`vet_id`),
  UNIQUE KEY `vet_code` (`vet_code`),
  KEY `hospital_id` (`hospital_id`),
  KEY `auth_id` (`auth_id`),
  CONSTRAINT `vet_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `vet_ibfk_2` FOREIGN KEY (`auth_id`) REFERENCES `auth` (`auth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 todak.working_hour 구조 내보내기
CREATE TABLE IF NOT EXISTS `working_hour` (
  `working_id` bigint NOT NULL AUTO_INCREMENT,
  `vet_id` bigint NOT NULL,
  `day` enum('0','1','2','3','4','5','6') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '요일(0~6)',
  `start_time` tinyint NOT NULL COMMENT '0~47 (00:00 - 24:00)',
  `end_time` tinyint NOT NULL COMMENT '0~47 (00:00 - 24:00)',
  PRIMARY KEY (`working_id`),
  KEY `vet_id` (`vet_id`),
  CONSTRAINT `working_hour_ibfk_1` FOREIGN KEY (`vet_id`) REFERENCES `vet` (`vet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
