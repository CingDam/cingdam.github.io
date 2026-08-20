import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiStar } from 'react-icons/hi2';
import { Section, staggerParent, fadeUp, VIEWPORT } from './Section';
import { ProjectModal } from './ProjectModal';
import { LanguageBar } from './LanguageBar';
import { formatMonth } from '../lib/format';
import type { Project } from '../types/project';
import projectsJson from '../data/generated/projects.json';

// 빌드 시점에 생성된 JSON (npm run sync:projects)
const projects = projectsJson as Project[];

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <Section id="projects" eyebrow="Project" title="프로젝트" tone="surface">
      {/* 카드가 한 덩어리로 나타나지 않고 하나씩 차례로 올라온다 */}
      <motion.div
        variants={staggerParent(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        /* 가로 4칸 한 줄. 예전에는 대표작이 `sm:col-span-2` 로 한 줄을 통째로 써서
           세로로 길게 쌓였고(1593px), 한 화면에 안 들어와 스냅에서 빼야 했다.
           폭을 균등하게 나누면 한 화면에 들어와 Projects 도 스냅 대상이 된다. */
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
      >
        {projects.map((p) => (
          <ProjectCard key={p.repo} project={p} onOpen={() => setSelected(p)} />
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </Section>
  );
}

interface CardProps {
  project: Project;
  onOpen: () => void;
}

function ProjectCard({ project, onOpen }: CardProps) {
  const { featured } = project;

  return (
    // 바깥 요소는 부모 stagger 를 따라 등장만 담당한다.
    <motion.article
      variants={fadeUp}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-colors hover:border-accent/40"
    >
      {/* hover 는 안쪽에서 따로 처리한다 — 같은 요소에 두면 등장 애니메이션과 충돌한다 */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="flex h-full flex-col"
      >
        {/* 썸네일 — 없으면 이니셜 플레이스홀더 */}
        <div
          className="relative aspect-video overflow-hidden bg-card"
        >
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={`${project.name} 미리보기`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-40 w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--glow-from),var(--glow-to))]">
              {/* 라이트에서도 읽히도록 흰색 대신 본문 색을 옅게 쓴다 */}
              <span className="text-3xl font-black tracking-tight text-content/20 sm:text-5xl">
                {project.name}
              </span>
            </div>
          )}

          {featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-on-accent">
              <HiStar size={13} /> 대표 프로젝트
            </span>
          )}
        </div>

        {/* 본문 */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-content-subtle">
            <span>{formatMonth(project.pushedAt)}</span>
            {project.kind && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.kind}</span>
              </>
            )}
            {project.stars > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5">
                  <HiStar size={12} /> {project.stars}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-2 text-lg font-bold text-content xl:text-xl">{project.name}</h3>

          {project.tagline && (
            <p
              className="mt-2 line-clamp-2 text-sm leading-relaxed text-content-muted"
            >
              {project.tagline}
            </p>
          )}

          {project.stack.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 3).map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line bg-surface-raised px-2.5 py-1 text-xs text-content-muted"
                >
                  {s}
                </li>
              ))}
              {project.stack.length > 3 && (
                <li className="px-1 py-1 text-xs text-content-subtle">
                  +{project.stack.length - 3}
                </li>
              )}
            </ul>
          )}

          <div className="mt-5">
            {/* 카드 폭이 균등해졌으니 라벨도 균등하게 — `showLabels={featured}` 였을 때
                대표작만 라벨이 붙어 카드 아랫단이 들쭉날쭉했다 */}
            <LanguageBar languages={project.languages} showLabels max={3} />
          </div>

          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              {/* 카드 전체를 누를 수 있게 링크 영역을 확장한다 */}
              <span className="absolute inset-0" aria-hidden="true" />
              <span className="relative">자세히 보기</span>
              <HiArrowRight
                size={15}
                className="relative transition-transform group-hover:translate-x-1"
              />
              <span className="sr-only">— {project.name}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
