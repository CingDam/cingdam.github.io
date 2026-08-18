import { motion, useScroll, useSpring } from 'framer-motion';
import { SECTIONS } from '../data/sections';
import { useActiveSection } from '../hooks/useActiveSection';
import { ThemeToggle } from './ThemeToggle';

const SECTION_IDS = SECTIONS.map((s) => s.id);

export function Header() {
  const active = useActiveSection(SECTION_IDS);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="주요 섹션"
        className="border-b border-line bg-canvas/80 backdrop-blur-md"
      >
        <div className="container-page flex h-16 items-center justify-between gap-3">
          {/* 좁은 화면에서는 이름을 숨기고 내비게이션에 폭을 양보한다 */}
          <a
            href="#hero"
            className="hidden shrink-0 text-sm font-bold tracking-tight text-content xs:block sm:text-base"
          >
            정제원
          </a>

          <ul className="flex min-w-0 flex-1 items-center justify-end gap-0.5 overflow-x-auto [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block rounded-md px-2.5 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                      isActive ? 'text-accent' : 'text-content-muted hover:text-content'
                    }`}
                  >
                    {s.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <ThemeToggle />
        </div>
      </nav>

      {/* 스크롤 진행바 — 구버전의 scrollTop>=825 매직넘버를 대체한다 */}
      <motion.div
        style={{ scaleX: progress }}
        className="h-0.5 origin-left bg-gradient-to-r from-accent to-accent-hover"
        aria-hidden="true"
      />
    </header>
  );
}
