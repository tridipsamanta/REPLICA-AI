import { useEffect, useState } from 'react';
import { Mic, ShieldAlert } from 'lucide-react';

export default function LiveAnalysisVisualizer({
  active,
  hasFakeDetection = false,
}: {
  active: boolean;
  hasFakeDetection?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = ['LISTENING', 'ANALYZING', 'VERIFYING'];

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (active) {
      setVisible(true);
      setStatusIndex(0);
    } else {
      t = setTimeout(() => setVisible(false), 500);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [active]);

  if (!visible) return null;

  const orbTheme = hasFakeDetection
    ? {
        core: 'bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500',
        glow: 'shadow-[0_0_60px_15px_rgba(239,68,68,0.4)]',
        ring1: 'border-rose-500/40 bg-rose-500/5',
        ring2: 'border-amber-500/30 bg-amber-500/5',
        text: 'text-rose-500',
        wave: 'bg-rose-500',
      }
    : {
        core: 'bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400',
        glow: 'shadow-[0_0_60px_15px_rgba(99,102,241,0.4)]',
        ring1: 'border-indigo-500/40 bg-indigo-500/5',
        ring2: 'border-cyan-500/30 bg-cyan-500/5',
        text: 'text-emerald-500 dark:text-emerald-400',
        wave: 'bg-emerald-500',
      };

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between py-6 px-4 transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Top Banner Status */}
      <div className="flex flex-col items-center mt-2 opacity-90 drop-shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-card)]/80 border border-[var(--border-app)] backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full animate-ping ${hasFakeDetection ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <h2 className={`text-xs sm:text-sm font-extrabold tracking-[0.25em] font-mono ${orbTheme.text}`}>
            {statuses[statusIndex]}
          </h2>
        </div>
      </div>

      {/* Siri-Style Central Interactive Orb Visualization */}
      <div className="relative my-auto flex items-center justify-center pointer-events-none">

        {/* Outer Pulsing Concentric Aura Ring 2 */}
        <div
          className={`absolute w-72 h-72 rounded-full border ${orbTheme.ring2} animate-siri-ring-2`}
        />

        {/* Inner Pulsing Concentric Aura Ring 1 */}
        <div
          className={`absolute w-56 h-56 rounded-full border ${orbTheme.ring1} animate-siri-ring-1`}
        />

        {/* Core Siri Glowing Spherical Orb */}
        <div
          className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full ${orbTheme.core} ${orbTheme.glow} animate-siri-orb flex items-center justify-center transition-all duration-500`}
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            {hasFakeDetection ? (
              <ShieldAlert className="w-12 h-12 text-white animate-pulse" />
            ) : (
              <Mic className="w-12 h-12 text-white/90 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Waveform Audio Energy Stream */}
      <div className="mb-2 flex flex-col items-center w-full">
        <div className="flex items-end justify-center gap-1.5 h-10 opacity-90 mb-2">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full animate-wave-bar ${orbTheme.wave}`}
              style={{ animationDelay: `${(i % 9) * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
