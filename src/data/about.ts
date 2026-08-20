/**
 * About Me 섹션 내용.
 *
 * 예전에는 긴 문단 4개를 그대로 나열했는데, 오른쪽 칸이 글 벽이 되고
 * 왼쪽은 비어 보였다. "한 줄 요약 → 경험 카드 → 일하는 방식" 으로 쪼갠다.
 *
 * 포지셔닝: 개발직 전반 지원이라 **직무를 좁히는 표현을 쓰지 않는다.**
 * ("프론트엔드를 중심으로" 처럼 쓰면 백엔드·AI 직무에서 스스로 범위를 깎는다)
 * 대신 Spring → FastAPI/PyTorch → Next.js 로 넓혀 온 실제 궤적을 근거로
 * "빠르게 습득한다" 를 내세운다. 이 궤적은 projects.json 의 pushedAt 순서와 일치한다.
 *
 * ⚠️ 경력·학력은 사실이므로 임의로 바꾸지 말 것.
 */

export interface AboutFact {
  label: string;
  value: string;
}

/** 좌측 사실 목록 */
export const ABOUT_FACTS: AboutFact[] = [
  { label: '이름', value: '정제원' },
  { label: '최종 학력', value: '한국폴리텍IV 대전캠퍼스 스마트소프트웨어과 졸업' },
];

/**
 * 섹션 맨 위 한 줄 요약. 가장 큰 글씨로 나간다.
 * 문단이 아니라 "무엇을 하는 사람인가" 를 한 문장으로 말한다.
 */
export const ABOUT_LEAD =
  '새로운 기술을 빠르게 익혀 서비스에 적용합니다. Spring 기반 웹에서 딥러닝 서버, Next.js 까지 넓혀 왔습니다.';

export interface AboutExperience {
  /** 카드 제목 — 어디서 무엇을 했는지 */
  title: string;
  /** 기간·역할 같은 짧은 부제 */
  meta: string;
  /** 본문 2~3줄 */
  body: string;
  /** 카드 하단 태그 */
  tags: string[];
}

/** 경험 카드 — 문단으로 늘어놓지 않고 제목을 달아 훑어볼 수 있게 한다 */
export const ABOUT_EXPERIENCES: AboutExperience[] = [
  {
    title: '오데트',
    meta: '실무 · 5개월',
    body: '운영 중인 서비스에서 기보 분석 프로그램 UI/UX 개선, 관리자 웹, BF 키오스크를 맡았습니다. 키오스크는 국가 BF 접근성 사양에 맞춰 화면 확대경·음성 안내·고대비 모드를 구현했습니다.',
    tags: ['UI/UX 개선', '관리자 웹', 'BF 접근성'],
  },
  {
    // 낯선 분야(딥러닝)를 새로 익힌 사례라 "빠르게 습득한다" 의 가장 강한 근거다
    title: 'DMS-Fusion',
    meta: '스마트인재개발원 프로젝트',
    body: '웹만 다루던 상태에서 PyTorch·OpenCV 를 새로 익혀, RGB-D 카메라로 운전자 상태를 판별하는 시스템을 만들었습니다. FastAPI 추론 서버를 붙여 화면까지 연결했습니다.',
    tags: ['PyTorch · OpenCV', 'FastAPI 추론 서버', '새 분야 학습'],
  },
  {
    title: 'Planit',
    meta: '개인 프로젝트 · 설계부터 구현까지',
    body: 'Next.js / NestJS / FastAPI 아키텍처를 직접 설계하고 AI 코딩 도구로 구현했습니다. 컴포넌트 구조와 작업 지시서를 명확히 설계하고 생성된 코드를 검토하며 품질을 관리했습니다.',
    tags: ['아키텍처 설계', 'AI 활용 개발', '코드 리뷰'],
  },
];

/**
 * 일하는 방식 — 경험 카드 아래에 놓는 마무리 한 문단.
 * 기술이 아니라 태도를 말하는 자리라 카드로 만들지 않는다.
 */
export const ABOUT_APPROACH =
  '기능을 만드는 것만큼 그 기능이 실제 운영 환경에서 어떻게 동작하는지가 중요하다고 생각합니다. API 과금 이슈나 인앱브라우저 로그인 문제처럼 처음 겪는 문제도 직접 원인을 찾아 해결해왔습니다.';

/**
 * 요약 지표 — 좌측 칸이 비어 보이지 않게 채운다.
 * 값은 실제 프로젝트 스택(projects.json)과 skills.ts 의 `level: 'main'` 에서 가져왔다.
 */
export const ABOUT_HIGHLIGHTS: AboutFact[] = [
  { label: '다뤄 본 영역', value: '웹 프론트엔드 · API 서버 · 딥러닝 · DB' },
  { label: '기술 확장', value: 'Spring · jQuery → FastAPI · PyTorch → Next.js · NestJS' },
];
