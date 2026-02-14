import type { AnimeEntry } from '../types';
import { computeStats } from '../utils';

interface Props {
  anime: AnimeEntry[];
}

export default function StatsSection({ anime }: Props) {
  const stats = computeStats(anime);

  // Score distribution
  const scoreDist: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) scoreDist[i] = 0;
  anime.forEach((a) => {
    const s = parseInt(a.my_score, 10);
    if (s >= 1 && s <= 10) scoreDist[s]++;
  });
  const maxScoreCount = Math.max(...Object.values(scoreDist), 1);

  // Status distribution
  const statusDist: Record<string, number> = {};
  anime.forEach((a) => {
    statusDist[a.my_status] = (statusDist[a.my_status] || 0) + 1;
  });

  // Type distribution
  const typeDist: Record<string, number> = {};
  anime.forEach((a) => {
    const t = a.series_type || 'Unknown';
    typeDist[t] = (typeDist[t] || 0) + 1;
  });

  const statusColors: Record<string, string> = {
    Completed: '#39FF14',
    Watching: '#FFE500',
    Dropped: '#FF003C',
    'On-Hold': '#FF6B00',
    'Plan to Watch': '#FFFFFF',
  };

  const estimatedHours = Math.round((stats.totalEpisodes * 24) / 60);

  return (
    <div className="border-3 border-[#333] bg-[#111] p-6 slide-in-up">
      <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-3">
        <span className="text-[#FFE500]">■</span>
        STATISTICS
        <span className="text-[10px] text-[#444] tracking-widest font-normal ml-auto">
          AUTO-GENERATED
        </span>
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="AVG SCORE" value={stats.averageScore.toFixed(2)} color="#FFE500" />
        <StatCard label="COMPLETED" value={stats.totalCompleted.toString()} color="#39FF14" />
        <StatCard label="TOTAL EP" value={stats.totalEpisodes.toLocaleString()} color="#FF6B00" />
        <StatCard label="≈ HOURS" value={estimatedHours.toLocaleString()} color="#FF003C" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score distribution */}
        <div className="border-2 border-[#222] p-4">
          <h3 className="text-xs font-extrabold text-[#FFE500] tracking-widest mb-4">
            SCORE DISTRIBUTION
          </h3>
          <div className="space-y-2">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => (
              <div key={score} className="flex items-center gap-2">
                <span className="text-[10px] text-[#666] w-4 text-right">{score}</span>
                <div className="flex-1 h-4 bg-[#1A1A1A] relative overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(scoreDist[score] / maxScoreCount) * 100}%`,
                      backgroundColor:
                        score >= 9
                          ? '#39FF14'
                          : score >= 7
                            ? '#FFE500'
                            : score >= 5
                              ? '#FF6B00'
                              : '#FF003C',
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#555] w-6 text-right">
                  {scoreDist[score]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="border-2 border-[#222] p-4">
          <h3 className="text-xs font-extrabold text-[#FFE500] tracking-widest mb-4">
            STATUS BREAKDOWN
          </h3>
          <div className="space-y-3">
            {Object.entries(statusDist)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3"
                      style={{ backgroundColor: statusColors[status] || '#666' }}
                    />
                    <span className="text-xs font-bold tracking-wider">{status.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-lg font-extrabold"
                      style={{ color: statusColors[status] || '#666' }}
                    >
                      {count}
                    </span>
                    <span className="text-[10px] text-[#444]">
                      ({Math.round((count / anime.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Type breakdown */}
        <div className="border-2 border-[#222] p-4">
          <h3 className="text-xs font-extrabold text-[#FFE500] tracking-widest mb-4">
            TYPE BREAKDOWN
          </h3>
          <div className="space-y-3">
            {Object.entries(typeDist)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => {
                const pct = Math.round((count / anime.length) * 100);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold tracking-wider">{type.toUpperCase()}</span>
                      <span className="text-xs text-[#666]">
                        {count} <span className="text-[#444]">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-[#1A1A1A]">
                      <div
                        className="h-full bg-[#FFE500] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border-2 border-[#222] p-4 hover:border-[#FFE500] transition-colors brutal-hover">
      <div className="text-[10px] text-[#555] tracking-widest mb-2">{label}</div>
      <div className="text-3xl font-extrabold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
