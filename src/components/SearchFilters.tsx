import type { ViewMode, StatusFilter, ScoreFilter, TypeFilter } from '../types';

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (val: StatusFilter) => void;
  scoreFilter: ScoreFilter;
  onScoreFilterChange: (val: ScoreFilter) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (val: TypeFilter) => void;
  resultCount: number;
  totalCount: number;
}

const STATUS_OPTIONS: StatusFilter[] = ['All', 'Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'];
const SCORE_OPTIONS: ScoreFilter[] = ['All', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const TYPE_OPTIONS: TypeFilter[] = ['All', 'TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music'];

export default function SearchFilters({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  scoreFilter,
  onScoreFilterChange,
  typeFilter,
  onTypeFilterChange,
  resultCount,
  totalCount,
}: Props) {
  return (
    <div className="border-3 border-[#333] p-4 md:p-6 bg-[#111] slide-in-up">
      {/* Search row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFE500] text-lg">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH ANIME TITLE..."
            className="w-full bg-black border-3 border-[#333] text-white font-bold text-sm tracking-wider pl-10 pr-4 py-3 placeholder:text-[#444] focus:border-[#FFE500] focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#FFE500] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex border-3 border-[#333]">
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-4 py-2 font-bold text-xs tracking-widest transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#FFE500] text-black'
                : 'bg-black text-[#666] hover:text-white'
            }`}
          >
            ⊞ TABLE
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`px-4 py-2 font-bold text-xs tracking-widest transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-[#FFE500] text-black'
                : 'bg-black text-[#666] hover:text-white'
            }`}
          >
            ⊟ CARDS
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <span className="text-[10px] text-[#555] tracking-widest font-bold">FILTERS:</span>

        <div className="flex flex-wrap gap-2">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className="bg-black border-2 border-[#333] text-white text-xs font-bold tracking-wider px-3 py-2 focus:border-[#FFE500] focus:outline-none cursor-pointer appearance-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                STATUS: {s.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Score */}
          <select
            value={scoreFilter}
            onChange={(e) => onScoreFilterChange(e.target.value as ScoreFilter)}
            className="bg-black border-2 border-[#333] text-white text-xs font-bold tracking-wider px-3 py-2 focus:border-[#FFE500] focus:outline-none cursor-pointer appearance-none"
          >
            {SCORE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                SCORE: {s === 'All' ? 'ALL' : `★${s}`}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as TypeFilter)}
            className="bg-black border-2 border-[#333] text-white text-xs font-bold tracking-wider px-3 py-2 focus:border-[#FFE500] focus:outline-none cursor-pointer appearance-none"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                TYPE: {t.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <div className="ml-auto text-xs text-[#555] tracking-wider font-bold">
          <span className="text-[#FFE500]">{resultCount}</span>
          <span className="text-[#333]">/</span>
          {totalCount} RESULTS
        </div>
      </div>
    </div>
  );
}
