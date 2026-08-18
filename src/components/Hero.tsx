import { motion } from 'framer-motion';
import { HiArrowDown } from 'react-icons/hi2';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden pt-16"
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

      <div className="container-page relative">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm font-medium tracking-[0.2em] text-accent sm:text-base"
        >
          발전하는 개발자
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-4xl font-black leading-tight tracking-tight text-content sm:text-6xl lg:text-7xl"
        >
          정제원의
          <br />
          포트폴리오
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base leading-relaxed text-content-muted sm:text-lg"
        >
          AI 여행 플래너 <span className="text-content">Planit</span>, RGB-D 기반 운전자 모니터링{' '}
          <span className="text-content">DMS-Fusion</span> 등 웹 풀스택과 딥러닝을 오가며
          만들었습니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-colors hover:bg-accent sm:text-base"
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

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute inset-x-0 bottom-8 flex justify-center"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-content-subtle"
        >
          <HiArrowDown size={22} />
        </motion.span>
      </motion.div>
    </section>
  );
}
