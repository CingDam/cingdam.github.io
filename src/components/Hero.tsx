import { motion } from 'framer-motion';
import projects from '../data/generated/projects.json';

const EASE = [0.22, 1, 0.36, 1] as const;

/** 등장 순서를 인덱스로 계산해 delay 를 하드코딩하지 않는다 */
const rise = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.1 * i, ease: EASE },
});

export function Hero() {
  // 우측 미리보기는 대표 프로젝트에서 자동으로 고른다 — 이름·이미지를 하드코딩하지 않는다.
  const showcase = projects.filter((p) => p.featured && p.thumbnail).slice(0, 2);

  return (
    <section
      id="hero"
      data-snap="snap"
      className="relative flex min-h-svh items-center overflow-hidden bg-canvas pt-16"
    >
      {/* 배경 그라디언트 — 구버전의 단색 #005281 을 재해석 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--glow-from),var(--glow-to)_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />

      {/*
        1440px 에서 오른쪽 절반이 통째로 비던 문제를 해결한다.
        좌: 카피 / 우: 대표 프로젝트 미리보기. lg 미만에서는 한 열로 접힌다.
      */}
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <motion.p
            {...rise(0)}
            className="text-sm font-medium tracking-[0.2em] text-accent sm:text-base"
          >
            빠르게 배우는 개발자
          </motion.p>

          <motion.h1
            {...rise(1)}
            className="mt-4 text-4xl font-black leading-tight tracking-tight text-content sm:text-6xl lg:text-7xl"
          >
            정제원의
            <br />
            포트폴리오
          </motion.h1>

          <motion.p
            {...rise(2)}
            className="mt-6 max-w-xl text-base leading-relaxed text-content-muted sm:text-lg"
          >
            필요한 기술은 그때그때 익혀 씁니다. Spring 기반 웹에서 시작해{' '}
            <span className="text-content">DMS-Fusion</span> 의 딥러닝 서버,{' '}
            <span className="text-content">Planit</span> 의 Next.js·NestJS 까지 넓혀 왔습니다.
          </motion.p>

          <motion.div {...rise(3)} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover sm:text-base"
            >
              프로젝트 보기
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold text-content transition-colors hover:border-accent/50 hover:bg-surface-raised sm:text-base"
            >
              더 알아보기
            </a>
          </motion.div>
        </div>

        {/* 우: 대표 프로젝트 미리보기 — 겹쳐 쌓아 깊이를 만든다 */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="relative hidden lg:block"
        >
          {showcase.map((p, i) => (
            <motion.img
              key={p.repo}
              src={p.thumbnail}
              alt=""
              loading="eager"
              animate={{ y: [0, i === 0 ? -10 : 10, 0] }}
              transition={{
                duration: 7 + i * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={
                i === 0
                  ? 'w-full rounded-2xl border border-line bg-surface object-cover shadow-2xl shadow-accent/10'
                  : 'absolute -bottom-16 -left-10 w-2/3 rounded-xl border border-line bg-surface object-cover shadow-2xl shadow-accent/10'
              }
            />
          ))}
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 — 스크롤바를 감췄으므로 "더 있다" 는 유일한 단서다.
          책장 넘기기에 맞춰 마우스 모양 대신 얇은 세로선이 흘러내리는 형태로 둔다. */}
      <motion.a
        href="#about"
        aria-label="다음 섹션으로 이동"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="group absolute inset-x-0 bottom-10 mx-auto flex w-fit flex-col items-center gap-2.5"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-content-subtle transition-colors group-hover:text-accent">
          Scroll
        </span>
        {/* 선 안을 빛이 위에서 아래로 훑고 지나간다 */}
        <span className="relative h-12 w-px overflow-hidden rounded-full bg-line">
          <motion.span
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        </span>
      </motion.a>
    </section>
  );
}
