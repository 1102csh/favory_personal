# FAVORY Workshop Platform

작가(아티잔)와 일반 사용자를 위한 워크샵/공방 플랫폼. React + Vite 기반의 SPA이며, 인증과 프로필 데이터는 Supabase를 사용합니다.

## 기술 스택

- **빌드/번들러**: Vite 8
- **프레임워크**: React 19
- **라우팅**: react-router-dom v7 (`createBrowserRouter`)
- **폼/검증**: react-hook-form + zod (`@hookform/resolvers`)
- **백엔드(BaaS)**: Supabase (`@supabase/supabase-js`)
- **스타일**: SCSS Modules + CSS Variables (라이트/다크 테마)
- **린트**: ESLint 10 (react-hooks, react-refresh)

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```

`@` 별칭은 [vite.config.js](vite.config.js)에서 `./src`로 매핑되어 있고, 모든 `.module.scss`에는 `variables`/`mixins`가 자동 주입됩니다.

---

## 폴더 구조 (Feature-Sliced 변형)

```
workshop-platform/
├─ public/              # 정적 자산 (favicon, icons)
├─ src/
│  ├─ app/              # 앱 부트스트랩 (라우터, 전역 Provider)
│  ├─ assets/           # 이미지/로고 등 번들 자산
│  ├─ features/         # 도메인별 기능 (auth, dashboard, home, ...)
│  ├─ shared/           # 도메인 비종속 공용 (UI, lib, hooks, styles, ...)
│  ├─ index.scss        # 전역 스타일 + 다크모드 전환
│  └─ main.jsx          # 진입점 (React root mount)
├─ index.html           # Vite HTML 진입점, 폰트/FOUC 스크립트
├─ vite.config.js       # Vite 설정 (alias, SCSS 자동 주입)
├─ eslint.config.js     # ESLint 9 flat config
└─ package.json
```

---

## 루트 파일

| 파일 | 역할 |
| --- | --- |
| [index.html](index.html) | Vite HTML 엔트리. Pretendard / Cormorant / Noto Serif KR / DM Sans 로드, 다크모드 FOUC 방지 인라인 스크립트 포함. |
| [vite.config.js](vite.config.js) | `@ → ./src` 별칭, 모든 `.module.scss`에 `variables`/`mixins` 자동 `@use`. |
| [eslint.config.js](eslint.config.js) | React Hooks / React Refresh 규칙 포함 ESLint flat config. |
| [package.json](package.json) | 의존성과 npm 스크립트 정의. |
| `.env.local` | Supabase URL/Key 등 런타임 환경변수 (커밋 제외). |

## `public/`

빌드 시 그대로 복사되는 정적 자산.

- [public/favicon.svg](public/favicon.svg) — 브라우저 탭 아이콘
- [public/icons.svg](public/icons.svg) — 스프라이트 아이콘 시트

## `src/`

### [src/main.jsx](src/main.jsx)
React 진입점. `#root`에 `<App />`을 마운트하고 [src/index.scss](src/index.scss)를 로드.

### [src/index.scss](src/index.scss)
전역 리셋, body 폰트/색상, 다크모드 트랜지션, reduced-motion 대응. 토큰/팔레트 임포트 지점.

### `src/app/` — 앱 셸
앱 전체에 걸치는 인프라 코드.

- [src/app/App.jsx](src/app/App.jsx) — 루트 컴포넌트. `RouterProvider`로 라우터 주입.
- [src/app/App.css](src/app/App.css) — 앱 셸용 스타일 (legacy).
- [src/app/router/](src/app/router/) — 라우팅 설정
  - [index.jsx](src/app/router/index.jsx) — `createBrowserRouter` 라우트 트리. 인증/메인/대시보드/404를 모두 `RootLayout` 자식으로 묶음.
  - [RootLayout.jsx](src/app/router/RootLayout.jsx) — 모든 라우트의 부모. 라우터 컨텍스트 안에 `AuthProvider`를 둬서 `useNavigate` 사용 가능하게 함.
  - [guards.jsx](src/app/router/guards.jsx) — `ProtectedRoute` / `PublicOnlyRoute` / `ArtisanRoute` 가드. 미완성 프로필은 `/auth/complete-profile`로 리다이렉트, 작가 권한 없으면 `/upgrade`로.
  - [NotFoundPage.jsx](src/app/router/NotFoundPage.jsx) — 404 페이지.
- [src/app/providers/AuthProvider.jsx](src/app/providers/AuthProvider.jsx) — `useAuth` Context. Supabase 세션 구독, 프로필 로드, 로그인 후 자동 리다이렉트 처리.

### `src/assets/`
번들에 포함되는 정적 자산. 현재 [LOGO.png](src/assets/LOGO.png).

### `src/features/` — 도메인 기능 모듈

각 feature는 `api / components / hooks / pages / schemas / services / constants` 등 하위 폴더를 가집니다 (필요한 것만).

#### `src/features/auth/` — 인증/회원가입/프로필
- **api/** — 데이터 액세스 레이어
  - [authRepository.js](src/features/auth/api/authRepository.js) — 이메일/소셜 로그인, 회원가입, 세션 관리
  - [phoneAuthRepository.js](src/features/auth/api/phoneAuthRepository.js) — 휴대폰 인증 SMS 발송/검증
  - [profileRepository.js](src/features/auth/api/profileRepository.js) — `profiles` 테이블 CRUD, 닉네임 중복 체크
- **components/** — 인증 영역 전용 UI (다른 feature가 import하지 않음)
  - `AgreementModal/`, `AgreementSection/` — 약관 동의 모달과 동의 체크박스 묶음
  - `CompleteProfileForm/` — 소셜 가입 후 프로필 완성 폼
  - `LoginForm/`, `SignUpForm/` — 메인 인증 폼
  - `PasswordField/` — 강도 인디케이터가 있는 비밀번호 입력
  - `PhoneVerificationField/` — 휴대폰 번호 + 인증코드 입력
  - `SocialLoginButtons/` — 구글/카카오 등 소셜 로그인 버튼 그룹
- **constants/** — 약관 텍스트([agreements.js](src/features/auth/constants/agreements.js)), 인증 관련 상수
- **hooks/** — 인증 관련 React 훅
  - `useSignUp`, `useSocialLogin`, `usePasswordReset`, `usePhoneVerification`, `useNicknameCheck`
- **pages/** — 라우트 단위 페이지 컴포넌트
  - `LoginPage`, `SignUpPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `EmailVerifyPage`, `AuthCallbackPage`, `CompleteProfilePage`
- **schemas/** — zod 스키마. `loginSchema`, `signUpSchema`, `passwordRestSchema`, `completeProfileSchema`
- **services/** — 컴포넌트가 직접 부르지 않는 비즈니스 로직 단위
  - [authService.js](src/features/auth/services/authService.js) — 회원가입 플로우 오케스트레이션
  - [phoneVerificationService.js](src/features/auth/services/phoneVerificationService.js) — SMS 인증 상태/타이머 로직

#### `src/features/dashboard/` — 작가 대시보드
- **api/** — `productRepository`, `orderRepository`, `feedRepository`
- **components/**
  - `DashboardLayout/` — 대시보드 셸 (사이드바 + Outlet)
  - `DashboardSidebar/` — 좌측 네비게이션
  - `MobileHeader/` — 모바일 상단 헤더
  - `widgets/` — 대시보드 홈에서 조립되는 위젯 컴포넌트
    - `ChecklistCard`, `OrderStages`, `RecentReviewCard`, `SalesSummary`, `StatTile`
- **constants/**, **hooks/**, **services/** — 도메인 상수/훅/서비스 (현재 비어 있거나 추가 예정)
- **pages/** — `DashboardHomePage`, `AnalyticsPage`, `FeedManagePage`, `StorePage`, `InventoryPage`, `OrdersPage`, `SalesPage`, `CalendarPage`, `CustomersPage`, `ReviewsPage`

#### `src/features/home/` — 일반 사용자 메인
- **components/** — `SiteNav` (상단 네비), `FeaturedBanner`, `FeedList`, `TrendingSiderbar`
- **data/[mockData.js](src/features/home/data/mockData.js)** — 임시 목 데이터
- **pages/** — `HomePage`, `MyPage`, `SettingsPage`, `UpgradePage`

#### `src/features/community/`, `src/features/shop/`
플레이스홀더. 추후 커뮤니티/스토어 기능을 담을 예정 (현재 비어 있음).

### `src/shared/` — 도메인 비종속 공용

여러 feature가 공유하는 코드. feature → shared 단방향 의존만 허용.

- **api/**
  - [supabaseClient.js](src/shared/api/supabaseClient.js) — Supabase 클라이언트 싱글톤
  - [authRepository.js](src/shared/api/authRepository.js) — 공용 인증 헬퍼 (`features/auth/api`로 점진 이관 중)
- **config/[env.js](src/shared/config/env.js)** — `import.meta.env`에서 Supabase URL/Key 등을 읽어 검증된 객체로 노출
- **hooks/**
  - [useTheme.js](src/shared/hooks/useTheme.js) — 라이트/다크/시스템 테마 토글, `localStorage` 영속화
  - [useResponsive.js](src/shared/hooks/useResponsive.js) — 브레이크포인트 매칭 훅
- **lib/** — 프레임워크 비종속 유틸
  - **errors/[AuthError.js](src/shared/lib/errors/AuthError.js)** — 도메인 에러 클래스 (Supabase 에러 매핑)
  - **validators/**
    - [passwordStrength.js](src/shared/lib/validators/passwordStrength.js) — 비밀번호 점수 계산
    - [phoneFormatter.js](src/shared/lib/validators/phoneFormatter.js) — 휴대폰 번호 포맷/검증
- **styles/** — 전역 SCSS 토큰 (`@use`로 자동 주입됨)
  - [_variables.scss](src/shared/styles/_variables.scss) — 폰트, 사이즈, 트랜지션, 브레이크포인트
  - [_palette.scss](src/shared/styles/_palette.scss) — 원시 색상 팔레트
  - [_tokens.scss](src/shared/styles/_tokens.scss) — 시맨틱 CSS 변수 (라이트/다크)
  - [_mixins.scss](src/shared/styles/_mixins.scss) — 미디어쿼리, 타이포 등 mixin
  - [_legacy-dashboard.scss](src/shared/styles/_legacy-dashboard.scss) — 레거시 대시보드 임시 스타일 (점진 제거 대상)
- **ui/** — 재사용 가능한 프레젠테이션 컴포넌트 (도메인 비종속)
  - `Button/`, `Input/`, `Checkbox/`, `Modal/`, `Alert/`, `Divider/`, `Card/` — 디자인 시스템 기본 위젯
  - `Logo/` — 로고 컴포넌트
  - `AuthLayout/` — 인증 페이지 공용 레이아웃 (좌측 브랜드 / 우측 폼)
  - `LegacyScope/` — 레거시 SCSS의 영향 범위를 격리하는 래퍼
  - [tokens.js](src/shared/ui/tokens.js) — JS에서 참조하는 디자인 토큰 (애니메이션, 사이즈 등)

---

## 라우트 맵 (요약)

| 경로 | 가드 | 컴포넌트 |
| --- | --- | --- |
| `/login`, `/signup` | PublicOnly | `LoginPage`, `SignUpPage` |
| `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback`, `/auth/complete-profile` | — | 각 인증 페이지 |
| `/`, `/mypage`, `/settings`, `/upgrade` | Protected | `HomePage`, `MyPage`, `SettingsPage`, `UpgradePage` |
| `/dashboard/*` | Artisan | `DashboardLayout` + 중첩 페이지 |
| `*` | — | `NotFoundPage` |

자세한 정의는 [src/app/router/index.jsx](src/app/router/index.jsx) 참고.
