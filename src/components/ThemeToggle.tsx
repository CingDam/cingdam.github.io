import { HiSun, HiMoon, HiComputerDesktop } from 'react-icons/hi2';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { setting, resolved, cycle } = useTheme();

  const Icon = setting === 'light' ? HiSun : setting === 'dark' ? HiMoon : HiComputerDesktop;

  // useTheme.cycle 의 순서와 일치시킨다.
  const label =
    setting === 'system'
      ? `시스템 설정 따름 (클릭하면 ${resolved === 'dark' ? '라이트' : '다크'}로)`
      : setting === 'dark'
        ? '다크 모드 (클릭하면 라이트로)'
        : '라이트 모드 (클릭하면 시스템 설정으로)';

  return (
    <button
      type="button"
      onClick={cycle}
      title={label}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-content-muted transition-colors hover:border-accent/50 hover:text-content"
    >
      <Icon size={17} />
    </button>
  );
}
