import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** 'system' 이면 OS 설정을 따라간다 */
export type ThemeSetting = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';

interface ThemeContextValue {
  /** 사용자가 고른 값 (system 포함) */
  setting: ThemeSetting;
  /** 실제로 적용된 값 */
  resolved: ResolvedTheme;
  setSetting: (t: ThemeSetting) => void;
  /** light → dark → system 순환 */
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): ThemeSetting {
  if (typeof localStorage === 'undefined') return 'system';
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

function systemPrefers(): ResolvedTheme {
  if (typeof matchMedia === 'undefined') return 'light';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [setting, setSettingState] = useState<ThemeSetting>(readStored);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(systemPrefers);

  // OS 설정이 바뀌면 즉시 따라간다 (setting 이 'system' 일 때만 의미가 있다)
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: ResolvedTheme = setting === 'system' ? systemTheme : setting;

  // html 클래스 동기화 — Tailwind 의 dark: 변형이 이걸 본다
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);

  const setSetting = useCallback((t: ThemeSetting) => {
    setSettingState(t);
    if (t === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, t);
  }, []);

  const cycle = useCallback(() => {
    // system 에서 첫 클릭은 "지금 보이는 것의 반대"로 간다.
    // (OS 가 라이트인데 light 로 가버리면 아무 변화가 없어 고장처럼 보인다.)
    if (setting === 'system') {
      setSetting(resolved === 'dark' ? 'light' : 'dark');
      return;
    }
    // 명시 선택 상태에서는 반대편을 거쳐 system 으로 돌아온다.
    setSetting(setting === 'dark' ? 'light' : 'system');
  }, [setting, resolved, setSetting]);

  const value = useMemo(
    () => ({ setting, resolved, setSetting, cycle }),
    [setting, resolved, setSetting, cycle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 은 ThemeProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
