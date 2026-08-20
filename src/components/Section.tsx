import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useScrollDirection } from '../hooks/useScrollDirection';

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

/**
 * 섹션 배경 톤.
 *
 * 전 구간이 `bg-canvas` 한 색이면 섹션 경계가 보이지 않아 긴 문서처럼 읽힌다.
 * 홀/짝으로 `canvas` ↔ `surface` 를 교차시켜 스크롤 중 구획이 드러나게 한다.
 * 팔레트가 아닌 시맨틱 토큰이라 두 테마에서 자동으로 뒤집힌다.
 */
export type SectionTone = 'canvas' | 'surface';

const TONE_CLASS: Record<SectionTone, string> = {
  canvas: 'bg-canvas',
  surface: 'bg-surface',
};

/** 섹션 헤더 정렬 — 전 섹션이 좌측 정렬이면 시선이 한쪽만 따라가 단조롭다 */
export type SectionAlign = 'left' | 'center';

interface SectionProps {
  id: string;
  title?: string;
  eyebrow?: string;
  /** 제목 아래 한 줄 설명. 헤더에 무게를 실어 본문과 간격을 만든다 */
  lead?: string;
  children: ReactNode;
  className?: string;
  tone?: SectionTone;
  align?: SectionAlign;
  /**
   * 스크롤 스냅 대상 여부.
   *
   * `snap`(기본) — 한 화면에 들어오는 섹션. 화면 높이를 채우고 스냅 지점이 된다.
   * `free`      — 화면보다 긴 섹션(Projects). 스냅에서 빠져 안에서 자유롭게 읽힌다.
   *               여기에 스냅을 걸면 사용자가 중간을 보려 해도 계속 끌려가 버린다.
   */
  snap?: 'snap' | 'free';
}

export function Section({
  id,
  title,
  eyebrow,
  lead,
  children,
  className = '',
  tone = 'canvas',
  align = 'left',
  snap = 'snap',
}: SectionProps) {
  const centered = align === 'center';
  const ref = useRef<HTMLElement>(null);

  /*
   * 전환 연출 — 세로로 스크롤하되 섹션은 가로로 넘어간다.
   *
   * 스크롤 진행도(`useScroll`)에 물리려 했지만 쓸 수 없었다.
   * `scroll-snap-type: mandatory` 에서 브라우저는 휠 한 번에 다음 스냅 지점까지
   * **한 프레임 만에** 점프한다 (실측: scrollY 768 → 1668, 중간 프레임 없음).
   * `scroll-behavior: smooth` 도 휠 기반 스냅에는 적용되지 않는다.
   * 그래서 스크롤 위치에 연동한 연출은 렌더될 기회 자체가 없다.
   *
   * 대신 "지금 이 섹션이 화면을 차지했는가" 를 상태로 보고 그 전환을 애니메이션한다.
   * 점프가 끝난 직후부터 재생돼 페이지가 넘어가는 느낌이 난다.
   */
  /*
   * `amount` 는 "섹션의 몇 %가 보이면 등장으로 볼 것인가" 다.
   * 큰 값(0.55)을 고정으로 주면 **섹션이 화면보다 훨씬 클 때 영원히 false** 가 된다.
   * 실제로 모바일에서 Projects 가 2286px 이 되어 844px 화면에 55% 가 들어갈 수
   * 없었고, 콘텐츠가 opacity 0 인 채로 영영 보이지 않았다.
   *
   * `some` 은 1px 만 걸쳐도 참이라 이 함정이 없다. 스냅이 켜진 데스크톱에서는
   * 섹션이 화면을 통째로 채우므로 어차피 같은 시점에 발동한다.
   */
  const inView = useInView(ref, { amount: 'some', margin: '-25% 0px -25% 0px' });
  const dir = useScrollDirection();

  /*
   * 책장 넘기기 — 세로축(Y) 회전이 핵심이다.
   * 가로 이동만 주면 "미끄러진다" 에 가깝고, 회전을 얹어야 종이가 넘어가 보인다.
   *
   * 경첩(`transform-origin`)은 넘어오는 쪽 모서리에 둔다.
   * 아래로 스크롤: 새 장이 오른쪽 모서리를 축으로 펼쳐지며 들어온다.
   * 위로 스크롤: 축이 왼쪽으로 뒤집혀 되감기처럼 보인다.
   */
  const down = dir > 0;
  /*
   * 경첩은 항상 넘어오는 쪽 모서리. 아래로 스크롤이면 오른쪽 모서리를 축으로
   * 새 장이 펼쳐지고, 위로 스크롤이면 축이 왼쪽으로 뒤집혀 되감기처럼 보인다.
   */
  const hinge = down ? 'right center' : 'left center';

  /*
   * 각도·이동폭을 키웠다.
   * 스냅 점프 자체는 화면을 **세로로** 움직이기 때문에, 가로 연출이 약하면
   * 세로 전환으로만 읽힌다. 회전을 세게 걸어야 가로가 주인공이 된다.
   * 다만 65도를 넘기면 글자가 읽기 힘들 만큼 찌그러진다.
   */
  const angle = down ? -58 : 58;
  const offX = 180 * dir;

  return (
    <section
      ref={ref}
      id={id}
      data-tone={tone}
      data-snap={snap}
      /*
       * 스냅 대상은 화면 높이를 채워야 한다 — 그래야 한 칸이 한 페이지가 된다.
       * 다만 `justify-center` 로 콘텐츠를 한가운데 고정하지는 않는다.
       * 그러면 짧은 섹션에서 위아래 400px 넘는 빈 화면이 생겨
       * "빈 화면 → 콘텐츠 → 빈 화면" 이 반복된다.
       * `justify-center` 대신 세로 여백을 콘텐츠 양쪽에 고르게 주는 방식으로 채운다.
       *
       * `free` 섹션(Projects)은 콘텐츠 높이를 그대로 쓴다.
       */
      /*
       * 헤더는 `position: fixed` 라 콘텐츠 위에 겹친다 — 문서 흐름에서 자리를
       * 차지하지 않는다. 그래서 섹션 높이에서 헤더를 **빼면 안 된다**.
       * 빼면 섹션이 화면보다 헤더 높이만큼 짧아져, 스냅으로 정착했을 때
       * 화면 아래에 다음 섹션의 윗부분이 그만큼 삐져나온다.
       * (실제로 모든 해상도에서 다음 섹션이 66px 씩 보여 2페이지처럼 보였다.)
       * 헤더에 가리지 않게 하는 건 `scroll-padding-top` + 위쪽 패딩의 역할이다.
       */
      className={`${TONE_CLASS[tone]} ${
        snap === 'snap'
          ? 'flex min-h-svh flex-col justify-center pb-20 pt-[calc(var(--header-h)+3rem)] sm:pb-24 sm:pt-[calc(var(--header-h)+4rem)]'
          : 'py-20 sm:py-28'
      } ${className}`}
    >
      <motion.div
        /* 책장이 넘어가듯 — 경첩을 축으로 회전하며 들어오고 나간다 */
        initial={false}
        style={{ transformOrigin: hinge, transformStyle: 'preserve-3d' }}
        animate={
          inView
            ? { opacity: 1, x: 0, rotateY: 0 }
            : { opacity: 0, x: offX, rotateY: angle }
        }
        /*
         * 들어올 때만 부드럽게 안착시키고, 나갈 때는 짧고 빠르게 젖힌다.
         * 나가는 장이 오래 남아 있으면 두 페이지가 겹쳐 보인다.
         */
        transition={
          inView
            ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0.28, ease: [0.4, 0, 1, 1] }
        }
        className="container-page w-full will-change-[opacity,transform]"
      >
        {(title || eyebrow) && (
          <motion.div
            variants={staggerParent(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className={`mb-12 sm:mb-14 ${centered ? 'flex flex-col items-center text-center' : ''}`}
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
            {lead && (
              <motion.p
                variants={fadeUp}
                className={`mt-4 max-w-2xl text-base leading-relaxed text-content-muted ${
                  centered ? 'mx-auto' : ''
                }`}
              >
                {lead}
              </motion.p>
            )}
            {/* 제목 아래 밑줄이 좌→우로 자라난다 (중앙 정렬일 땐 가운데에서 양쪽으로) */}
            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
              }}
              className={`mt-5 h-px w-24 bg-gradient-to-r from-accent to-transparent ${
                centered ? 'origin-center bg-gradient-to-r from-transparent via-accent to-transparent' : 'origin-left'
              }`}
            />
          </motion.div>
        )}

        {children}
      </motion.div>
    </section>
  );
}
