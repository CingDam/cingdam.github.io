/** 헤더 내비게이션 + 스크롤 대상 섹션 정의 */
export interface SectionDef {
  id: string;
  label: string;
}

export const SECTIONS: SectionDef[] = [
  { id: 'hero', label: 'Main' },
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Project' },
  { id: 'contact', label: 'Contact' },
];
