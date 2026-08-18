import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 스크롤 진입 애니메이션 공통 값.
 *
 * 섹션마다 콘텐츠 높이가 486px~1568px 로 3배 넘게 차이 나기 때문에,
 * 블록 하나를 통째로 페이드하면 긴 섹션은 밋밋해진다.
 * 항목 단위로 stagger 를 걸어 스크롤과 연출이 함께 진행되도록 한다.
 */
export const VIEWPORT = { once: true, margin: '-15% 0px -10% 0px' } as const;

/** 자식들을 순차적으로 등장시키는 부모 */
export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** stagger 부모 아래에 놓는 자식 한 칸 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

interface SectionProps {
  id: string;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  /**
   * 화면 높이만큼 최소 높이를 확보할지.
   * 짧은 섹션(Contact 등)이 스크롤 도중 순식간에 지나가 버리는 것을 막는다.
   */
  fullHeight?: boolean;
}

export function Section({
  id,
  title,
  eyebrow,
  children,
  className = '',
  fullHeight = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-24 sm:py-32 ${
        fullHeight ? 'flex min-h-svh flex-col justify-center' : ''
      } ${className}`}
    >
      <div className="container-page w-full">
        {(title || eyebrow) && (
          <motion.div
            variants={staggerParent(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mb-12 sm:mb-16"
          >
            {eyebrow && (
              <motion.p
                variants={fadeUp}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
              >
                {eyebrow}
              </motion.p>
            )}
            {title && (
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-bold tracking-tight text-content sm:text-4xl"
              >
                {title}
              </motion.h2>
            )}
            {/* 제목 아래 밑줄이 좌→우로 자라난다 */}
            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
              }}
              className="mt-5 h-px w-24 origin-left bg-gradient-to-r from-accent to-transparent"
            />
          </motion.div>
        )}

        {children}
      </div>
    </section>
  );
}
