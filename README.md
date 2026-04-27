# 🧑‍💼 다온일 (Daonil)
<p style="margin-top: 30px;">
  <img width="70" height="70" alt="daonil-logo" src="https://github.com/user-attachments/assets/2cb1b158-3077-462a-b1fc-5eb6f163cecd" />
</p>
> 장애인 맞춤형 채용 정보 플랫폼 및 AI 기반 일자리 추천 서비스

---

## 📌 프로젝트 개요

- **주제**: 장애인 맞춤형 채용 정보 플랫폼 및 AI 기반 일자리 추천  
- **대상**: 장애인 구직자 및 채용 기업  
- **목적**: 장애 유형별 맞춤 일자리 추천 및 취업 지원  

**다온일 (Daonil)**  
: “모두에게 온 일자리 기회”를 의미하는 장애인 특화 채용 플랫폼

---

## 🚀 주요 기능

### 👤 구직자
- 채용 정보 검색 및 필터링
- AI 기반 맞춤 일자리 추천
- 이력서 작성 및 관리
- 채용 지원 및 상태 추적
- 마이페이지
- 커뮤니티 (게시글, 댓글, 좋아요)
- 공지사항 및 알림

### 🏢 기업 회원
- 채용 공고 등록 및 관리
- 공고 마감 및 일정 관리
- 지원자 관리 (상태 변경)
- 기업 마이페이지

---

## 🌟 차별화 포인트

### 1️⃣ 장애 특성 기반 추천
- 33개 직업군 가중치 기반 매칭
- 장애 유형별 직무 적합도 계산

### 2️⃣ AI 자연어 추천
- 자연어 질문 기반 공고 추천
- 텍스트 임베딩 기반 의미 검색
- 추천 이유 제공

### 3️⃣ 장애인 맞춤 UI/UX
- 환경 설정 기반 필터링
- 장애 유형별 근무 환경 정보 제공

### 4️⃣ 공공데이터 연동 (설계)
- 자격증 및 시험 정보 연동
- 최신 공고 및 일정 반영

---

## 👥 역할 분담

| 👤 이름 | 🛠 주요 역할 |
|--------|------------|
| **이민홍** | 채용 공고 및 기업 관리 |
| **황보혜** | 게시판 및 이력서 기능 |
| **송지훈** | 로그인·회원가입(OAuth2), AI 챗봇 |
| **전큰별** | 프론트엔드 구현 및 문서 정리 |


## 🛠 기술 스택

### 🎨 Frontend
- React 19
- Tailwind CSS
- Axios

### ⚙️ Backend
- Spring Boot 3.5.13
- Java 17
- MySQL
- Spring Data JPA
- Spring Security + OAuth2
- JWT
- Lombok
- Spring Validation

### 🤖 AI / ML
- GPT-4o-mini (OpenAI API)
- text-embedding-3-small
- Gradle

### 🔧 Version Control
- Git
- GitHub
- ESLint 9

---

## 📂 프로젝트 구조


### 🖥 Backend
```
backend/
├── src/main/java/com/sprint/daonil/
│   ├── domain/                 # 🚀 핵심 비즈니스 로직
│   │   ├── alarm/              # 실시간/비동기 알림 서비스
│   │   ├── apply/              # 채용 지원 및 상태 관리
│   │   ├── certificate/        # 자격증 정보 연동 및 관리
│   │   ├── community/          # 게시판 및 커뮤니티 기능
│   │   ├── jobposting/         # 채용 공고(대/소분류) 관리
│   │   ├── member/             # 회원가입, 로그인(OAuth2), 보안
│   │   ├── profile/            # 장애 특화 프로필 및 이력서
│   │   └── resume/             # 온라인 이력서 상세 관리
│   ├── global/                 # 🌏 공통 모듈 및 설정
│   │   ├── config/             # JPA, Security 설정
│   │   ├── error/              # 공통 예외 처리
│   │   └── security/           # JWT, OAuth2 인증 로직
│   └── infra/                  # 🛠️ 외부 인프라 연동
│       └── ai/                 # AI 임베딩 및 벡터 검색
├── src/main/resources/
│   └── application.yml         # 환경 설정
└── build.gradle                # 의존성 관리
```

### 🌐 Frontend
```
frontend/
├── public/                     # 🖼️ 정적 리소스
├── src/
│   ├── api/                    # Axios 및 API 호출
│   ├── assets/                 # 스타일 및 이미지
│   ├── components/             # 재사용 UI 컴포넌트
│   │   ├── common/             # 공용 컴포넌트
│   │   └── layout/             # 레이아웃 컴포넌트
│   ├── hooks/                  # 커스텀 훅
│   ├── pages/                  # 페이지 컴포넌트
│   ├── store/                  # 전역 상태 관리
│   └── utils/                  # 유틸 함수
├── index.html                  # 엔트리 파일
├── tailwind.config.js          # 스타일 설정
└── vite.config.js              # 빌드 설정
```
