/** GitHub 언어 통계 한 줄 (바이트 수 → 비율) */
export interface LanguageSlice {
  name: string;
  bytes: number;
  /** 0~100, 소수 첫째 자리까지 */
  percent: number;
}

/** README 에서 뽑아낸 "주요 기능" 한 항목 */
export interface FeatureItem {
  title: string;
  description?: string;
}

/**
 * 포트폴리오 카드 하나.
 * GitHub API 에서 자동으로 채우는 필드와 src/data/projects.ts 의
 * 로컬 오버라이드가 합쳐진 최종 형태다.
 */
export interface Project {
  /** 레포 이름 (예: 'TripAdviser') — 키로 쓴다 */
  repo: string;
  /** 화면에 보여줄 이름 (예: 'Planit'). 레포명과 다를 수 있다 */
  name: string;
  /** 한 줄 소개 */
  tagline: string;
  /** 카드 본문 설명 */
  description: string;

  /** 제작 기간 (예: '2025.03.04 ~ 2025.03.20') */
  period?: string;
  /** 맡은 역할 */
  role?: string;
  /** 팀 규모 (예: '3명'). 개인 프로젝트면 없음 */
  teamSize?: string;
  /** '팀 프로젝트' | '개인 프로젝트' 등 */
  kind?: string;

  /** 기술 스택 태그 */
  stack: string[];
  /** 주요 기능 */
  features: FeatureItem[];

  /** 언어 구성비 (GitHub 자동) */
  languages: LanguageSlice[];
  /** ISO 날짜. 최종 푸시 (GitHub 자동) */
  pushedAt: string;
  /** 스타 수 (GitHub 자동) */
  stars: number;
  /** 레포 URL (GitHub 자동) */
  url: string;

  /** 대표작 여부 — 카드를 크게 렌더한다 */
  featured: boolean;
  /** 카드 정렬 순서 (작을수록 먼저) */
  order: number;

  /** 썸네일 경로 (public/ 기준 절대경로) */
  thumbnail?: string;
  /** 모달 캐러셀 이미지들 (public/ 기준 절대경로) */
  screenshots: string[];
}
