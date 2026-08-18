import type { IconType } from 'react-icons';
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiJavascript,
  SiTailwindcss,
  SiJquery,
  SiHtml5,
  SiCssmodules,
  SiNestjs,
  SiFastapi,
  SiNodedotjs,
  SiSpring,
  SiMysql,
  SiMariadb,
  SiMongodb,
  SiMilvus,
  SiPytorch,
  SiOpencv,
  SiPython,
  SiGit,
  SiGithub,
  SiClaudecode,
} from 'react-icons/si';
import { FaDatabase } from 'react-icons/fa6';

/**
 * Skills 섹션 데이터.
 *
 * 구버전 skills.js 는 카테고리마다 거의 같은 styled-component 를 4벌
 * (Subhead1~4, IconPub/Front/Back/Db) 복붙하고 아이콘 크기를 개별
 * 하드코딩(600px, 370px, margin 200px …)해서 정렬을 맞췄다.
 * 여기서는 데이터 한 벌로 대체하고 렌더는 grid 가 담당한다.
 *
 * 아이콘은 png 대신 react-icons 의 Simple Icons(SVG)를 쓴다.
 * 벡터라 어느 배율에서도 또렷하고, 색을 CSS 로 제어할 수 있어서
 * 라이트/다크 테마 양쪽에 자동으로 대응된다.
 *
 * ⚠️ TODO(사용자 확인 필요)
 * 항목 구성과 `level` 값은 직접 손봐 주세요.
 * 구버전 아이콘이 jQuery·Oracle 기준(2022년)이라 최근 스택과 차이가 큽니다.
 */

export type SkillLevel = 'main' | 'used' | 'learning';

export interface Skill {
  name: string;
  icon: IconType;
  /** 브랜드 색(hex) — 라이트 테마 기준 */
  color: string;
  /**
   * 다크 테마용 색. 브랜드 색이 검정에 가까워 어두운 배경에서
   * 묻히는 경우(Next.js 등)에만 지정한다.
   */
  darkColor?: string;
  level: SkillLevel;
}

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  skills: Skill[];
}

export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  main: '주력',
  used: '사용 경험',
  learning: '학습 중',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Front-end',
    description: '화면 구현과 상태 관리를 맡습니다.',
    skills: [
      { name: 'React', icon: SiReact, color: '#087ea4', level: 'main' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178c6', level: 'main' },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        color: '#000000',
        darkColor: '#ffffff', // 브랜드 색이 검정이라 다크에서는 반전시킨다
        level: 'main',
      },
      { name: 'JavaScript', icon: SiJavascript, color: '#b8a300', level: 'main' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#0891b2', level: 'used' },
      { name: 'jQuery', icon: SiJquery, color: '#0769ad', level: 'used' },
    ],
  },
  {
    id: 'publishing',
    label: 'Publishing',
    description: '마크업과 스타일 기초.',
    skills: [
      { name: 'HTML', icon: SiHtml5, color: '#e34c26', level: 'main' },
      { name: 'CSS', icon: SiCssmodules, color: '#2965f1', level: 'main' },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end',
    description: 'API 서버와 인증·실시간 통신을 다룹니다.',
    skills: [
      { name: 'NestJS', icon: SiNestjs, color: '#e0234e', level: 'used' },
      { name: 'FastAPI', icon: SiFastapi, color: '#059669', level: 'used' },
      { name: 'Node.js', icon: SiNodedotjs, color: '#4f9c3f', level: 'used' },
      { name: 'Spring', icon: SiSpring, color: '#4f9c3f', level: 'used' },
      { name: 'Python', icon: SiPython, color: '#3572A5', level: 'used' },
    ],
  },
  {
    id: 'data',
    label: 'Data / AI',
    description: '데이터 저장과 딥러닝 모델.',
    skills: [
      { name: 'MySQL', icon: SiMysql, color: '#00758f', level: 'used' },
      { name: 'MariaDB', icon: SiMariadb, color: '#7d2a3f', level: 'used' },
      { name: 'MongoDB', icon: SiMongodb, color: '#3fa037', level: 'used' },
      { name: 'Milvus', icon: SiMilvus, color: '#0d8bd9', level: 'used' },
      { name: 'PyTorch', icon: SiPytorch, color: '#ee4c2c', level: 'used' },
      { name: 'OpenCV', icon: SiOpencv, color: '#5c3ee8', level: 'used' },
      // Simple Icons 에 Oracle 로고가 없어 일반 DB 아이콘으로 대체한다.
      { name: 'Oracle', icon: FaDatabase, color: '#c74634', level: 'used' },
    ],
  },
  {
    id: 'tools',
    label: '협업 · 도구',
    description: '버전 관리와 AI 코딩 도구를 활용해 개발합니다.',
    skills: [
      { name: 'Git', icon: SiGit, color: '#f05032', level: 'main' },
      {
        name: 'GitHub',
        icon: SiGithub,
        color: '#24292f',
        darkColor: '#ffffff', // 브랜드 색이 거의 검정이라 다크에서는 반전한다
        level: 'main',
      },
      {
        name: 'Claude Code',
        icon: SiClaudecode,
        color: '#d97757',
        level: 'main',
      },
    ],
  },
];
