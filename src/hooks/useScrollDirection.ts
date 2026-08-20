import { useEffect, useState } from 'react';

/**
 * 스크롤 방향을 돌려준다 (1 = 아래로, -1 = 위로).
 *
 * 가로 전환 연출에 쓴다. 방향을 모르면 위로 스크롤할 때도 섹션이
 * 왼쪽으로 빠져나가 "되감기" 가 아니라 계속 전진하는 것처럼 보인다.
 */
export function useScrollDirection(): number {
  const [dir, setDir] = useState(1);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        // 스냅 점프는 한 프레임에 900px 씩 뛴다. 작은 흔들림은 방향으로 치지 않는다.
        if (Math.abs(y - last) > 4) {
          setDir(y > last ? 1 : -1);
          last = y;
        }
        raf = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return dir;
}
