/**
 * GitHub README + 레포 메타데이터 → src/data/generated/projects.json
 *
 * 실행: npm run sync:projects
 *
 * 런타임이 아니라 빌드(수동 실행) 시점에만 GitHub 을 호출한다.
 * 결과 JSON 을 커밋해 두므로 배포 환경에서는 네트워크가 필요 없고,
 * rate limit 이나 오프라인 문제도 생기지 않는다.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { overrides, PROJECT_ORDER, findOverride } from '../src/data/projects.ts';
import type { Project, LanguageSlice, FeatureItem } from '../src/types/project.ts';

const OWNER = 'cingdam';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/generated/projects.json');

// 토큰이 있으면 쓰고, 없으면 비인증(시간당 60회)으로 폴백한다.
// 레포 4개 × 요청 3개 = 12회라 비인증으로도 충분하다.
const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'cingdam-portfolio-build',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} ${res.statusText} — ${path}`);
  }
  return res.json() as Promise<T>;
}

/* ---------- README 파싱 ---------- */

/**
 * 마크다운을 `#`/`##` 섹션 단위로 쪼갠다.
 * 제목(소문자·공백제거) → 본문 매핑.
 */
function splitSections(md: string): Map<string, string> {
  const out = new Map<string, string>();
  const lines = md.split('\n');
  let title: string | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (title !== null) out.set(title, buf.join('\n').trim());
  };

  for (const line of lines) {
    const m = /^(#{1,2})\s+(.+?)\s*$/.exec(line);
    if (m) {
      flush();
      title = m[2].replace(/[#*`]/g, '').replace(/\s+/g, '').toLowerCase();
      buf = [];
    } else if (title !== null) {
      buf.push(line);
    }
  }
  flush();
  return out;
}

/** 여러 후보 제목 중 먼저 맞는 섹션을 돌려준다 */
function pick(sections: Map<string, string>, ...names: string[]): string | undefined {
  for (const n of names) {
    const v = sections.get(n.replace(/\s+/g, '').toLowerCase());
    if (v) return v;
  }
  return undefined;
}

/** 마크다운 장식·이미지·뱃지를 걷어내고 한 줄 텍스트로 */
function plain(md: string | undefined): string {
  if (!md) return '';
  return md
    .replace(/<img[^>]*>/g, '') // shields.io 뱃지
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 → 텍스트
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .replace(/[*`>]/g, '')
    .replace(/^\s*[-–]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 기술 스택 추출.
 * Helpus·DMS-Fusion 은 shields.io 뱃지로 스택을 적어 두었다 —
 * 뱃지 URL 의 `logo=` 파라미터가 가장 정확한 소스다.
 */
/**
 * 구분자(· • , /)로 쪼개되 괄호 안은 건드리지 않는다.
 * 'Passport(JWT·Google·Kakao·Naver)' 가 조각나는 것을 막는다.
 */
function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let buf = '';

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);

    // '@scope/package' 의 슬래시는 구분자가 아니다 — 패키지명 하나로 둔다.
    const inScopedPkg = ch === '/' && /@[\w.-]+$/.test(buf);

    if (depth === 0 && !inScopedPkg && /[·•,/]/.test(ch)) {
      out.push(buf);
      buf = '';
    } else {
      buf += ch;
    }
  }
  out.push(buf);
  return out.filter((t) => t.trim() !== '');
}

function parseStack(md: string | undefined): string[] {
  if (!md) return [];
  const found = new Set<string>();

  const add = (raw: string) => {
    const v = plain(raw)
      .replace(/^[-–—•]\s*/, '')
      .replace(/\s*\(.*?\)\s*$/, '') // 뒤쪽 괄호 주석 제거
      .trim();
    // 표 구분선('--'), 빈 값, 지나치게 긴 문장은 스택이 아니다.
    if (!v || v.length > 28) return;
    if (/^[-–—=\s|:]+$/.test(v)) return;
    found.add(v);
  };

  // 1) shields.io 뱃지의 logo= 값 — Helpus·DMS-Fusion 형식
  for (const m of md.matchAll(/logo=([a-z0-9.+-]+)/gi)) {
    found.add(prettifyLogo(m[1]));
  }

  for (const line of md.split('\n')) {
    // 표 구분선/헤더 줄은 통째로 건너뛴다
    if (/^\s*\|?[\s|:-]*$/.test(line)) continue;

    // 2) Planit 형식: `**Client** — Next.js 15 · React 19 · TypeScript`
    const grouped = /^\s*\*\*[^*]+\*\*\s*[—–-]\s*(.+)$/.exec(line);
    if (grouped) {
      for (const t of splitTopLevel(grouped[1])) add(t);
      continue;
    }

    // 3) 뱃지 줄에 섞인 텍스트 (예: 'Frontend : JSP, <img...>')
    if (/<img/.test(line)) {
      const head = line.split('<img')[0];
      if (head.includes(':')) {
        for (const t of splitTopLevel(head.split(':').slice(1).join(':'))) add(t);
      }
      continue;
    }

    const v = plain(line);
    if (!v) continue;
    const body = v.includes(':') ? v.split(':').slice(1).join(':') : v;
    for (const t of splitTopLevel(body)) add(t);
  }
  return [...found].filter(Boolean).slice(0, 14);
}

function prettifyLogo(slug: string): string {
  const map: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    react: 'React',
    nextdotjs: 'Next.js',
    nestjs: 'NestJS',
    fastapi: 'FastAPI',
    spring: 'Spring',
    jquery: 'jQuery',
    mariadb: 'MariaDB',
    mysql: 'MySQL',
    mongodb: 'MongoDB',
    milvus: 'Milvus',
    pytorch: 'PyTorch',
    opencv: 'OpenCV',
    tensorflow: 'TensorFlow',
    docker: 'Docker',
    redis: 'Redis',
    socketdotio: 'Socket.IO',
    tailwindcss: 'Tailwind CSS',
  };
  return map[slug.toLowerCase()] ?? slug;
}

/**
 * 주요 기능 추출.
 * Planit 은 마크다운 표(`| 영역 | 기능 |`), 나머지는 `- 제목` 목록을 쓴다.
 */
function parseFeatures(md: string | undefined): FeatureItem[] {
  if (!md) return [];
  const items: FeatureItem[] = [];

  // 표 형식
  const rows = md.split('\n').filter((l) => /^\s*\|/.test(l));
  if (rows.length >= 2) {
    for (const row of rows.slice(2)) {
      // 헤더 + 구분선 건너뜀
      const cells = row.split('|').map((c) => plain(c)).filter((c) => c !== '');
      if (cells.length >= 2) items.push({ title: cells[0], description: cells[1] });
    }
    if (items.length) return items.slice(0, 10);
  }

  // 이미지 캡션용 줄 — 기능이 아니다 (DMS-Fusion README 가 '결과물'을 이렇게 쓴다)
  const isCaption = (t: string) => /^(결과물|결과|이미지|사진|영상|데모)\s*:?\s*$/.test(t);

  // 목록 형식 — 최상위 '- 제목 : 설명' 아래 들여쓴 '- 내용 : ...'
  let cur: FeatureItem | null = null;
  const flush = () => {
    if (cur && cur.title && !isCaption(cur.title)) items.push(cur);
    cur = null;
  };

  for (const line of md.split('\n')) {
    const top = /^-\s+(?!\s)(.+)$/.exec(line);
    const sub = /^\s{2,}-\s+(.+)$/.exec(line);
    if (top) {
      flush();
      const t = plain(top[1]);
      if (isCaption(t)) continue;
      // '제목 : 설명' 을 쪼갠다. 콜론이 없으면 제목만.
      // 단 '1:1 채팅' 처럼 숫자 사이 콜론은 구분자가 아니다 — 공백을 낀 콜론만 인정한다.
      const m = /^(.{1,30}?)\s+:\s*(.+)$/.exec(t);
      cur = m ? { title: m[1].trim(), description: m[2].trim() } : { title: t };
    } else if (sub && cur) {
      const t = plain(sub[1]);
      if (/^내용\s*:/.test(t)) cur.description = t.replace(/^내용\s*:\s*/, '');
    }
  }
  flush();
  return items.slice(0, 10);
}

/** README 첫 인용문(> ...) 또는 첫 문단을 한 줄 소개로 */
function parseTagline(md: string): string {
  const quote = /^>\s+(.+)$/m.exec(md);
  if (quote) return plain(quote[1]);
  for (const line of md.split('\n').slice(1)) {
    const v = plain(line);
    if (v && !/^#/.test(line) && v.length > 10) return v;
  }
  return '';
}

/* ---------- 메인 ---------- */

interface RepoMeta {
  pushed_at: string;
  stargazers_count: number;
  html_url: string;
  description: string | null;
}

async function buildProject(repo: string): Promise<Project> {
  const ov = findOverride(repo) ?? { repo };

  const meta = await gh<RepoMeta>(`/repos/${OWNER}/${repo}`);
  const langBytes = await gh<Record<string, number>>(`/repos/${OWNER}/${repo}/languages`);

  const total = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
  const languages: LanguageSlice[] = Object.entries(langBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: Math.round((bytes / total) * 1000) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  // README 는 없을 수 있다 (TripPlanner). 그 경우 로컬 데이터만 쓴다.
  let md = '';
  try {
    const readme = await gh<{ content: string }>(`/repos/${OWNER}/${repo}/readme`);
    md = Buffer.from(readme.content, 'base64').toString('utf-8');
  } catch {
    console.warn(`  · README 없음 — 로컬 데이터만 사용`);
  }

  const s = splitSections(md);

  const parsed: Partial<Project> = md
    ? {
        tagline: parseTagline(md),
        description: plain(pick(s, '프로젝트 내용', 'DMS_Fusion')) || parseTagline(md),
        period: plain(pick(s, '제작 기간', '개발 기간')),
        role: plain(pick(s, '맡은 역할')),
        stack: parseStack(pick(s, '사용기술', '기술 스택', '사용 기술')),
        features: parseFeatures(pick(s, '주요 기능')),
      }
    : {};

  // 로컬 오버라이드가 항상 이긴다.
  const merged: Project = {
    repo,
    name: ov.name ?? repo,
    tagline: ov.tagline ?? parsed.tagline ?? '',
    description: ov.description ?? parsed.description ?? '',
    period: ov.period ?? parsed.period ?? undefined,
    role: ov.role ?? parsed.role ?? undefined,
    teamSize: ov.teamSize,
    kind: ov.kind,
    stack: ov.stack ?? parsed.stack ?? [],
    features: ov.features ?? parsed.features ?? [],
    languages,
    pushedAt: meta.pushed_at,
    stars: meta.stargazers_count,
    url: meta.html_url,
    featured: ov.featured ?? false,
    order: ov.order ?? 99,
    thumbnail: ov.thumbnail,
    screenshots: ov.screenshots ?? [],
  };

  return merged;
}

async function main() {
  console.log(`GitHub 에서 프로젝트 ${PROJECT_ORDER.length}개를 가져옵니다...`);
  console.log(token ? '  (인증 토큰 사용)' : '  (비인증 — 시간당 60회 제한)');

  const projects: Project[] = [];
  for (const repo of PROJECT_ORDER) {
    console.log(`- ${repo}`);
    projects.push(await buildProject(repo));
  }

  projects.sort((a, b) => a.order - b.order);

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(projects, null, 2) + '\n', 'utf-8');

  console.log(`\n완료 → ${OUT}`);
  for (const p of projects) {
    const warn: string[] = [];
    if (!p.tagline) warn.push('tagline 없음');
    if (!p.stack.length) warn.push('stack 비어있음');
    if (!p.features.length) warn.push('features 비어있음');
    console.log(
      `  ${p.featured ? '★' : ' '} ${p.name.padEnd(12)} ${String(p.languages[0]?.name ?? '-').padEnd(18)}` +
        (warn.length ? `  ⚠ ${warn.join(', ')}` : ''),
    );
  }

  // 오버라이드에 적혔지만 게재 목록에 없는 레포 경고
  for (const o of overrides) {
    if (!(PROJECT_ORDER as readonly string[]).includes(o.repo)) {
      console.warn(`  ⚠ ${o.repo} 는 오버라이드에 있지만 PROJECT_ORDER 에 없어 제외됨`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
