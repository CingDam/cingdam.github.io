import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import { HiXMark, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { Project } from '../types/project';
import { LanguageBar } from './LanguageBar';
import { formatMonth } from '../lib/format';

interface Props {
  project: Project;
  onClose: () => void;
}

/**
 * 프로젝트 상세 모달.
 *
 * 구버전 modal.js 는 프로젝트마다 if/else 로 JSX 를 하드코딩했고,
 * 닫기도 바깥 클릭·X 버튼만 됐다. 여기서는 props 로 렌더하고
 * ESC 키와 포커스 트랩을 추가한다.
 */
export function ProjectModal({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // ESC 로 닫기 + 배경 스크롤 잠금 + 포커스 트랩
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // 포커스가 모달 밖으로 새지 않도록 순환시킨다.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [onClose]);

  const titleId = `modal-title-${project.repo}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-scrim p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="no-scrollbar relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border border-line bg-surface shadow-2xl sm:max-h-[88svh] sm:rounded-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 rounded-full bg-canvas/70 p-2 text-content-muted transition-colors hover:bg-canvas hover:text-content"
        >
          <HiXMark size={20} />
        </button>

        {/* 스크린샷 캐러셀 — 없으면 통째로 생략한다 */}
        {project.screenshots.length > 0 && (
          <div className="bg-canvas">
            <Swiper
              modules={[Navigation, Pagination, Keyboard, A11y]}
              navigation
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              loop={project.screenshots.length > 1}
              spaceBetween={0}
              slidesPerView={1}
              className="aspect-video w-full"
            >
              {project.screenshots.map((src) => (
                <SwiperSlide key={src}>
                  <img
                    src={src}
                    alt={`${project.name} 화면`}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 id={titleId} className="text-2xl font-bold text-content sm:text-3xl">
                {project.name}
              </h3>
              {project.tagline && (
                <p className="mt-2 text-sm leading-relaxed text-content-muted sm:text-base">
                  {project.tagline}
                </p>
              )}
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-content transition-colors hover:border-accent/50 hover:bg-surface-raised"
            >
              GitHub <HiArrowTopRightOnSquare size={15} />
            </a>
          </div>

          {/* 메타 정보 */}
          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5 sm:grid-cols-4">
            {project.period && <Meta label="기간" value={project.period} />}
            {project.kind && <Meta label="구분" value={project.kind} />}
            {project.teamSize && <Meta label="인원" value={project.teamSize} />}
            <Meta label="최근 작업" value={formatMonth(project.pushedAt)} />
          </dl>

          {project.role && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-content-subtle">
                맡은 역할
              </h4>
              <p className="mt-2 text-sm leading-7 text-content-muted">{project.role}</p>
            </div>
          )}

          {project.description && project.description !== project.tagline && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-content-subtle">
                설명
              </h4>
              <p className="mt-2 text-sm leading-7 text-content-muted">{project.description}</p>
            </div>
          )}

          {project.features.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-content-subtle">
                주요 기능
              </h4>
              <ul className="mt-3 space-y-3">
                {project.features.map((f) => (
                  <li
                    key={f.title}
                    className="rounded-lg border border-line bg-surface p-4"
                  >
                    <p className="text-sm font-semibold text-content">{f.title}</p>
                    {f.description && (
                      <p className="mt-1.5 text-sm leading-6 text-content-muted">{f.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.stack.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-content-subtle">
                기술 스택
              </h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-line bg-surface-raised px-3 py-1 text-xs text-content-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-content-subtle">
              언어 구성
            </h4>
            <LanguageBar languages={project.languages} max={5} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-content-subtle">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-content">{value}</dd>
    </div>
  );
}
