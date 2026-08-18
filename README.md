# 정제원 포트폴리오

> 🔗 **[cingdam.github.io](https://cingdam.github.io/)**

GitHub 저장소에서 프로젝트 정보를 자동으로 가져오는 개인 포트폴리오 사이트입니다.
2022년 CRA 버전에서 **Vite + TypeScript + Tailwind CSS v4** 로 전면 리팩토링했습니다.

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| **빌드** | Vite 6 · TypeScript 5 |
| **UI** | React 18 |
| **스타일** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **애니메이션** | Framer Motion 11 |
| **아이콘** | react-icons (Simple Icons SVG) |
| **캐러셀** | Swiper 14 |
| **배포** | GitHub Pages (gh-pages) |

## 주요 기능

### GitHub 자동 연동

프로젝트 정보를 손으로 관리하지 않습니다. `npm run sync:projects` 를 실행하면
GitHub API 에서 다음을 가져와 `src/data/generated/projects.json` 을 만듭니다.

- 언어 구성비 · 최종 커밋일 · 스타 수 · 저장소 링크
- README 파싱 → 제작 기간 · 맡은 역할 · 기술 스택 · 주요 기능

저장소마다 README 형식이 달라 파서를 따로 두었습니다.
(마크다운 표 형식과 shields.io 뱃지 형식을 모두 처리합니다.)

**결과 JSON 을 커밋해 두므로 런타임에는 API 를 호출하지 않습니다.** 덕분에 rate limit 이나
네트워크 문제 없이 정적 사이트로 동작합니다. README 로 채울 수 없는 값(표시명, 썸네일,
정렬 순서)은 `src/data/projects.ts` 에서 덮어씁니다.

### 라이트 / 다크 테마

- 기본값은 **시스템 설정 자동 추종** — OS 테마를 바꾸면 새로고침 없이 즉시 반영됩니다.
- 헤더 버튼으로 수동 전환하면 `localStorage` 에 저장됩니다.
- 색은 전부 시맨틱 토큰(`bg-canvas`, `text-content`, `border-line` …)으로 정의해
  두 테마에서 자동으로 뒤집힙니다.
- React 마운트 전에 테마를 적용해 **화면 깜빡임(FOUC)이 없습니다.**

### 스크롤 인터랙션

- 섹션 진입 시 항목이 하나씩 순차적으로 등장 (Framer Motion stagger)
- 상단 스크롤 진행바, `IntersectionObserver` 기반 현재 섹션 하이라이트
- `prefers-reduced-motion` 을 존중합니다

### 접근성 · 반응형

- 360 / 768 / 1440px 전 구간 가로 스크롤 없음
- 모달: ESC 닫기 · 포커스 트랩 · 배경 스크롤 잠금
- 키보드 내비게이션, 본문 건너뛰기 링크, 아이콘 버튼 `aria-label`

## 게재 프로젝트

| 프로젝트 | 설명 | 주요 스택 |
|---|---|---|
| **[Planit](https://github.com/CingDam/TripAdviser)** | AI 여행 일정 계획 서비스. Gemini 기반 에이전트가 장소를 추천하고 동선을 최적화합니다. | Next.js 15 · NestJS · FastAPI · MySQL/MongoDB |
| **[DMS-Fusion](https://github.com/CingDam/DMS-Fusion)** | RGB-D 카메라 기반 운전자 모니터링 시스템. U-Net + CBAM 깊이 보정 모델을 직접 개발했습니다. | Next.js · FastAPI · PyTorch · Milvus |
| **[Helpus](https://github.com/CingDam/Helpus)** | 하이퍼 로컬 기반 기업–사용자 매칭 심부름 플랫폼 (팀 프로젝트, 팀장) | Spring · JavaScript · MariaDB |
| **[TripPlanner](https://github.com/CingDam/TripPlanner)** | 지도에서 숙소와 여행지를 담아 일정을 만드는 여행 계획 서비스 | Spring · jQuery · Google Maps API |

## 시작하기

```bash
npm install
npm run dev          # 개발 서버 → http://localhost:5173
```

### 명령어

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 체크 + 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run sync:projects` | GitHub 에서 프로젝트 데이터 갱신 |
| `npm run deploy` | GitHub Pages 배포 (`gh-pages` 브랜치) |

> 이 저장소는 사용자 페이지(`cingdam.github.io`)라 `vite.config.ts` 의 `base` 가 `/` 입니다.
> 소스는 `master`, 배포 결과는 `gh-pages` 브랜치에 올라갑니다.

### 프로젝트 데이터 갱신

```bash
npm run sync:projects
```

GitHub API 는 비인증 시 시간당 60회로 제한됩니다. 저장소 4개에 12회 정도 요청하므로
보통은 그대로 써도 되지만, 자주 실행한다면 토큰을 지정할 수 있습니다.

```bash
GITHUB_TOKEN=$(gh auth token) npm run sync:projects
```

### 테스트

```bash
npm run build
npm run preview &
node scripts/smoke.mjs
```

Playwright 로 실제 브라우저를 띄워 반응형(360/768/1440), 모달 동작, 캐러셀,
스크롤 애니메이션, 테마 전환, 콘솔 에러를 검사하고 `screenshots/` 에 결과를 남깁니다.

## 폴더 구조

```
scripts/
  fetch-projects.ts    # GitHub API → projects.json
  smoke.mjs            # Playwright 스모크 테스트
src/
  components/          # UI 컴포넌트
  data/                # 프로젝트·스킬·소개 데이터
    generated/         # 자동 생성 (직접 수정하지 않음)
  hooks/               # useTheme, useActiveSection
  lib/                 # 포맷 유틸
  types/               # 타입 정의
  index.css            # Tailwind + 디자인 토큰 + 테마
public/                # 썸네일·스크린샷·정적 파일
```

## 연락처

- **Email** — mmd011375@gmail.com
- **GitHub** — [@CingDam](https://github.com/CingDam)
