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

- **스냅 대상 섹션은 `min-h-svh` — 화면 높이를 그대로 쓴다.**
  ⚠️ 여기서 헤더 높이를 **빼면 안 된다**. 헤더는 `position: fixed` 라 문서 흐름에서
  자리를 차지하지 않는다. `calc(100svh - var(--header-h))` 로 주면 섹션이 화면보다
  헤더만큼 짧아져, 스냅으로 정착했을 때 화면 아래에 다음 섹션 윗부분이 그만큼
  삐져나온다 (모든 해상도에서 66px 씩 보여 2페이지처럼 보였다).
  헤더에 가리지 않게 하는 건 위쪽 패딩(`pt-[calc(var(--header-h)+3rem)]`)의 역할이다.

### 스크롤 스냅 — "페이지가 넘어가는" 전환

`html` 에 `scroll-snap-type: y mandatory` 를 걸어 섹션이 화면에 딱 맞춰진다.
**1024px 이상 + 모션 허용**일 때만 켠다 (모바일은 주소창 높이 변화로 스냅이 튄다).

- 스냅은 **루트 스크롤러(html)** 에 건다. 별도 컨테이너에 걸면 body 스크롤이 죽어
  고정 헤더·스크롤 복원이 전부 깨진다.
- `proximity` 는 쓰지 말 것 — 임계값이 좁아 실제로 거의 걸리지 않는다
  (300px 굴려도 300px 에 그대로 멈춰 전환 느낌이 안 났다).
- 화면보다 긴 섹션은 `snap="free"` 로 준다. 높이를 강제하지 않아 위끝에 한 번
  맞춰진 뒤에는 안에서 자유롭게 읽힌다. **지금은 해당 섹션이 없다** — 5개 모두
  한 화면에 들어온다. 새 섹션이 화면을 넘기면 이 옵션을 쓸 것.

**스크롤 오프셋은 `--header-h` 한 곳에서 정한다.**
과거에 `scroll-padding-top: 4.5rem` 과 섹션의 `scroll-mt-20` 이 겹쳐 152px 이
밀린 적이 있다. 섹션에 `scroll-mt-*` 를 따로 달지 말 것.

**전환 연출은 `useScroll` 이 아니라 `useInView` 로 한다.**
`mandatory` 스냅에서 브라우저는 휠 한 번에 다음 지점까지 **한 프레임 만에** 점프한다
(실측: scrollY 768 → 1668, 중간 프레임 없음). `scroll-behavior: smooth` 도 휠 기반
스냅에는 적용되지 않는다. 그래서 스크롤 위치에 연동한 크로스페이드는 렌더될 기회가 없다.
`Section` 은 `useInView` 로 "화면을 차지했는가" 를 보고
그 상태 전환을 애니메이션한다 — 점프 직후부터 재생돼 페이지가 넘어가는 느낌이 난다.
(이전 구현에서는 정착한 Skills 가 `opacity: 0` 인 채 멈추는 버그가 있었다.)

**전환은 책장 넘기듯 가로로 넘어간다.** 세로로 스크롤하되 섹션은 세로축(Y)을
축으로 회전하며 넘어간다. `x` 이동만으로는 "미끄러진다" 에 가깝고, `rotateY` 를
얹어야 종이가 넘어가 보인다.

- 원근(`perspective: 1600px`)은 **회전 요소의 부모**인 `section` 에 준다.
  회전 요소 자신에게 주면 평면 그대로다.
- 경첩(`transform-origin`)은 넘어오는 쪽 모서리에 둔다. 아래로 스크롤이면
  `right center`, 위로면 `left center` 로 뒤집혀 되감기처럼 보인다.
- 각도는 58도, 이동폭 180px. 스냅 점프 자체가 화면을 **세로로** 움직이기 때문에
  가로 연출이 약하면 세로 전환으로만 읽힌다. 65도를 넘기면 글자가 찌그러진다.
- 들어올 때(0.5s)는 부드럽게, 나갈 때(0.28s)는 짧고 빠르게. 비대칭이어야 한다 —
  나가는 장이 오래 남으면 두 페이지가 겹쳐 보인다.
- `useScrollDirection` 이 방향을 알려준다 (안 보면 위로 갈 때도 전진처럼 보인다).

⚠️ **`useInView` 의 `amount` 에 큰 값을 주지 말 것.**
`amount: 0.55` 는 "섹션의 55%가 보이면 등장" 인데, **섹션이 화면보다 훨씬 크면
영원히 false** 가 된다. 모바일에서 Projects 가 2286px 이 되어 844px 화면에 55%가
들어갈 수 없었고, 프로젝트 섹션 전체가 `opacity: 0` 인 채 빈 화면으로 나왔다.
`amount: 'some'` + `margin` 조합을 쓴다.

⚠️ **가로 이동은 `section { overflow-x: clip }` 으로 잘라 낸다.**
`body { overflow-x: hidden }` 으로는 못 막는다 — 스크롤러가 `html` 이라 body 의
overflow 가 뷰포트로 전파돼 무시된다. 실제로 1440px 미만에서 가로 스크롤바가
120px 생겼었다.
- **같은 요소에 `variants` 와 `whileHover` 를 함께 두지 말 것.** hover 가 걸리면 그 요소는
  자기 애니메이션 상태를 갖게 되어 부모의 stagger 전파에서 떨어져 나간다.
  등장은 바깥 요소(`variants`), hover 는 안쪽 요소(`whileHover`)로 분리한다.
  (`Projects.tsx` 의 `ProjectCard` 가 이 구조다 — 실제로 이 실수로 카드가 한 덩어리로 나온 적 있다.)

### 섹션 톤과 카드 표면

`Section` 은 `tone`(`canvas` | `surface`)과 `align`(`left` | `center`)을 받는다.

- **톤은 홀/짝으로 교차시킨다** — Hero·Skills·Contact 는 `canvas`, About·Projects 는 `surface`.
  전 구간이 한 색이면 섹션 경계가 안 보여 긴 문서처럼 읽힌다.
- **정렬도 번갈아 준다** — 전부 좌측 정렬이면 시선이 한쪽만 따라가 단조롭다.
  Skills·Contact 는 `align="center"`.
- **카드 배경은 `bg-surface` 가 아니라 `bg-card` 를 쓴다.**
  `Section` 이 `data-tone` 을 DOM 에 내보내고 `index.css` 가 그에 맞는 `--card` 를 정한다.
  카드를 항상 `bg-surface` 로 두면 `surface` 톤 섹션 위에서 배경에 묻힌다
  (라이트 모드 About 지표 카드가 실제로 안 보였다).
  hover 는 `hover:bg-card-raised`.

### 스크롤바

루트(`html`)와 모달의 스크롤바를 감춘다. 스크롤 자체는 살아 있다 —
`overflow: hidden` 으로 감추면 스크롤이 죽으므로 쓰지 않는다.

- 루트는 `index.css` 에서 직접, 내부 스크롤 영역은 `.no-scrollbar` 유틸리티를 쓴다.
  (모달 패널, 헤더 내비게이션이 이 유틸리티를 쓴다)
- ⚠️ 스크롤바가 없으면 **스크롤 가능하다는 단서**가 사라진다.
  Hero 아래의 화살표 인디케이터가 그 역할을 대신하므로 지울 것.

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

- 저장소 이름이 `cingdam.github.io` 라 **사용자 페이지**다.
  `vite.config.ts` 의 `base` 는 `/` 가 맞다. (프로젝트 페이지로 옮기면 `/<repo>/` 로 바꿔야 한다.)
- 소스는 `master`, 배포 결과는 `gh-pages` 브랜치.
  Pages source 도 `gh-pages/` 로 설정돼 있다.
- `npm run deploy`(= `gh-pages -d dist`) 로 배포한다. CRA 의 `build` 디렉터리가 아니다.
- **배포 후 반드시 라이브 사이트를 확인한다** — `node scripts/smoke.mjs https://cingdam.github.io`
- Pages 가 이전 빌드를 캐싱해 소스 `index.html` 이 그대로 서빙될 때가 있다
  (자산이 전부 404 나고 `<script src="/src/main.tsx">` 가 보이면 이 상황).
  그 경우 아래로 재빌드를 건다.

  ```bash
  gh api -X POST repos/cingdam/cingdam.github.io/pages/builds
  ```

## 개인정보

`Contact` 섹션에 전화번호·이메일이 하드코딩되어 있다. 공개 사이트이므로
노출 범위를 바꿀 때는 반드시 사용자에게 먼저 확인한다.

## 사용자가 직접 채우는 영역

경력·사실 관계라 임의로 작성하지 않는다. TODO 주석이 달려 있다.

- `src/data/about.ts` — 작성 완료. 구조는 아래와 같다.
  - `ABOUT_LEAD` — 한 줄 요약 (가장 큰 글씨)
  - `ABOUT_EXPERIENCES` — 경험 카드 (제목·부제·본문·태그)
  - `ABOUT_APPROACH` — 일하는 방식 마무리 문단
  - `ABOUT_FACTS` / `ABOUT_HIGHLIGHTS` — 좌측 사실·지표

  ⚠️ 예전에는 `ABOUT_PARAGRAPHS` 로 긴 문단 4개를 나열했는데, 오른쪽이 글 벽이 되고
  왼쪽 칸은 비어 보였다. 내용을 늘릴 때도 문단을 덧붙이지 말고 카드를 추가할 것.

  **포지셔닝: 개발직 전반 지원이다. 직무를 좁히는 표현을 쓰지 않는다.**
  "프론트엔드를 중심으로" 같은 표현은 백엔드·AI 직무에서 스스로 범위를 깎는다.
  대신 Spring(2022) → FastAPI·PyTorch(2026.03) → Next.js·NestJS(2026.08) 로 넓혀 온
  실제 궤적을 근거로 "빠르게 습득한다" 를 내세운다. 이 순서는 projects.json 의
  `pushedAt` 과 일치하므로 프로젝트가 바뀌면 문구도 함께 확인할 것.
  Hero 의 `빠르게 배우는 개발자` 와 리드 문장도 같은 톤이라 함께 고쳐야 한다.
  About 은 스냅 섹션이라 **한 화면을 넘기면 안 된다** (1024x700 에서도 확인).
  `ABOUT_HIGHLIGHTS` 값은 projects.json 스택과 skills.ts 의 `level: 'main'` 에서 가져왔다.
- `src/data/skills.ts` — 항목 구성과 `level` 값
- `src/data/projects.ts` — TripPlanner 설명 (2022년 문구를 옮겨온 것)
