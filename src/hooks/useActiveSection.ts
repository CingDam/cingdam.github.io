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

    // 관찰 대상 전체의 최신 교차 상태를 들고 있다가 매번 다시 판정한다.
    // entries 에 담긴 "이번에 바뀐 섹션" 만 보면, 섹션 높이가 줄어든 뒤
    // 어느 섹션도 조건을 만족하지 않는 구간에서 직전 값이 그대로 남는다.
    const ratio = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratio.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });

        // 화면을 가장 많이 차지한 섹션을 활성으로 본다.
        let best = '';
        let bestRatio = 0;
        ids.forEach((id) => {
          const r = ratio.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        });

        // 맨 위(Hero 위쪽)에서는 첫 섹션을 유지한다.
        if (best) setActive(best);
        else if (window.scrollY < 100) setActive(ids[0] ?? '');
      },
      {
        // 고정 헤더에 가려지는 만큼만 위를 깎는다.
        rootMargin: '-72px 0px 0px 0px',
        // 여러 단계를 관찰해야 "가장 많이 보이는 섹션" 을 비교할 수 있다.
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
