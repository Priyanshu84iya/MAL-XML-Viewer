import type { MyInfo } from '../types';

interface Props {
  myinfo: MyInfo;
  onReset: () => void;
}

export default function DashboardHeader({ myinfo, onReset }: Props) {
  const stats = [
    { label: 'TOTAL', value: myinfo.user_total_anime, color: '#FFE500' },
    { label: 'WATCHING', value: myinfo.user_total_watching, color: '#FFE500' },
    { label: 'COMPLETED', value: myinfo.user_total_completed, color: '#39FF14' },
    { label: 'ON HOLD', value: myinfo.user_total_onhold, color: '#FF6B00' },
    { label: 'DROPPED', value: myinfo.user_total_dropped, color: '#FF003C' },
    { label: 'PLAN', value: myinfo.user_total_plantowatch, color: '#FFFFFF' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b-4 border-[#FFE500]">
      {/* Marquee bar */}
      <div className="bg-[#FFE500] text-black overflow-hidden h-7 flex items-center">
        <div className="animate-marquee whitespace-nowrap flex gap-8 text-xs font-bold tracking-widest">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <span key={i}>
                ★ MAL XML VIEWER ★ BRUTAL EDITION ★ {myinfo.user_name.toUpperCase()} ★ ANIME DATABASE ★ 
              </span>
            ))}
        </div>
      </div>

      <div className="px-4 md:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: User info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFE500] flex items-center justify-center text-black font-extrabold text-xl border-3 border-white">
              {myinfo.user_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                {myinfo.user_name.toUpperCase()}
                <span className="text-[#FFE500]">::</span>
                <span className="text-[#666]">ANIMELIST</span>
              </h1>
              <p className="text-[10px] text-[#555] tracking-widest">
                ID:{myinfo.user_id} // EXPORT_TYPE:{myinfo.user_export_type}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="flex flex-wrap gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-3 py-2 border-2 border-[#333] hover:border-[#FFE500] transition-colors"
              >
                <span className="text-[10px] text-[#666] tracking-widest">{s.label}</span>
                <span className="text-lg font-extrabold" style={{ color: s.color }}>
                  {s.value || '--'}
                </span>
              </div>
            ))}
          </div>

          {/* Reset btn */}
          <button
            onClick={onReset}
            className="px-4 py-2 bg-[#FF003C] text-white font-bold text-xs tracking-widest border-3 border-white hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            ✕ RESET
          </button>
        </div>
      </div>
    </header>
  );
}
