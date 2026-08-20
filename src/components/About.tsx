import { motion } from 'framer-motion';
import { Section, staggerParent, fadeUp, VIEWPORT } from './Section';
import {
  ABOUT_FACTS,
  ABOUT_LEAD,
  ABOUT_EXPERIENCES,
  ABOUT_APPROACH,
  ABOUT_HIGHLIGHTS,
} from '../data/about';
import projects from '../data/generated/projects.json';

export function About() {
  // 프로젝트 수는 데이터에서 자동으로 센다 — 구버전처럼 "총 2개" 를 하드코딩하지 않는다.
  const projectCount = projects.length;
  const years = projects
    .map((p) => new Date(p.pushedAt).getFullYear())
    .filter((y) => !Number.isNaN(y));
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';

  return (
    <Section id="about" eyebrow="About" title="소개" tone="surface">
      <motion.div
        variants={staggerParent(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
      >
        {/* 한 줄 요약 — 문단 벽 대신 이 문장이 먼저 눈에 들어오게 한다 */}
        <motion.p
          variants={fadeUp}
          className="max-w-4xl text-lg font-semibold leading-relaxed tracking-tight text-content sm:text-xl sm:leading-relaxed"
        >
          {ABOUT_LEAD}
        </motion.p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] lg:gap-10">
          {/* 좌: 사실 + 지표 */}
          <motion.div variants={fadeUp} className="space-y-4">
            <dl className="space-y-3">
              {ABOUT_FACTS.map((f) => (
                <div key={f.label} className="border-l-2 border-accent/40 pl-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-content-subtle">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm text-content">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-card p-4">
                <div className="text-2xl font-bold text-content">{projectCount}</div>
                <div className="mt-1 text-xs text-content-subtle">게재 프로젝트</div>
              </div>
              {span && (
                <div className="rounded-xl border border-line bg-card p-4">
                  <div className="text-2xl font-bold text-content">{span}</div>
                  <div className="mt-1 text-xs text-content-subtle">작업 기간</div>
                </div>
              )}
              {ABOUT_HIGHLIGHTS.map((h) => (
                <div
                  key={h.label}
                  className="col-span-2 rounded-xl border border-line bg-card p-4"
                >
                  <div className="text-xs text-content-subtle">{h.label}</div>
                  <div className="mt-1 text-sm font-medium text-content">{h.value}</div>
                </div>
              ))}
            </div>

            {/*
              일하는 방식 — 오른쪽 카드 아래에 두면 화면 밖으로 잘렸다
              (About 은 스냅 섹션이라 한 화면을 넘기면 안 된다).
              왼쪽 칸에 여유가 있어 이쪽으로 내린다.
            */}
            <p className="border-l-2 border-accent/40 pl-4 text-sm leading-6 text-content-muted">
              {ABOUT_APPROACH}
            </p>
          </motion.div>

          {/* 우: 경험 카드 + 일하는 방식 */}
          <div className="space-y-3">
            {ABOUT_EXPERIENCES.map((e) => (
              <motion.article
                key={e.title}
                variants={fadeUp}
                className="rounded-xl border border-line bg-card p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-base font-bold text-content sm:text-lg">{e.title}</h3>
                  <span className="text-xs text-content-subtle">{e.meta}</span>
                </div>
                <p className="mt-2.5 text-sm leading-6 text-content-muted">{e.body}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-line bg-surface-raised px-2.5 py-1 text-xs text-content-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
