import { useState, useMemo, useCallback, useEffect } from 'react';
import type { MALData, AnimeEntry, ViewMode, StatusFilter, ScoreFilter, TypeFilter } from './types';
import { exportToJson } from './utils';
import FileUpload from './components/FileUpload';
import DashboardHeader from './components/DashboardHeader';
import SearchFilters from './components/SearchFilters';
import AnimeTable from './components/AnimeTable';
import AnimeCards from './components/AnimeCards';
import DetailPanel from './components/DetailPanel';
import StatsSection from './components/StatsSection';
import RawXmlViewer from './components/RawXmlViewer';
import Toolbar from './components/Toolbar';

// How many items to render per batch (virtualization-lite)
const PAGE_SIZE = 50;

export default function App() {
  const [data, setData] = useState<MALData | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [selectedAnime, setSelectedAnime] = useState<AnimeEntry | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showRawXml, setShowRawXml] = useState(false);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // Filter + search
  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.anime;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.series_title.toLowerCase().includes(q));
    }

    // Status
    if (statusFilter !== 'All') {
      list = list.filter((a) => a.my_status === statusFilter);
    }

    // Score
    if (scoreFilter !== 'All') {
      list = list.filter((a) => a.my_score === scoreFilter);
    }

    // Type
    if (typeFilter !== 'All') {
      list = list.filter((a) => a.series_type === typeFilter);
    }

    return list;
  }, [data, search, statusFilter, scoreFilter, typeFilter]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [search, statusFilter, scoreFilter, typeFilter]);

  // Visible slice for performance
  const visible = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount]);

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  // Infinite scroll
  useEffect(() => {
    if (!data) return;

    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400;
      if (scrollBottom && displayCount < filtered.length) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, displayCount, filtered.length, loadMore]);

  // Close panel on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedAnime(null);
        setShowRawXml(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Export JSON
  const handleExportJson = useCallback(() => {
    if (!data) return;
    const json = exportToJson(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.myinfo.user_name}_animelist.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Reset
  const handleReset = useCallback(() => {
    setData(null);
    setSearch('');
    setStatusFilter('All');
    setScoreFilter('All');
    setTypeFilter('All');
    setSelectedAnime(null);
    setShowStats(false);
    setShowRawXml(false);
    setDisplayCount(PAGE_SIZE);
  }, []);

  // ── UPLOAD SCREEN ──
  if (!data) {
    return <FileUpload onDataLoaded={setData} />;
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-[#0A0A0A] noise-bg scanlines">
      <DashboardHeader myinfo={data.myinfo} onReset={handleReset} />

      <main className="px-4 md:px-8 py-6 space-y-6 max-w-[1800px] mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#FFE500]">■</span> ANIME DATABASE
          </h2>
          <Toolbar
            onExportJson={handleExportJson}
            onToggleRawXml={() => setShowRawXml(!showRawXml)}
            onToggleStats={() => setShowStats(!showStats)}
            showStats={showStats}
            showRawXml={showRawXml}
          />
        </div>

        {/* Stats */}
        {showStats && <StatsSection anime={data.anime} />}

        {/* Search & Filters */}
        <SearchFilters
          search={search}
          onSearchChange={setSearch}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          scoreFilter={scoreFilter}
          onScoreFilterChange={setScoreFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          resultCount={filtered.length}
          totalCount={data.anime.length}
        />

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border-3 border-[#222]">
            <div className="text-6xl mb-4">∅</div>
            <p className="text-xl font-extrabold text-[#444] tracking-wider">NO RESULTS FOUND</p>
            <p className="text-sm text-[#333] mt-2">TRY DIFFERENT FILTERS</p>
          </div>
        ) : viewMode === 'table' ? (
          <AnimeTable
            anime={visible}
            onSelect={setSelectedAnime}
            selectedId={selectedAnime?.series_animedb_id ?? null}
          />
        ) : (
          <AnimeCards
            anime={visible}
            onSelect={setSelectedAnime}
            selectedId={selectedAnime?.series_animedb_id ?? null}
          />
        )}

        {/* Load more indicator */}
        {displayCount < filtered.length && (
          <div className="text-center py-6">
            <button
              onClick={loadMore}
              className="px-6 py-3 border-3 border-[#FFE500] text-[#FFE500] font-extrabold text-xs tracking-widest hover:bg-[#FFE500] hover:text-black transition-all cursor-pointer"
            >
              LOAD MORE ({filtered.length - displayCount} REMAINING)
            </button>
          </div>
        )}

        {/* Raw XML */}
        <RawXmlViewer
          rawXml={data.rawXml}
          isOpen={showRawXml}
          onToggle={() => setShowRawXml(false)}
        />

        {/* Footer */}
        <footer className="border-t-3 border-[#222] pt-6 pb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-[#333] tracking-widest">
            MAL::XML VIEWER // BRUTAL EDITION // v1.0.0
          </div>
          <div className="text-[10px] text-[#333] tracking-widest">
            {data.anime.length} ENTRIES LOADED // {filtered.length} VISIBLE
          </div>
          <div className="flex gap-2">
            <kbd className="px-2 py-1 bg-[#111] border border-[#333] text-[9px] text-[#555]">
              ↑↓ NAVIGATE
            </kbd>
            <kbd className="px-2 py-1 bg-[#111] border border-[#333] text-[9px] text-[#555]">
              ESC CLOSE
            </kbd>
          </div>
        </footer>
      </main>

      {/* Detail panel */}
      {selectedAnime && (
        <DetailPanel entry={selectedAnime} onClose={() => setSelectedAnime(null)} />
      )}
    </div>
  );
}
