import { useEffect, useState, Fragment } from 'react';
import { AudioWaveform, Activity, Cpu, BrainCircuit, ShieldCheck } from 'lucide-react';

const PIPELINE_STEPS = [
  { key: 'input', label: 'INPUT', icon: AudioWaveform, delay: 0 },
  { key: 'spectral', label: 'SPECTRAL ANALYSIS', icon: Activity, delay: 700 },
  { key: 'features', label: 'VOICE FEATURES', icon: Cpu, delay: 1600 },
  { key: 'inference', label: 'AI DETECTION', icon: BrainCircuit, delay: 2600 },
  { key: 'verdict', label: 'VERDICT', icon: ShieldCheck, delay: 3600 },
];

export default function AnalysisStatus({
  active,
  modelName = 'XLS-R + AASIST',
}: {
  active: boolean;
  modelName?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  const subtitles = [
    'Scanning spectral artifacts & acoustic phase...',
    'Extracting 1024-channel SSL embeddings...',
    'Analyzing prosody & vocal tract resonance...',
    `${modelName} • Neural inference active`,
  ];

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (active) {
      setVisible(true);
      setActiveStep(1);
      setSubtitleIndex(0);
    } else {
      t = setTimeout(() => setVisible(false), 500);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const timers = PIPELINE_STEPS.map((step, i) =>
      setTimeout(() => setActiveStep(i + 1), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [active, subtitles.length]);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Central Glass HUD Panel */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full p-8 sm:p-10 rounded-3xl bg-[var(--bg-card)]/90 border border-[var(--border-app)] backdrop-blur-md shadow-2xl space-y-6">

        {/* Top Scanner Indicator */}
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <h2 className="text-xl sm:text-2xl font-black tracking-[0.2em] font-mono text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            ANALYZING VOICE
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] animate-pulse text-center">
          {subtitles[subtitleIndex]}
        </p>

        {/* Pipeline Stage Indicators */}
        <div className="w-full pt-2 flex items-center justify-center gap-1 sm:gap-2">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i < activeStep;
            const isCurrent = i === activeStep - 1;

            return (
              <Fragment key={step.key}>
                {i > 0 && (
                  <div
                    className={`h-[2px] flex-1 max-w-[32px] transition-colors duration-500 ${
                      isActive
                        ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.7)]'
                        : 'bg-[var(--border-app)]'
                    }`}
                  />
                )}
                <div className="flex flex-col items-center gap-1.5 transition-all duration-300">
                  <div
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110'
                        : isActive
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-app)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold font-mono tracking-wider text-center hidden md:block ${
                      isCurrent
                        ? 'text-indigo-500'
                        : isActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </Fragment>
            );
          })}
        </div>

        {/* Dynamic Scanning Progress Bar */}
        <div className="w-full bg-[var(--bg-input)] h-1.5 rounded-full overflow-hidden border border-[var(--border-app)]">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all duration-500"
            style={{ width: `${(activeStep / PIPELINE_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
