import type { LanguageSlice } from '../types/project';
import { languageColor } from '../lib/format';

interface Props {
  languages: LanguageSlice[];
  /** 이름표까지 보여줄지 */
  showLabels?: boolean;
  max?: number;
}

/** GitHub 언어 구성비 막대 */
export function LanguageBar({ languages, showLabels = true, max = 4 }: Props) {
  if (!languages.length) return null;
  const top = languages.slice(0, max);

  return (
    <div>
      <div
        className="flex h-1.5 w-full overflow-hidden rounded-full bg-line"
        role="img"
        aria-label={`언어 구성: ${top.map((l) => `${l.name} ${l.percent}%`).join(', ')}`}
      >
        {top.map((l) => (
          <span
            key={l.name}
            style={{ width: `${l.percent}%`, backgroundColor: languageColor(l.name) }}
            className="h-full"
          />
        ))}
      </div>

      {showLabels && (
        <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
          {top.map((l) => (
            <li key={l.name} className="flex items-center gap-1.5 text-xs text-content-subtle">
              <span
                aria-hidden="true"
                style={{ backgroundColor: languageColor(l.name) }}
                className="h-2 w-2 rounded-full"
              />
              {l.name}
              <span className="text-content-subtle">{l.percent}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
