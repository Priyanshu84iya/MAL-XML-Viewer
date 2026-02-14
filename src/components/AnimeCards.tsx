import type { AnimeEntry } from '../types';
import { STATUS_BG_CLASSES, STATUS_COLORS } from '../types';
import { displayValue } from '../utils';

interface Props {
  anime: AnimeEntry[];
  onSelect: (entry: AnimeEntry) => void;
  selectedId: string | null;
}

export default function AnimeCards({ anime, onSelect, selectedId }: Props) {
  const getScoreColor = (score: string) => {
    const n = parseInt(score, 10);
    if (n >= 9) return '#39FF14';
    if (n >= 7) return '#FFE500';
    if (n >= 5) return '#FF6B00';
    if (n >= 1) return '#FF003C';
    return '#444';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {anime.map((entry, i) => {
        const isSelected = entry.series_animedb_id === selectedId;
        const statusColor = STATUS_COLORS[entry.my_status] || '#666';
        const progress =
          parseInt(entry.series_episodes, 10) > 0
            ? Math.round(
                (parseInt(entry.my_watched_episodes, 10) /
                  parseInt(entry.series_episodes, 10)) *
                  100,
              )
            : null;

        return (
          <div
            key={entry.series_animedb_id + '-' + i}
            onClick={() => onSelect(entry)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSelect(entry);
            }}
            role="button"
            tabIndex={0}
            className={`
              relative p-5 border-3 cursor-pointer transition-all duration-200
              hover:translate-x-[-2px] hover:translate-y-[-2px]
              ${isSelected
                ? 'border-[#FFE500] bg-[#FFE500]/10'
                : 'border-[#333] bg-[#111] hover:border-[#FFE500]'
              }
            `}
            style={{
              boxShadow: isSelected
                ? `6px 6px 0px ${statusColor}`
                : '4px 4px 0px #222',
            }}
          >
            {/* Status bar */}
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: statusColor }}
            />

            {/* Score badge */}
            <div
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center font-extrabold text-lg border-2"
              style={{
                color: getScoreColor(entry.my_score),
                borderColor: getScoreColor(entry.my_score),
              }}
            >
              {entry.my_score === '0' ? '--' : entry.my_score}
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-sm pr-12 mb-3 leading-tight line-clamp-2">
              {displayValue(entry.series_title)}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-[#666] tracking-wider">
                {displayValue(entry.series_type)}
              </span>
              <span className="text-[#333]">•</span>
              <span className="text-[10px] text-[#666] tracking-wider">
                EP {displayValue(entry.my_watched_episodes)}/{displayValue(entry.series_episodes)}
              </span>
            </div>

            {/* Status badge */}
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 text-[9px] font-extrabold tracking-widest ${
                  STATUS_BG_CLASSES[entry.my_status] || 'bg-[#333] text-white'
                }`}
              >
                {entry.my_status.toUpperCase()}
              </span>

              {/* Progress */}
              {progress !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#222] border border-[#333]">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor:
                          progress >= 100 ? '#39FF14' : progress >= 50 ? '#FFE500' : '#FF003C',
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-[#555]">{progress}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
