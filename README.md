# 토닥
> 반려인의 병원 방문 번거로움을 해결하기 위한 반려동물 비대면 진료 서비스

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
</div>


## 1. 반려인
### 반려동물 관리
- **프로필 등록** : 반려동물의 정보를 프로필 형태로 등록하여 정보 열람 및 관리
<div class = "flex">
<img src="/images/동물등록1.gif" alt="예약 신청1" width="200" height="658">
<img src="/images/동물등록2.gif" alt="예약 신청2" width="200" height="658">
<img src="/images/동물등록3.gif" alt="예약 신청3" width="200" height="658">
</div>

  
### 진료 내역 조회
- **예약 요약 제공** : 작성했던 진료 신청서 내용을 요약해 어떤 진료 내역인지 한눈에 확인 가능
- **AI 요약 진단서** : 수의사의 검증을 거친 AI 요약 진단서 보관
<img src="/images/진료내역상세.gif" alt="예약 시간 설정 1" width="200">

### 예약 신청
- **신청서 작성** : 원하는 병원과 수의사를 검색 후 선택하고, 증상 입력
- **자동 결제 수단 선택** : 카카오페이 결제를 통해 예약을 확정하고 승인 대기 상태로 전환
<div class = "flex">
<img src="/images/예약 신청1.gif" alt="예약 신청1" width="200" height="658">
<img src="/images/예약 신청2.gif" alt="예약 신청2" width="200" height="658">
<img src="/images/예약 신청3.gif" alt="예약 신청3" width="200" height="658">
</div>

## 2. 수의사
### 비대면 진료
- **실시간 1:1진료** : Kurento 기반 WebRTC 기술을 활용하여 원격 화상 진료 지원
<div class = "flex">
<img src="/images/비대면진료1.gif" alt="비대면진료1" width="245">
<img src="/images/비대면진료2.gif" alt="비대면진료2" width="200">
</div>

### 진단서 검토
- **STT → text 변환** : Whisper-1을 이용해 비대면 진료 중 음성을 텍스트 파일로 변환
- **AI text 요약** : 의료 용어가 많은 텍스트를 ChatGPT 4.1을 통해 핵심 내용 요약
- **수의사 검증** : 수의사의 검토 절차를 통해 수정, 승인
<img src="/images/진단서 검토.gif" alt="수의사진료상세" width="200">

## 3. 병원 관계자
### 진료 일정 관리
- **예약 시간 설정** : 버튼 토클 방식으로 진료 가능/불가 시간 설정
<div class = "flex">
<img src="/images/예약 시간 설정 1.gif" alt="예약 시간 설정 1" width="200">
<img src="/images/예약 시간 설정 2.gif" alt="예약 시간 설정 2" width="200">
</div>

### 예약 관리
- **신청 목록 확인** : 전체 예약 내역을 조회하고, 내용을 검토한 뒤 승인 또는 반려 처리 가능
<div class = "flex">
<img src="/images/예약승인.gif" alt="예약 승인" width="200" height="658">
<img src="/images/예약반려.gif" alt="예약 반려" width="200" height="658">
</div>

### 결제 관리
- **수납** : 진료 종료 후 결제 금액 입력 → 자동 결제 요청
<img src="/images/원무.gif" alt="예약 시간 설정 1" width="200">

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
TODAK/
│
├── frontend/                               # React + Vite + TypeScript 기반 프론트엔드
│   ├── public/                             # 정적 리소스 (이미지, 아이콘 등)
│   ├── src/                                # 주요 프론트엔드 소스코드
│   │   ├── assets/                         # 이미지/폰트 등 정적 자원
│   │   ├── component/                      # 공통 UI 컴포넌트 (Atomic Design)
│   │   │   ├── button/                     # 버튼 컴포넌트
│   │   │   ├── card/                       # 카드형 UI (진료/예약 등)
│   │   │   ├── header/                     # 상단 헤더 컴포넌트
│   │   │   ├── icon/                       # SVG/PNG 기반 아이콘 컴포넌트
│   │   │   ├── input/                      # 입력 관련 UI (검색, 파일 업로드 등)
│   │   │   ├── menubar/                    # 역할별 하단 메뉴바 (Owner, Staff, Vet)
│   │   │   ├── navbar/                     # 탭 네비게이션 UI
│   │   │   ├── pages/                      # 페이지 단위 컴포넌트
│   │   │   │   ├── auth/                   # 인증/회원가입/로그인 관련 페이지
│   │   │   │   ├── Owner/                  # 반려인(사용자) 관련 페이지
│   │   │   │   ├── Staff/                  # 병원 직원 관련 페이지
│   │   │   │   └── Vet/                    # 수의사 관련 페이지
│   │   │   ├── selection/                  # 드롭다운, 시간 선택 등 선택 UI
│   │   │   ├── state/                      # 상태 뱃지 등 시각화 컴포넌트
│   │   │   ├── table/                      # 표/시간표 UI
│   │   │   ├── template/                   # 모달, 요약 등 템플릿형 UI
│   │   │   └── text/                       # 텍스트/컨텐츠 출력용 컴포넌트
│   │   ├── fonts/                          # 폰트 파일
│   │   ├── layouts/                        # 페이지 레이아웃 (모바일, 메인 등)
│   │   ├── plugins/                        # 외부 플러그인 설정 (axios 등)
│   │   ├── router/                         # React Router 경로 관리
│   │   ├── RTC/                            # WebRTC 연결 로직
│   │   ├── services/                       # API 호출 서비스
│   │   ├── store/                          # Zustand 전역 상태 관리
│   │   ├── styles/                         # CSS/Tailwind 스타일 정의
│   │   ├── types/                          # TypeScript 타입 정의
│   │   └── utils/                          # 유틸 함수 모음
│   ├── 설정 파일들                          # (Dockerfile, ESLint, Vite, TSConfig 등)
│
├── backend/                                # Spring Boot 기반 백엔드
│   ├── gradle/                             # Gradle Wrapper 설정
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/A409/backend/      # 백엔드 Java 코드
│   │   │   │   ├── BackendApplication.java # Spring Boot 실행 메인
│   │   │   │   └── domain/                 # 도메인 계층
│   │   │   │       ├── home/               # 홈/기본 컨트롤러
│   │   │   │       ├── hospital/           # 병원 (엔티티, 레포지토리, 서비스)
│   │   │   │       ├── pay/                # 결제 (카카오페이 연동)
│   │   │   │       ├── pet/                # 반려동물 관리
│   │   │   │       ├── reservation/        # 예약 관리
│   │   │   │       ├── treatment/          # 진료 관리
│   │   │   │       ├── user/               # 사용자 (auth/owner/staff/vet)
│   │   │   │       ├── websocket/          # WebSocket + Kurento 시그널링
│   │   │   │       └── global/             # 공통 설정/유틸 (AI, 보안, 예외, Redis 등)
│   │   │   └── resources/                  # 설정 파일 (application.properties 등)
│   │   └── test/                           # 테스트 코드
│   ├── 빌드/배포 설정                       # (Gradle, Dockerfile, Jenkinsfile 등)
│
├── images/                                 # 프로젝트 관련 이미지 및 시연 GIF
│   ├── ERD.png                             # 데이터베이스 ERD
│   ├── mainpage.png                        # 메인 페이지 화면
│   ├── 시스템_아키텍처.png                  # 전체 시스템 아키텍처 다이어그램
│   ├── 목업.png                             # UI 목업 이미지
│   └── ...                                 # 시연 GIF, 화면 캡처 등
│
├── package.json                            # 루트 프로젝트 설정 (워크스페이스)
└── README.md                               # 전체 프로젝트 문서
```

# 👥팀원 소개
| 이대연 | 김유성 | 송인범 | 안성수 | 전윤지 | 한진경 |
|-------------|--------|--------|--------|--------|--------|
| FE, 팀장         | BE     | BE     | BE     | FE     | FE     |




