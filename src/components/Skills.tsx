import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, staggerParent, fadeUp, VIEWPORT } from './Section';
import { SKILL_CATEGORIES, SKILL_LEVEL_LABEL } from '../data/skills';
import { useTheme } from '../hooks/useTheme';

export function Skills() {
  const [activeId, setActiveId] = useState(SKILL_CATEGORIES[0].id);
  const { resolved } = useTheme();
  const isDark = resolved === 'dark';
  const active = SKILL_CATEGORIES.find((c) => c.id === activeId) ?? SKILL_CATEGORIES[0];

  return (
    <Section id="skills" eyebrow="Skills" title="기술 스택">
      {/* 탭 — 구버전은 Subhead1~4 를 복붙했지만 여기서는 map 한 번이면 된다 */}
      <motion.div
        role="tablist"
        aria-label="기술 분야"
        variants={staggerParent(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="flex flex-wrap gap-2"
      >
        {SKILL_CATEGORIES.map((c) => {
          const isActive = c.id === activeId;
          return (
            <motion.button
              key={c.id}
              variants={fadeUp}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`skills-panel-${c.id}`}
              onClick={() => setActiveId(c.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:text-base ${
                isActive ? 'text-on-accent' : 'text-content-muted hover:text-content'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="skills-tab"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          id={`skills-panel-${active.id}`}
          role="tabpanel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <p className="text-sm text-content-subtle">{active.description}</p>

          {/* 탭을 바꿀 때마다 아이콘이 하나씩 차례로 들어온다 */}
          <motion.ul
            variants={staggerParent(0.05, 0.1)}
            initial="hidden"
            animate="show"
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {active.skills.map((s) => {
              const Icon = s.icon;
              // 브랜드 색이 검정에 가까운 로고(Next.js)는 다크에서 반전한다.
              const color = isDark && s.darkColor ? s.darkColor : s.color;
              return (
                <motion.li
                  key={s.name}
                  variants={fadeUp}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/40 hover:bg-surface-raised"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${color}1a`, color }}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-content">
                      {s.name}
                    </span>
                    <span className="block text-xs text-content-subtle">
                      {SKILL_LEVEL_LABEL[s.level]}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
