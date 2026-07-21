import { useCallback, useRef, useState, useEffect } from 'react';
import type { MALData } from '../types';
import { parseMALXml } from '../utils';

interface Props {
  onDataLoaded: (data: MALData) => void;
}

export default function FileUpload({ onDataLoaded }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.xml')) {
        setError('ERROR: ONLY .XML FILES ACCEPTED');
        return;
      }
      setError(null);
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = parseMALXml(text);
          onDataLoaded(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'PARSE FAILED');
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('FILE READ ERROR');
        setIsLoading(false);
      };
      reader.readAsText(file);
    },
    [onDataLoaded],
  );

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown < 0) {
      window.open('https://myanimelist.net/panel.php?go=export', '_blank');
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleMalExport = useCallback(() => {
    setCountdown(3);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 noise-bg scanlines">
      {/* MyAnimeList XML Button */}
      <button
        onClick={handleMalExport}
        className="fixed top-4 right-4 px-4 py-2 bg-[#FFE500] text-black font-bold text-sm tracking-widest hover:bg-[#FFD700] transition-all border-2 border-[#FFE500] cursor-pointer"
        disabled={countdown !== null}
      >
        {countdown !== null ? `OPENING... ${countdown}` : 'MyAnimeList XML'}
      </button>

      {/* Giant heading */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter glitch-text mb-4">
          MAL<span className="text-[#FFE500]">::</span>XML
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-[#FFE500] uppercase">
          VIEWER // BRUTAL
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#555] uppercase tracking-widest">
          <span className="w-8 h-[2px] bg-[#333]"></span>
          ANIME LIST ANALYZER
          <span className="w-8 h-[2px] bg-[#333]"></span>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        className={`
          relative cursor-pointer w-full max-w-2xl p-12 text-center
          border-4 border-dashed transition-all duration-200
          ${isDragging
            ? 'border-[#FFE500] bg-[#FFE500]/10 scale-[1.02]'
            : 'border-[#333] hover:border-[#FFE500] hover:bg-[#FFE500]/5'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xml"
          onChange={handleChange}
          className="hidden"
          aria-label="Upload XML file"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FFE500] border-t-transparent animate-spin" />
            <p className="text-lg font-bold tracking-wider">PARSING...</p>
          </div>
        ) : (
          <>
            <div className="text-6xl mb-6">📂</div>
            <p className="text-xl font-bold tracking-wider mb-2">
              DROP YOUR <span className="text-[#FFE500]">.XML</span> FILE HERE
            </p>
            <p className="text-sm text-[#666] tracking-wide">
              OR CLICK TO BROWSE // MAL EXPORT ONLY
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-6 px-6 py-3 bg-[#FF003C] text-white font-bold text-sm tracking-wider brutal-border slide-in-up border-white">
          ⚠ {error}
        </div>
      )}

      {/* Footer hint */}
      <div className="mt-12 text-xs text-[#444] tracking-widest uppercase text-center max-w-md">
        <p>GO TO MYANIMELIST.NET → EXPORT → DOWNLOAD XML</p>
        <p className="mt-1">THEN DROP IT HERE. THAT'S IT.</p>
      </div>

      {/* Version */}
      <div className="fixed bottom-4 right-4 text-[10px] text-[#333] tracking-widest">
        v1.0.0 // BRUTAL
      </div>
    </div>
  );
}
