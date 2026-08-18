# Portpolio — 정제원 개인 포트폴리오

## 프로젝트 개요

개인 포트폴리오 웹사이트. GitHub Pages(`https://cingdam.github.io/`)로 배포된다.

2022년 CRA 버전에서 **Vite + TypeScript + Tailwind CSS v4** 로 전면 리팩토링을 마쳤다.
프로젝트 데이터는 GitHub API 에서 빌드 시점에 가져오고, 라이트/다크 테마를 지원한다.

## 기술 스택

- **빌드**: Vite 6 + TypeScript (기존: react-scripts / CRA)
- **UI**: React 18
- **스타일**: Tailwind CSS v4 (`@tailwindcss/vite`) — `tailwind.config.js` 없이 CSS 의 `@theme` 로 토큰 정의
- **애니메이션**: framer-motion
- **아이콘**: react-icons — 스킬 아이콘은 Simple Icons **SVG 컴포넌트** (png 아님)
- **캐러셀**: swiper 14
- **배포**: gh-pages → GitHub Pages

> `styled-components` 와 `react-spring` 은 제거됐다. 스타일은 전부 Tailwind 유틸리티다.

## 디렉터리 구조

```
index.html           # Vite 진입점 (루트). 테마 FOUC 방지 스크립트 포함
scripts/
  fetch-projects.ts  # GitHub API → projects.json (npm run sync:projects)
  smoke.mjs          # Playwright 스모크 테스트
src/
  main.tsx           # 진입점
  App.tsx            # ThemeProvider + 섹션 조립
  index.css          # Tailwind import + 디자인 토큰 + 테마 정의
  components/
    Header.tsx       # 고정 헤더, 스크롤 진행바, 섹션 하이라이트
    Hero.tsx         # 첫 화면
    About.tsx        # 소개 (데이터: data/about.ts)
    Skills.tsx       # 기술 스택 탭
    Projects.tsx     # 프로젝트 카드 그리드
    ProjectModal.tsx # 상세 모달 (ESC·포커스 트랩 포함)
    LanguageBar.tsx  # GitHub 언어 구성비 막대
    Section.tsx      # 섹션 공통 껍데기 (스크롤 진입 애니메이션)
    ThemeToggle.tsx  # 라이트/다크/시스템 순환 버튼
  data/
    projects.ts      # 로컬 오버라이드 (표시명·썸네일·순서)
    generated/
      projects.json  # ← 자동 생성. 직접 고치지 말 것
    skills.ts        # 스킬 목록 (SVG 아이콘 + 브랜드 색)
    about.ts         # 소개 문구
    sections.ts      # 내비게이션 섹션 정의
  hooks/
    useTheme.tsx     # 테마 상태 (system 추종 + localStorage)
    useActiveSection.ts
  lib/format.ts      # 날짜·언어 색 포맷터
  types/project.ts
public/              # 정적 파일 (썸네일·프로젝트 스크린샷·favicon)
```

## 포트폴리오에 싣는 프로젝트

GitHub `cingdam` 계정에서 **선별한 4개**만 게재한다.
학습용/연습 레포(`next_crud`, `node_crud`, `next_learn`, `ChatStomp`, `chatTest`,
`web-sever-test`)와 `LivAnd` 는 제외.

| 표시명 | 레포 | 데이터 출처 |
|---|---|---|
| **Planit** ⭐ | `TripAdviser` | README 자동 — 표시명이 레포명과 다르다 |
| **DMS-Fusion** ⭐ | `DMS-Fusion` | README 자동 |
| **Helpus** | `Helpus` | README 자동 |
| **TripPlanner** | `TripPlanner` | 로컬 데이터 (README 없음) |

프로젝트를 추가·제외할 때는 이 표와 `src/data/projects.ts` 의 `PROJECT_ORDER`·`overrides`
를 함께 갱신하고 `npm run sync:projects` 를 다시 돌린다.

## 데이터 흐름

`npm run sync:projects` 가 GitHub API 를 호출해 `src/data/generated/projects.json` 을 만든다.
**런타임에는 API 를 호출하지 않는다** — JSON 을 커밋해 두므로 rate limit·오프라인 문제가 없다.

- **자동 취득**: 언어 구성비, 최종 푸시일, 스타, 레포 URL, README(기간·역할·기술스택·주요기능)
- **로컬 오버라이드**(`src/data/projects.ts`): 표시명, 썸네일, 정렬 순서, 대표작 여부

README 파싱은 레포마다 형식이 다르다 (`scripts/fetch-projects.ts` 참고):
- Planit — `## 기술 스택` 아래 `**Client** — A · B · C`, 주요 기능은 마크다운 표
- Helpus·DMS-Fusion — `# 사용기술` 아래 shields.io 뱃지(`logo=` 값을 읽는다), 주요 기능은 `- 제목 : 설명` 목록

파서를 고쳤으면 반드시 결과 JSON 을 눈으로 확인한다. 과거에 `1:1 채팅` 이 `1` 로 잘리거나
표 구분선 `--` 이 스택으로 들어간 적이 있다.

## 테마

라이트/다크 + **시스템 설정 자동 추종**을 지원한다.

- `html.dark` 클래스 기반. `index.css` 의 `@custom-variant dark` 가 `dark:` 변형을 켠다.
- 기본값은 `system` — `useTheme.tsx` 가 `prefers-color-scheme` 변화를 실시간으로 따라간다.
- 사용자가 토글하면 `localStorage['portfolio-theme']` 에 저장된다.
- **FOUC 방지**: `index.html` 의 인라인 스크립트가 React 마운트 전에 `html.dark` 를 붙인다.
  이 스크립트의 판단 규칙은 `useTheme.tsx` 와 항상 일치시켜야 한다.

### 색을 쓸 때

**팔레트 값을 직접 쓰지 말고 시맨틱 토큰을 쓴다.** 두 테마에서 자동으로 뒤집힌다.

| 토큰 | 용도 |
|---|---|
| `bg-canvas` | 페이지 바탕 |
| `bg-surface` / `bg-surface-raised` | 카드·패널 |
| `border-line` | 테두리·구분선 |
| `text-content` / `-muted` / `-subtle` | 본문 → 보조 → 흐린 글자 |
| `bg-accent` / `text-accent` / `text-on-accent` | 강조 |
| `bg-scrim` | 모달 뒤 덮개 |
| `--glow-from` / `--glow-to` | 장식용 그라디언트 양 끝 |

`text-white`, `bg-white/5`, `bg-ink-950` 같은 하드코딩은 한쪽 테마에서 반드시 깨진다.
(실제로 라이트 모드에서 카드 플레이스홀더 글자가 안 보이고, 모달이 흰 배경에 묻힌 적이 있다.)

## 개발 규칙

### 코드 스타일
- 함수형 컴포넌트 + 훅만 사용한다.
- 주석은 한국어로 쓴다.
- 새 파일은 `.tsx` / `.ts`.

### 하드코딩 금지
- 프로젝트·스킬·연락처·섹션 목록은 `src/data/` 에 두고 컴포넌트는 map 으로 렌더한다.
- 섹션 이동은 문자열 비교가 아니라 `sections.ts` 의 id 로 처리한다.

### 반응형
- flex/grid + `max-width` 로 잡는다. `42.2vw` 같은 뷰포트 매직 넘버를 쓰지 않는다.
- 360 / 768 / 1440px 에서 **가로 스크롤이 없어야 한다** (구버전의 대표적 회귀 지점).

### 스크롤 애니메이션 (framer-motion)

섹션 콘텐츠 높이가 제각각이라(900~1633px) 블록 하나를 통째로 페이드하면 긴 섹션이 밋밋해진다.
`Section.tsx` 가 내보내는 공통 값으로 **항목 단위 stagger** 를 건다.

```tsx
import { Section, staggerParent, fadeUp, VIEWPORT } from './Section';

<motion.div variants={staggerParent(0.12)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
  {items.map((x) => <motion.div key={x.id} variants={fadeUp}>…</motion.div>)}
</motion.div>
```

- `Section` 의 `fullHeight`(기본 true)가 `min-h-svh` 를 깔아 짧은 섹션도 스크롤 여유를 갖는다.
- **같은 요소에 `variants` 와 `whileHover` 를 함께 두지 말 것.** hover 가 걸리면 그 요소는
  자기 애니메이션 상태를 갖게 되어 부모의 stagger 전파에서 떨어져 나간다.
  등장은 바깥 요소(`variants`), hover 는 안쪽 요소(`whileHover`)로 분리한다.
  (`Projects.tsx` 의 `ProjectCard` 가 이 구조다 — 실제로 이 실수로 카드가 한 덩어리로 나온 적 있다.)

### 접근성
- 모달은 ESC 로 닫히고 포커스가 갇혀야 한다.
- `body` 에 `user-select: none` 을 걸지 않는다 — 연락처를 복사할 수 없게 된다.
- 아이콘만 있는 버튼에는 `aria-label` 을 단다.

### 이미지
- 프로젝트 스크린샷·썸네일은 `public/` 에 두고 절대경로(`/thumbnail/...`)로 참조한다.
  JSON 데이터에서 참조해야 해서 import 방식을 쓰지 않는다.
- CSS 에서 `url("/src/...")` 같은 경로는 프로덕션 빌드에서 깨진다. 쓰지 말 것.
- 스킬 아이콘은 png 대신 react-icons 의 SVG 를 쓴다 (벡터 + 테마 대응).

## 명령어

```bash
npm run dev            # 개발 서버 (Vite, :5173)
npm run build          # 타입 체크 + 프로덕션 빌드 → dist/
npm run preview        # 빌드 결과 로컬 확인 (:4173)
npm run sync:projects  # GitHub → src/data/generated/projects.json 갱신
npm run deploy         # gh-pages 로 배포
```

### 스모크 테스트

```bash
npm run build && npm run preview -- --port 4173 &
node scripts/smoke.mjs
```

반응형(360/768/1440), 프로젝트 카드 수, 모달 열기·ESC 닫기, 캐러셀,
**스크롤 등장 애니메이션**(진입 전 숨김·순차 등장·최종 표시), 테마 3종
(시스템 추종·토글·새로고침 유지), 콘솔 에러를 검사하고 `screenshots/` 에 결과를 남긴다.

> Playwright 기본값이 `reducedMotion: 'reduce'` 라서 애니메이션 검사에는
> `newPage(w, h, scheme, 'no-preference')` 로 명시적으로 꺼야 한다.
> (안 그러면 `index.css` 의 reduced-motion 규칙 때문에 전부 즉시 완료돼 통과처럼 보인다.)

> **어서션 통과만으로 끝내지 말고 스크린샷을 실제로 볼 것.** 지금까지 발견한 결함
> (안 보이는 아이콘, 잘린 헤더, 흰 배경에 묻힌 모달)은 전부 어서션은 통과하고
> 눈으로만 드러났다.

## 배포 주의사항

- `homepage` 는 `https://cingdam.github.io/` — 유저 페이지라 `vite.config.ts` 의 `base` 가 `/` 다.
  프로젝트 페이지로 옮기면 `/<repo>/` 로 바꿔야 한다.
- `gh-pages -d dist` 로 배포한다 (CRA 의 `build` 가 아니다).

## 개인정보

`Contact` 섹션에 전화번호·이메일이 하드코딩되어 있다. 공개 사이트이므로
노출 범위를 바꿀 때는 반드시 사용자에게 먼저 확인한다.

## 사용자가 직접 채우는 영역

경력·사실 관계라 임의로 작성하지 않는다. TODO 주석이 달려 있다.

- `src/data/about.ts` — 자기소개 (작성됨), `ABOUT_FACTS`·`ABOUT_HIGHLIGHTS` 는 갱신 필요
- `src/data/skills.ts` — 항목 구성과 `level` 값
- `src/data/projects.ts` — TripPlanner 설명 (2022년 문구를 옮겨온 것)
- Planit·DMS-Fusion 썸네일/스크린샷 — 아직 없어 플레이스홀더가 렌더된다
