import { motion } from 'framer-motion';
import { Section, staggerParent, fadeUp, VIEWPORT } from './Section';
import { ABOUT_FACTS, ABOUT_PARAGRAPHS, ABOUT_HIGHLIGHTS } from '../data/about';
import projects from '../data/generated/projects.json';

export function About() {
  // 프로젝트 수는 데이터에서 자동으로 센다 — 구버전처럼 "총 2개" 를 하드코딩하지 않는다.
  const projectCount = projects.length;
  const years = projects
    .map((p) => new Date(p.pushedAt).getFullYear())
    .filter((y) => !Number.isNaN(y));
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';

  return (
    <Section id="about" eyebrow="About" title="소개">
      <motion.div
        variants={staggerParent(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16"
      >
        {/* 좌: 사실 목록 */}
        <motion.div variants={fadeUp}>
          <dl className="space-y-4">
            {ABOUT_FACTS.map((f) => (
              <div key={f.label} className="border-l-2 border-accent/40 pl-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-content-subtle">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm text-content sm:text-base">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="text-2xl font-bold text-content">{projectCount}</div>
              <div className="mt-1 text-xs text-content-subtle">게재 프로젝트</div>
            </div>
            {span && (
              <div className="rounded-xl border border-line bg-surface p-4">
                <div className="text-2xl font-bold text-content">{span}</div>
                <div className="mt-1 text-xs text-content-subtle">작업 기간</div>
              </div>
            )}
            {ABOUT_HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                className="col-span-2 rounded-xl border border-line bg-surface p-4"
              >
                <div className="text-xs text-content-subtle">{h.label}</div>
                <div className="mt-1 text-sm font-medium text-content">{h.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 우: 자기소개 문단 */}
        <motion.div variants={fadeUp}>
          {ABOUT_PARAGRAPHS.length > 0 ? (
            <div className="space-y-5">
              {ABOUT_PARAGRAPHS.map((p, i) => (
                <p key={i} className="text-base leading-8 text-content-muted sm:text-lg sm:leading-9">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            // 내용이 비어 있을 때만 보이는 안내. src/data/about.ts 를 채우면 사라진다.
            <div className="rounded-xl border border-dashed border-accent/30 bg-accent/5 p-6">
              <p className="text-sm font-semibold text-accent">자기소개를 작성해 주세요</p>
              <p className="mt-2 text-sm leading-7 text-content-muted">
                <code className="rounded bg-line px-1.5 py-0.5 text-content">
                  src/data/about.ts
                </code>{' '}
                의 <code className="text-content">ABOUT_PARAGRAPHS</code> 에 문단을 추가하면 이
                자리에 표시됩니다.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </Section>
  );
}
