import { useEffect, useState } from 'react';

/**
 * 현재 화면에 보이는 섹션 id 를 돌려준다.
 *
 * 구버전은 `scrollTop >= 825` 매직넘버로 헤더 색만 바꿨고, 어떤 섹션에
 * 있는지는 알 수 없었다. IntersectionObserver 로 교체한다.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 걸친 섹션 중 가장 위에 있는 것을 고른다.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        // 헤더 높이만큼 위를 깎고, 화면 중앙 위쪽에 걸릴 때 활성으로 본다.
        rootMargin: '-72px 0px -55% 0px',
        threshold: 0,
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
