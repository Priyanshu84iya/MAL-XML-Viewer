import { useCallback, useRef, useEffect } from 'react';
import type { AnimeEntry } from '../types';
import { displayValue, STATUS_BG_CLASSES } from '../types';

interface Props {
  anime: AnimeEntry[];
  onSelect: (entry: AnimeEntry) => void;
  selectedId: string | null;
}

export default function AnimeTable({ anime, onSelect, selectedId }: Props) {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const selectedIndexRef = useRef<number>(-1);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!anime.length) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, anime.length - 1);
        onSelect(anime[selectedIndexRef.current]);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
        onSelect(anime[selectedIndexRef.current]);
      } else if (e.key === 'Escape') {
        selectedIndexRef.current = -1;
      }
    },
    [anime, onSelect],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (selectedId && tbodyRef.current) {
      const row = tbodyRef.current.querySelector(`[data-id="${selectedId}"]`);
      row?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  const getScoreColor = (score: string) => {
    const n = parseInt(score, 10);
    if (n >= 9) return '#39FF14';
    if (n >= 7) return '#FFE500';
    if (n >= 5) return '#FF6B00';
    if (n >= 1) return '#FF003C';
    return '#444';
  };

  return (
    <div className="overflow-x-auto border-3 border-[#333]">
      <table className="brutal-table w-full min-w-[900px]">
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th className="text-left">TITLE</th>
            <th>TYPE</th>
            <th>EPISODES</th>
            <th>SCORE</th>
            <th>STATUS</th>
            <th>PROGRESS</th>
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {anime.map((entry, i) => {
            const isSelected = entry.series_animedb_id === selectedId;
            const progress =
              parseInt(entry.series_episodes, 10) > 0
                ? Math.round(
                    (parseInt(entry.my_watched_episodes, 10) /
                      parseInt(entry.series_episodes, 10)) *
                      100,
                  )
                : null;

            return (
              <tr
                key={entry.series_animedb_id + '-' + i}
                data-id={entry.series_animedb_id}
                onClick={() => {
                  selectedIndexRef.current = i;
                  onSelect(entry);
                }}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FFE500]/15 border-l-4 border-l-[#FFE500]'
                    : ''
                }`}
              >
                <td className="text-center text-[#555] text-xs">{i + 1}</td>
                <td className="text-left font-bold text-sm max-w-[300px] truncate">
                  {displayValue(entry.series_title)}
                </td>
                <td className="text-center text-xs text-[#888]">
                  {displayValue(entry.series_type)}
                </td>
                <td className="text-center text-xs">
                  <span className="text-[#FFE500]">{displayValue(entry.my_watched_episodes)}</span>
                  <span className="text-[#444]">/</span>
                  <span className="text-[#666]">{displayValue(entry.series_episodes)}</span>
                </td>
                <td className="text-center">
                  <span
                    className="font-extrabold text-lg"
                    style={{ color: getScoreColor(entry.my_score) }}
                  >
                    {entry.my_score === '0' ? '--' : entry.my_score}
                  </span>
                </td>
                <td className="text-center">
                  <span
                    className={`px-2 py-1 text-[10px] font-extrabold tracking-wider inline-block ${
                      STATUS_BG_CLASSES[entry.my_status] || 'bg-[#333] text-white'
                    }`}
                  >
                    {entry.my_status.toUpperCase()}
                  </span>
                </td>
                <td className="text-center w-32">
                  {progress !== null ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#222] border border-[#333]">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor:
                              progress >= 100 ? '#39FF14' : progress >= 50 ? '#FFE500' : '#FF003C',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[#555] w-8">{progress}%</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#333]">--</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
