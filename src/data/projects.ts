import type { Project } from '../types/project';

/**
 * 로컬 오버라이드.
 *
 * GitHub API 가 채워주지 못하는 것만 여기에 적는다.
 * (4개 레포 모두 description 이 비어 있고 topics 도 없어서, API 만으로는
 *  카드에 이름과 언어 배지밖에 남지 않는다.)
 *
 * 언어 구성비·최종 푸시일·스타·URL 은 `npm run sync:projects` 가 자동으로 채운다.
 * 여기서 지정한 값은 항상 자동 취득분을 덮어쓴다.
 */
export type ProjectOverride = Partial<Project> & Pick<Project, 'repo'>;

export const PROJECT_ORDER = [
  'TripAdviser',
  'DMS-Fusion',
  'Helpus',
  'TripPlanner',
] as const;

export const overrides: ProjectOverride[] = [
  {
    repo: 'TripAdviser',
    // 레포명은 TripAdviser 지만 실제 서비스명은 Planit 이다.
    name: 'Planit',
    featured: true,
    order: 1,
    thumbnail: '/projects/planit/planit_main.png',
    screenshots: ['/projects/planit/planit_main.png', '/projects/planit/planit_list.png'],
  },
  {
    repo: 'DMS-Fusion',
    name: 'DMS-Fusion',
    featured: true,
    order: 2,
    thumbnail: '/projects/dms/main.png',
    screenshots: [
      '/projects/dms/main.png',
      '/projects/dms/setting-menu.png',
      '/projects/dms/seat-set.png',
    ],
  },
  {
    repo: 'Helpus',
    name: 'Helpus',
    featured: false,
    order: 3,
    thumbnail: '/thumbnail/mainpage_helpus.png',
    screenshots: [
      '/projects/helpus/main.png',
      '/projects/helpus/com_main.png',
      '/projects/helpus/contract.png',
      '/projects/helpus/chat.png',
      '/projects/helpus/chat_2.png',
    ],
  },
  {
    repo: 'TripPlanner',
    name: 'TripPlanner',
    featured: false,
    order: 4,
    thumbnail: '/thumbnail/mainpage_tripplanner.png',
    screenshots: [
      '/projects/tripplanner/main.png',
      '/projects/tripplanner/Scheduel.png',
      '/projects/tripplanner/Login.png',
      '/projects/tripplanner/signup.png',
    ],

    // TripPlanner 는 레포에 README 가 없어서 전부 여기에 적는다.
    // 아래 문구는 기존 포트폴리오(구 modal.js)에서 옮겨온 것이다.
    // TODO(사용자 확인): 2022년에 쓴 내용이라 지금 기준으로 다듬을 필요가 있다.
    tagline: '지도에서 숙소와 여행지를 담아 일정을 만드는 여행 계획 서비스',
    description:
      '여행 가기 전에 일일이 찾아가면서 일정을 짜기 힘들기 때문에, ' +
      '지도에서 손쉽게 숙소나 여행지를 찾아 일정을 만들 수 있는 사이트입니다.',
    period: '2022.06',
    kind: '개인 프로젝트',
    role: '기획 · 프론트엔드 · 백엔드 (1인 개발)',
    stack: ['Spring Framework', 'JavaScript', 'jQuery', 'MariaDB', 'Google Maps Platform'],
    features: [
      {
        title: '지도 기반 장소 검색',
        description: 'Google Maps Platform 으로 숙소·여행지를 검색하고 지도에서 바로 확인',
      },
      { title: '일정 만들기', description: '검색한 장소를 담아 날짜별 여행 일정으로 구성' },
      { title: '회원 기능', description: '회원가입 · 로그인 후 개인 일정 저장' },
    ],
  },
];

/** repo 이름으로 오버라이드를 찾는다 */
export function findOverride(repo: string): ProjectOverride | undefined {
  return overrides.find((o) => o.repo === repo);
}
