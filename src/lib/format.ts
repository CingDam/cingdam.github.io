/** 'YYYY-MM-DDTHH:mm:ssZ' → 'YYYY.MM' */
export function formatMonth(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** GitHub 언어별 대표 색 (없으면 회색) */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'Jupyter Notebook': '#DA5B0B',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Handlebars: '#f7931e',
};

export function languageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? '#8b949e';
}
