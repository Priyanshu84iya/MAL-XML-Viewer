import type { AnimeEntry } from '../types';
import { displayValue, STATUS_BG_CLASSES, STATUS_COLORS } from '../types';

interface Props {
  entry: AnimeEntry;
  onClose: () => void;
}

export default function DetailPanel({ entry, onClose }: Props) {
  const statusColor = STATUS_COLORS[entry.my_status] || '#666';

  const fields: { label: string; value: string; highlight?: boolean }[] = [
    { label: 'ANIME DB ID', value: entry.series_animedb_id },
    { label: 'TITLE', value: entry.series_title, highlight: true },
    { label: 'TYPE', value: entry.series_type },
    { label: 'TOTAL EPISODES', value: entry.series_episodes },
    { label: 'WATCHED EPISODES', value: entry.my_watched_episodes, highlight: true },
    { label: 'MY SCORE', value: entry.my_score === '0' ? '--' : entry.my_score, highlight: true },
    { label: 'STATUS', value: entry.my_status },
    { label: 'START DATE', value: entry.my_start_date },
    { label: 'FINISH DATE', value: entry.my_finish_date },
    { label: 'PRIORITY', value: entry.my_priority },
    { label: 'TAGS', value: entry.my_tags },
    { label: 'TIMES WATCHED', value: entry.my_times_watched },
    { label: 'REWATCH VALUE', value: entry.my_rewatch_value },
    { label: 'REWATCHING', value: entry.my_rewatching },
    { label: 'REWATCHING EP', value: entry.my_rewatching_ep },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close panel"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-[#0A0A0A] border-l-4 slide-in-right overflow-y-auto"
        style={{ borderLeftColor: statusColor }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-[#FF003C] text-white font-extrabold text-lg flex items-center justify-center border-2 border-white hover:bg-white hover:text-black transition-all z-10 cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b-3 border-[#333]">
          {/* Status */}
          <span
            className={`px-3 py-1 text-[10px] font-extrabold tracking-widest inline-block mb-4 ${
              STATUS_BG_CLASSES[entry.my_status] || 'bg-[#333] text-white'
            }`}
          >
            {entry.my_status.toUpperCase()}
          </span>

          <h2 className="text-2xl font-extrabold tracking-tight leading-tight pr-12 mb-2">
            {displayValue(entry.series_title)}
          </h2>

          <div className="flex items-center gap-3 text-xs text-[#666]">
            <span>{displayValue(entry.series_type)}</span>
            <span className="text-[#333]">|</span>
            <span>ID: {displayValue(entry.series_animedb_id)}</span>
          </div>
        </div>

        {/* Score display */}
        <div className="p-6 border-b-3 border-[#333] flex items-center gap-6">
          <div className="text-center">
            <div
              className="text-5xl font-extrabold mb-1"
              style={{
                color:
                  parseInt(entry.my_score) >= 9
                    ? '#39FF14'
                    : parseInt(entry.my_score) >= 7
                      ? '#FFE500'
                      : parseInt(entry.my_score) >= 5
                        ? '#FF6B00'
                        : parseInt(entry.my_score) >= 1
                          ? '#FF003C'
                          : '#444',
              }}
            >
              {entry.my_score === '0' ? '--' : entry.my_score}
            </div>
            <div className="text-[10px] text-[#555] tracking-widest">MY SCORE</div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between text-xs text-[#666] mb-1">
              <span>PROGRESS</span>
              <span>
                {displayValue(entry.my_watched_episodes)} / {displayValue(entry.series_episodes)} EP
              </span>
            </div>
            <div className="h-3 bg-[#222] border-2 border-[#333]">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${
                    parseInt(entry.series_episodes) > 0
                      ? Math.min(
                          (parseInt(entry.my_watched_episodes) / parseInt(entry.series_episodes)) *
                            100,
                          100,
                        )
                      : 0
                  }%`,
                  backgroundColor: statusColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Field list */}
        <div className="p-6">
          <h3 className="text-xs font-extrabold text-[#FFE500] tracking-widest mb-4">
            ALL FIELDS
          </h3>
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.label} className="flex justify-between items-start gap-4 py-2 border-b border-[#1A1A1A]">
                <span className="text-[10px] text-[#555] tracking-widest shrink-0">{f.label}</span>
                <span
                  className={`text-right text-sm ${
                    f.highlight ? 'font-bold text-white' : 'text-[#999]'
                  }`}
                >
                  {displayValue(f.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MAL Link */}
        <div className="p-6 border-t-3 border-[#333]">
          <a
            href={`https://myanimelist.net/anime/${entry.series_animedb_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 bg-[#FFE500] text-black font-extrabold text-xs tracking-widest border-3 border-white hover:bg-white transition-all brutal-shadow"
          >
            VIEW ON MAL →
          </a>
        </div>
      </div>
    </>
  );
}
