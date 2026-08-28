import { useEffect, useState } from 'react';

export default function ForensicAnalysisOverlay({
  active,
  variant = 'detect',
}: {
  active: boolean
  variant?: 'detect' | 'live'
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (active) {
      setVisible(true);
    } else {
      t = setTimeout(() => setVisible(false), 500);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [active]);

  if (!visible) return null;

  const isLive = variant === 'live';
  const beamColor = isLive
    ? 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
    : 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent';
  const shadowGlow = isLive
    ? 'shadow-[0_0_20px_4px_rgba(16,185,129,0.5)]'
    : 'shadow-[0_0_25px_5px_rgba(99,102,241,0.6)]';
  const trailGlow = isLive
    ? 'from-emerald-500/25 to-transparent'
    : 'from-indigo-500/25 to-transparent';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-10 pointer-events-none rounded-[inherit] overflow-hidden transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Dim & Backdrop Blur */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-[2px] transition-colors duration-300" />

      {/* Cybernetic Ambient Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Radial Ambient Edge Glow */}
      <div
        className={`absolute inset-0 animate-pulse transition-all duration-700 ${
          isLive
            ? 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_75%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,transparent_75%)]'
        }`}
      />

      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] dark:opacity-[0.03] pointer-events-none">
        <img
          src="/replica-logo.png"
          alt=""
          className="w-72 h-72 object-contain filter brightness-150 saturate-50 animate-pulse"
        />
      </div>

      {/* Animated Scan Line & Trail */}
      <div
        className={`absolute left-0 right-0 h-[2.5px] ${beamColor} ${shadowGlow} animate-forensic-scan`}
      />
      <div
        className={`absolute left-0 right-0 h-32 bg-gradient-to-b ${trailGlow} animate-forensic-scan`}
        style={{ transform: 'translateY(-100%)' }}
      />
    </div>
  );
}
