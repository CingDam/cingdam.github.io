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
    <Section id="projects" eyebrow="Project" title="프로젝트">
      {/* 카드가 한 덩어리로 나타나지 않고 하나씩 차례로 올라온다 */}
      <motion.div
        variants={staggerParent(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="grid gap-5 sm:grid-cols-2"
      >
        {projects.map((p) => (
          <ProjectCard
            key={p.repo}
            project={p}
            onOpen={() => setSelected(p)}
            // 대표작은 한 줄을 통째로 쓴다
            className={p.featured ? 'sm:col-span-2' : ''}
          />
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
  className?: string;
}

function ProjectCard({ project, onOpen, className = '' }: CardProps) {
  const { featured } = project;

  return (
    // 바깥 요소는 부모 stagger 를 따라 등장만 담당한다.
    <motion.article
      variants={fadeUp}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent/40 ${className}`}
    >
      {/* hover 는 안쪽에서 따로 처리한다 — 같은 요소에 두면 등장 애니메이션과 충돌한다 */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className={featured ? 'sm:flex sm:items-stretch' : ''}
      >
        {/* 썸네일 — 없으면 이니셜 플레이스홀더 */}
        <div
          className={`relative overflow-hidden bg-surface ${
            featured ? 'aspect-video sm:aspect-auto sm:w-1/2' : 'aspect-video'
          }`}
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
        <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? 'sm:w-1/2' : ''}`}>
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

          <h3 className="mt-2 text-xl font-bold text-content sm:text-2xl">{project.name}</h3>

          {project.tagline && (
            <p
              className={`mt-2 text-sm leading-relaxed text-content-muted ${
                featured ? '' : 'line-clamp-2'
              }`}
            >
              {project.tagline}
            </p>
          )}

          {project.stack.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, featured ? 8 : 4).map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line bg-surface-raised px-2.5 py-1 text-xs text-content-muted"
                >
                  {s}
                </li>
              ))}
              {project.stack.length > (featured ? 8 : 4) && (
                <li className="px-1 py-1 text-xs text-content-subtle">
                  +{project.stack.length - (featured ? 8 : 4)}
                </li>
              )}
            </ul>
          )}

          <div className="mt-5">
            <LanguageBar languages={project.languages} showLabels={featured} max={4} />
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
