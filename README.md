# 토닥
> 반려인의 병원 방문 번거로움을 해결하기 위한 비대면 의료 서비스

![alt text](images/mainpage.png)

# 📜 목차
- [서비스 개요](#서비스-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [아키텍처 구성](#아키텍처-구성)
- [폴더 구조](#폴더-구조)
- [팀원 소개](#팀원-소개)


# 📝서비스 개요
병원 방문이 어려운 바쁜 반려인들을 위한 반려동물 **비대면 의료 서비스**입니다.

###  페르소나
**구름이를 키우는 반려인 '이반려'**
 - **문제점** : 
    - 약물 투여시기 결정을 위해 병원에서 주기적인 관찰 진료가 필요
    - 병원에 대한 스트레스가 높음
- **필요한 점** :
    - 병원에 방문하지 않고 관찰 진료 필요
    - 시간, 공간에 제약 없이 진료 필요

# ⚡주요 기능
> 토닥은 반려인, 수의사 , 병원 관계자 3가지의 사용자 유형이 존재
<div class=flex>
<img width="200" height="658" alt="반려인 홈" src="images/반려인 홈.png" />
<img width="200" height="658" alt="수의사 홈" src="images/수의사 홈.png" />
<img width="200" height="658" alt="병원관계자 홈" src="images/병원관계자 홈.png" />
</div
 
## 1. 반려인
### 진료 내역 조회
- **예약 요약 제공** : 작성했던 진료 신청서 내용을 요약해 어떤 진료 내역인지 한눈에 확인 가능
- **AI 요약 진단서** : 수의사의 검증을 거친 AI 요약 진단서 보관
<img width="238" height="506" alt="진료 내역 조회" src="https://github.com/user-attachments/assets/f5ce8ee5-8c27-4d58-89b0-2f90f7143cf9" />

### 예약 신청
- **신청서 작성** : 원하는 병원과 수의사를 검색 후 선택하고, 증상 입력
- **자동 결제 수단 선택** : 카카오페이 결제를 통해 예약을 확정하고 승인 대기 상태로 전환
<img width="238" height="506" alt="예약신청1" src="https://github.com/user-attachments/assets/51494d92-f505-49e6-adc0-2530ec0b5ac9" />
<img width="238" height="506" alt="예약신청2" src="https://github.com/user-attachments/assets/180fadff-1e2b-41ec-bc79-19496e421d2c" />
<img width="238" height="506" alt="예약신청4" src="https://github.com/user-attachments/assets/eea017a5-9175-4a7c-99e1-d1e5cf3637a0" />



## 2. 수의사
### 비대면 진료
- **실시간 1:1진료** : Kurento 기반 WebRTC 기술을 활용하여 원격 화상 진료 지원
<img width="238" height="506" alt="실시간 진료" src="https://github.com/user-attachments/assets/a16e916e-270d-4b31-8747-a47c1518d436" />


### 진단서 검토
- **STT → text 변환** : Whisper-1을 이용해 비대면 진료 중 음성을 텍스트 파일로 변환
- **AI text 요약** : 의료 용어가 많은 텍스트를 ChatGPT 4.1을 통해 핵심 내용 요약
- **수의사 검증** : 수의사의 검토 절차를 통해 수정, 승인
<img width="238" height="506" alt="진단서 검토" src="https://github.com/user-attachments/assets/3e756511-2eef-4781-8cdb-de38b3a0281f" />


## 3. 병원 관계자
### 진료 일정 관리
- **예약 시간 설정** : 버튼 토클 방식으로 진료 가능/불가 시간 설정
<img width="475" height="506" alt="예약 시간 설정" src="https://github.com/user-attachments/assets/d996a5f8-6154-4a18-a105-3fd9e1f1659e" />

### 예약 관리
- **신청 목록 확인** : 전체 예약 내역을 조회하고, 내용을 검토한 뒤 승인 또는 반려 처리 가능
<img width="475" height="506" alt="예약 관리" src="https://github.com/user-attachments/assets/61472b53-def7-4812-9f11-c5ca2fb69c10" />

### 원무
- **수납** : 진료 종료 후 결제 금액 입력 → 자동 결제 요청
<img width="475" height="506" alt="원무" src="https://github.com/user-attachments/assets/2d803ad7-06e9-4580-bb84-b1d7c3e79983" />

# 🛠기술 스택

### Frontend
- Language: TypeScript
- Framework: React 19
- UI/스타일링: TailwindCSS
- 상태 관리: Zustand
- 라우팅: React Router Dom
- 개발 도구: Vit

### Backend

- Language: Java 17
- Framework: Spring Boot 3.3.3
- Database: MySQL, Redis, Elasticsearch
- ORM: Spring Data JPA
- 인증/보안: JWT (jjwt), Spring Security
- 메시징 서비스: RabbitMQ
- API 문서화: Swagger
- 웹소켓: Spring WebSocket
- 개발 도구: Lombok, Devtools
- AI : GMS

### Infra 
- Containerization: Docker
- CI/CD: Jenkins
- Cloud: AWS ,S3 Bucket

# 📐아키텍처 구성 
### 시스템 아키텍처
![alt text](images/시스템_아키텍처.png)

### ERD
![alt text](images/ERD.png)

# 📂폴더 구조
- Frontend
```
src/
 └── component/
     ├── button/
     │    ├── Button.tsx
     │    └── CopyButton.tsx
     ├── card/
     │    ├── OwnerTreatmentSimpleCard.tsx
     │    ├── PetProfileCard.tsx
     │    ├── RemoteTreatmentCard.tsx
     │    ├── SearchListItem.tsx
     │    ├── TreatmentRecordCard.tsx
     │    ├── TreatmentSlideCard.tsx
     │    └── TreatmentSlideList.tsx
     ├── header/
     │    ├── BackHeader.tsx
     │    └── SimpleHeader.tsx
     ├── icon/
     │    ├── AnimalIcon.tsx
     │    ├── Dropdown_Arrow.tsx
     │    ├── HomelIcon.tsx
     │    ├── HospitalIcon.tsx
     │    ├── kakao_login.png
     │    ├── MyPageIcon.tsx
     │    ├── PlusIcon.tsx
     │    ├── RecordIcon.tsx
     │    ├── ReservationIcon.tsx
     │    ├── ReservationManagementIcon.tsx
     │    ├── TreatmentIcon.tsx
     │    └── VetManagementIcon.tsx
     ├── menubar/
     │    ├── OwnerMenuBar.tsx
     │    ├── StaffMenuBar.tsx
     │    └── VetMenuBar.tsx
     ├── navbar/
     │    ├── TabGroupPet.tsx
     │    ├── TabGroupRoles.tsx
     │    ├── TabGroupTime.tsx
     │    ├── TabGroupTreatList.tsx
     │    └── TabGroupWaiting.tsx
     ├── pages/
     │    ├── Owner/
     │    │    ├── OwnerHome.tsx
     │    │    ├── OwnerHomeApplyForm.tsx
     │    │    ├── OwnerHomeSelectHospital.tsx
     │    │    ├── OwnerHomeSelectVet.tsx
     │    │    ├── OwnerHomeVetInfo.tsx
     │    │    ├── OwnerPetEdit.tsx
     │    │    ├── OwnerPetHome.tsx
     │    │    ├── OwnerPetRegister.tsx
     │    │    └── petMockList.ts
     │    ├── Reservation/
     │    │    ├── OwnerReservationDetail.tsx
     │    │    └── OwnerReservationHome.tsx
     │    └── Treatment/
     │         ├── OwnerTreatment.tsx
     │         ├── OwnerTreatmentDetail.tsx
     │         ├── OwnerMyPage.tsx
     │         └── OwnerTreatment.tsx
     ├── selection/
     │    ├── FilterDropdown.tsx
     │    ├── SelectionDropdown.tsx
     │    ├── TimeSelectionButton.tsx
     │    ├── TimeSelectionDropdown.tsx
     ├── state/
     │    ├── StatusBadge.tsx
     │    └── ReservationTimeTable.tsx
     ├── table/
     │    └── ReservationTimeTable.tsx
     ├── template/
     │    ├── AiSummaryForVet.tsx
     │    └── ModalTemplate.tsx
     ├── text/
     │    ├── ImageContent.tsx
     │    ├── MultipleContent.tsx
     │    ├── MultipleContentApi.tsx
     │    ├── SingleContent.tsx
     │    ├── SummaryContent.tsx
     │    └── TreatmentListContent.tsx
 ├── fonts/
 ├── layouts/
 ├── router/
 ├── RTC/
 ├── store/
 ├── styles/
 ├── App.css
 ├── App.tsx
 ├── index.css
 └── main.tsx
 ```
- Backend
```
backend/
├── build.gradle
├── docker-compose.yml
├── Dockerfile
├── gradlew
├── gradlew.bat
├── Jenkinsfile
├── settings.gradle
├── .gitattributes
├── .gitignore
│
├── src/
│   ├── main/
│   │   ├── java/com/A409/backend/
│   │   │   ├── BackendApplication.java
│   │   │   └── domain/
│   │   │       ├── home/
│   │   │       │   └── controller/
│   │   │       │       └── HomeController.java
│   │   │       │
│   │   │       ├── hospital/
│   │   │       │   ├── entity/
│   │   │       │   └── repository/
│   │   │       │
│   │   │       ├── pet/
│   │   │       │   └── entity/
│   │   │       │       ├── OwnerPet.java
│   │   │       │       └── Pet.java
│   │   │       │
│   │   │       ├── reservation/
│   │   │       │   └── entity/
│   │   │       │       ├── FirstTreatment.java
│   │   │       │       ├── Rejection.java
│   │   │       │       ├── Reservation.java
│   │   │       │       └── Treatment.java
│   │   │       │
│   │   │       ├── user/
│   │   │       │   ├── auth/
│   │   │       │   │   ├── entity/
│   │   │       │   │   │   └── Auth.java
│   │   │       │   │   └── repository/
│   │   │       │   │       └── AuthRepository.java
│   │   │       │   │
│   │   │       │   ├── owner/
│   │   │       │   │   ├── controller/
│   │   │       │   │   ├── dto/
│   │   │       │   │   ├── entity/
│   │   │       │   │   ├── repository/
│   │   │       │   │   └── service/
│   │   │       │   │
│   │   │       │   ├── staff/
│   │   │       │   │   ├── controller/
│   │   │       │   │   ├── dto/
│   │   │       │   │   ├── entity/
│   │   │       │   │   ├── repository/
│   │   │       │   │   └── service/
│   │   │       │   │
│   │   │       │   └── vet/
│   │   │       │       ├── controller/
│   │   │       │       ├── dto/
│   │   │       │       ├── entity/
│   │   │       │       ├── repository/
│   │   │       │       └── service/
│   │   │       │
│   │   │       └── global/
│   │   │
│   │   └── resources/
│   │       ├── elasticsearch/
│   │       └── application.properties
│   │
│   └── test/
```

# 👥팀원 소개
| 이대연 | 김유성 | 송인범 | 안성수 | 전윤지 | 한진경 |
|-------------|--------|--------|--------|--------|--------|
| FE, 팀장         | BE     | BE     | BE     | FE     | FE     |




