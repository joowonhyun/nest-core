# nest-core

NestJS로 JWT 인증(Access/Refresh 토큰)과 게시판 CRUD를 구현해보는 학습용 프로젝트입니다.

## 기술 스택

- **Framework**: NestJS 11
- **DB / ORM**: MariaDB + Prisma
- **인증**: `passport-jwt` (Access Token / Refresh Token 이중 발급, RT는 해싱 후 DB 저장)
- **검증**: `class-validator`, `class-transformer`
- **문서화**: Swagger (`@nestjs/swagger`)

## 프로젝트 설정

```bash
pnpm install
```

`.env` 파일을 프로젝트 루트에 생성하고 아래 값을 채워주세요.

```bash
# MariaDB/MySQL 연결 문자열
# 형식: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL=

# 미설정 시 3000번 포트 사용
PORT=3000

# JWT 서명 secret (Access Token / Refresh Token 각각 별도 secret 사용)
AT_SECRET=
RT_SECRET=
```

DB 스키마 반영 및 Prisma Client 생성:

```bash
npx prisma migrate dev
npx prisma generate
```

## 실행

```bash
# 개발 모드
pnpm run start:dev

# 프로덕션 모드
pnpm run start:prod
```

서버 실행 후 Swagger 문서는 `http://localhost:3000/api-docs`에서 확인할 수 있습니다.

## API

### Auth (`/auth`)

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| POST | `/auth/signup` | - | 이메일/비밀번호로 회원가입 |
| POST | `/auth/signin` | - | 로그인, Access/Refresh 토큰 발급 |
| POST | `/auth/logout` | Access Token | 로그아웃 (저장된 Refresh Token 무효화) |
| POST | `/auth/refresh` | Refresh Token | Access Token 재발급 (Refresh Token도 회전) |

### Board (`/board`)

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| GET | `/board/all` | - | 게시글 목록 조회 |
| GET | `/board/:boardId` | - | 게시글 상세 조회 |
| POST | `/board` | Access Token | 게시글 생성 |
| PATCH | `/board/:boardId` | Access Token (작성자 본인) | 게시글 수정 |
| DELETE | `/board/:boardId` | Access Token (작성자 본인) | 게시글 삭제 |

## 인증 방식 메모

- 라우트는 기본적으로 전역 `AtGuard`에 의해 인증이 필요하며, `@Public()` 데코레이터가 붙은 핸들러만 예외입니다.
- Refresh Token은 클라이언트에는 원문으로 발급하지만, DB에는 bcrypt로 해싱한 값만 저장합니다.
- `/auth/refresh`는 `@Public()`이 붙어있지만 동시에 별도의 `jwt-refresh` 전략(Guard)이 걸려있어, "Access Token은 필요 없지만 Refresh Token 인증 자체는 필요하다"는 의미입니다.
