# 개요

🪞 How Do I Look?

- 『How Do I Look』은 자신의 패션 스타일을 공유하고 다른 사용자들로부터 피드백을 받는 스타일 큐레이팅 서비스입니다.
- 당신의 OOTD(Outfit of the Day)를 공유하고, 다른 사람들의 스타일에 대한 평가를 통한 커뮤니티를 조성할 수 있습니다..
- 이번 초급 프로젝트는 Express.js 학습을 위한 실기 과정으로 진행되었으며, 웹 백엔드 개발의 기본적인 개념과 구조, 협업에 대해 학습할 수 있도록 설계되었습니다.
- 팀을 이뤄 진행하며 과제와 역할 등을 나누고, 프로젝트를 진행하는 과정에서 회의 및 문서작성 등의 과정을 통해 협업과 실무에 대해 학습할 수 있었습니다.

---

## ✨ 주요 기능 (Features)

### 👔 스타일 (Style)

- 스타일 게시: 여러 장의 사진(최대 10장), 제목, 설명, 태그와 함께 자신만의 스타일 등록
- 아이템 정보 추가: 스타일에 착용한 상의, 하의, 아우터, 신발 등 아이템별 브랜드명과 가격을 상세히 기록
- 관리: 게시물 등록 시 설정한 비밀번호를 통해 수정 및 삭제
- 갤러리: 등록된 모든 스타일을 한눈에 볼 수 있는 갤러리 제공
  - 정렬: 최신순, 조회순, 큐레이팅순 정렬
  - 검색: 닉네임, 제목, 상세 설명, 태그로 검색
- 상세조회: 각 스타일의 상세 정보와 함께 해당 스타일에 달린 모든 큐레이션과 답글 확인

### 🧐 큐레이팅 (Curation)

- 스타일 평가: 다른 사용자의 스타일에 대해 '트렌디, 개성, 실용성, 가성비' 4가지 항목으로 평가
- 한줄평: 점수와 함께 스타일에 대한 간단한 한 줄 코멘트를 남겨 피드백 공유
- 익명성 및 보안: 큐레이션 작성 시 닉네임과 비밀번호를 설정, 등록한 본인만 수정 및 삭제 가능

### 💬 답글 (Comment)

- 소통 기능: 스타일 게시자는 자신의 스타일에 달린 큐레이션에 대해 답글을 작성하여 다른 사용자들과 소통
- 제한된 답글: 각 큐레이션 당 하나의 답글만 등록할 수 있으며, 스타일 등록 시 사용한 비밀번호를 통해 인증된 사용자만 답글 작성 가능

### 🏆 랭킹 (Ranking)

- 스타일 랭킹: 전체 평점, 트렌디, 개성, 실용성, 가성비 등 각 항목별로 가장 높은 점수를 받은 스타일의 랭킹 확인

---

## 📊 데이터베이스 스키마 (ERD)

- 프로젝트의 데이터베이스 관계는 아래와 같습니다.
- 스키마는 `prisma/schema.prisma` 파일에 상세히 정의되어 있습니다.

```bash
erDiagram
    Style ||--o{ Image : "has"
    Style ||--o{ Item : "has"
    Style ||--o{ Curation : "receives"
    Style ||--o{ CurationComment : "has"
    Style }|..|{ Tag : "uses"

    Curation ||--|{ CurationComment : "has one"

    Style {
        Int id PK
        String nickname
        String title
        String content
        String password
        Decimal totalAverage
        Int viewCount
        Int curationCount
        DateTime createdAt
    }

    Image {
        Int id PK
        String url
        Boolean isThumbnail
        Int styleId FK
    }

    Item {
        Int id PK
        String itemName
        String brandName
        Decimal price
        Category category
        Int styleId FK
    }

    Tag {
        Int id PK
        String tag
        Int styleCount
        Int clickCount
    }

    Curation {
        Int id PK
        Int trendy
        Int personality
        Int practicality
        Int costEffectiveness
        String content
        String nickname
        String password
        Int styleId FK
    }

    CurationComment {
        Int id PK
        String content
        String password
        Int curationId FK
        Int styleId FK
    }

    enum Category {
        top
        bottom
        outer
        dress
        shoes
        bag
        accessory
    }
```

---

## 📡 API 엔드포인트

### Styles

- `POST /api/styles`: 새로운 스타일 등록 (이미지 포함)
- `GET /api/styles`: 스타일 목록을 조회 (갤러리, 검색, 정렬)
- `GET /api/styles/:styleId`: 특정 스타일의 상세 정보 조회
- `PATCH /api/styles/:styleId`: 특정 스타일의 정보 수정
- `DELETE /api/styles/:styleId`: 특정 스타일 삭제

### Curations

- `POST /api/styles/:styleId/curations`: 특정 스타일에 큐레이션 등록
- `GET /api/styles/:styleId/curations`: 특정 스타일의 큐레이션 목록 조회
- `PUT /api/curations/:curationId`: 특정 큐레이션 수정
- `DELETE /api/curations/:curationId`: 특정 큐레이션 삭제

### Comments

- `POST /api/curations/:curationId/comments`: 특정 큐레이션에 답글 등록
- `PATCH /api/comments/:commentId`: 특정 답글 수정
- `DELETE /api/comments/:commentId`: 특정 답글 삭제

### Ranking & Tags

- `GET /api/ranking`: 스타일 랭킹 목록 조회
- `GET /api/tags`: 인기 태그 목록 조회

---

## 🛠️ 기술 스택 (Tech Stack)

- Runtime: [Node.js](https://nodejs.org/)
- Framework: [Express.js](https://expressjs.com/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- ORM: [Prisma](https://www.prisma.io/)
- Password Hashing: [bcrypt](https://www.npmjs.com/package/bcrypt)
- File Handling: [Multer](https://www.npmjs.com/package/multer) for multipart/form-data
- Validation: [superstruct](https://www.npmjs.com/package/superstruct) for request data validation
- Dev Tools:
  - [Nodemon](https://nodemon.io/) for auto-reloading,
  - [ESLint](https://eslint.org/),
  - [Prettier](https://prettier.io/) for code quality

---

## 🚀 시작하기 (Getting Started)

### 1. 사전 준비 (Prerequisites)

- [Node.js](https://nodejs.org/) (v18.x 이상)
- [PostgreSQL](https://www.postgresql.org/)
- `npm` or `yarn`

### 2. 설치 및 설정 (Installation)

1.  프로젝트 클론 및 의존성 설치

    ```
    npm install
    ```

2.  환경 변수 설정 (`.env`)
    프로젝트 루트에 `.env` 파일을 생성하고, 사용하는 PostgreSQL 데이터베이스 정보를 아래 형식에 맞게 입력합니다.

    ```bash
    # .env
    # PostgreSQL Connection URL
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
    DATABASE_URL="postgresql://postgres:password@localhost:5432/howdoilook?schema=public"
    ```

3.  데이터베이스 마이그레이션
    Prisma를 사용하여 데이터베이스 스키마를 동기화합니다.

    ```bash
    npx prisma migrate dev
    ```

4.  초기 데이터 생성 (Seeding)
    `prisma/seed.js` 파일에 정의된 초기 데이터를 데이터베이스에 추가합니다.
    ```bash
    npx prisma db seed
    ```

### 3. 서버 실행 (Running the Server)

- 개발 모드 (with Nodemon): 파일 변경 시 서버가 자동으로 재시작됩니다.
  ```bash
  npm run dev
  ```
- 프로덕션 모드:
  ```bash
  npm start
  ```
  서버가 정상적으로 실행되면, 기본적으로 `http://localhost:3000` 에서 API 요청을 보낼 수 있습니다.

---

## 📁 폴더 구조 (Folder Structure)

```
.
├── prisma/               # Prisma 스키마, 마이그레이션, 시딩 스크립트
│   ├── migrations/
│   ├── schema.prisma     # 데이터베이스 모델 정의
│   └── seed.js           # 초기 데이터 생성 스크립트
├── src/                  # 핵심 소스 코드
│   ├── controllers/      # API의 비즈니스 로직 처리
│   ├── middlewares/      # 요청/응답 사이클 처리 (인증, 유효성 검사, 에러 핸들링)
│   ├── routers/          # API 엔드포인트 정의 및 컨트롤러 연결
│   ├── structs/          # Superstruct를 이용한 데이터 구조 및 유효성 검증 스키마
│   └── utils/            # 공통 유틸리티 함수 (Prisma 클라이언트 등)
├── uploads/              # 사용자가 업로드한 이미지 파일 저장 위치
├── .env                  # 환경 변수 설정 파일 (Git 추적 안 함)
├── .eslintrc             # ESLint 설정
├── .prettierrc           # Prettier 설정
├── app.js                # Express 애플리케이션의 진입점
└── package.json          # 프로젝트 메타데이터 및 의존성 관리
```
