import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import {
  BarChart3,
  Award,
  ShieldCheck,
  Zap,
  Trash2,
  CheckCircle2,
  Star
} from 'lucide-react'
import { getHistory, clearHistory, type HistoryEntry } from '../services/history'
import { useTheme } from '../context/ThemeContext'

// Final results — ASVspoof 2021 LA (eval partition), lower EER is better.
const EER_RESULTS = [
  { model: 'XLS-R + AASIST', eer: 2.61, prod: true },
  { model: 'Wav2Vec2-large', eer: 3.09, prod: false },
  { model: 'WavLM-base+', eer: 8.11, prod: false },
  { model: 'WavLM-large', eer: 9.20, prod: false },
  { model: 'XLS-R', eer: 10.47, prod: false },
  { model: 'AASIST', eer: 10.90, prod: false },
  { model: 'DSFNet-V2', eer: 12.67, prod: false },
]

// Out-of-distribution generalisation of the production model to unseen TTS families
const OOD = [
  { system: 'IndexTTS2 (Deepfake)', rate: 100, kind: 'detect' },
  { system: 'Kokoro-82M (Deepfake)', rate: 93, kind: 'detect' },
  { system: 'Genuine Human Speech', rate: 90, kind: 'pass' },
]

const CONFUSION = { TP: 237, FN: 0, FP: 1, TN: 236 }

function KPICard({
  value,
  label,
  sublabel,
  icon,
  accent,
}: {
  value: string
  label: string
  sublabel: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className="replica-card p-6 space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
        <div className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)]">
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${accent}`}>
          {value}
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">{sublabel}</p>
      </div>
    </div>
  )
}

export default function ResultsTab() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const { theme } = useTheme()

  useEffect(() => setHistory(getHistory()), [])

  const isDark = theme === 'dark'
  const chartTextColor = isDark ? '#94a3b8' : '#475569'
  const tooltipBg = isDark ? '#101625' : '#ffffff'
  const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
  const tooltipText = isDark ? '#f8fafc' : '#0f172a'

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
          ANALYTICS & BENCHMARKS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-3">
          Model Performance
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-2xl">
          Evaluate REPLICA's detection performance across benchmark datasets and synthetic voice systems.
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          value="2.61%"
          label="Equal Error Rate"
          sublabel="XLS-R + AASIST Deployed Model"
          icon={<Award className="w-5 h-5 text-indigo-500" />}
          accent="text-indigo-500 dark:text-indigo-400"
        />
        <KPICard
          value="93%"
          label="AI Detection Rate"
          sublabel="Kokoro-82M Deepfake Evaluation"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
          accent="text-emerald-500 dark:text-emerald-400"
        />
        <KPICard
          value="90%"
          label="Genuine Pass Rate"
          sublabel="Human Speech Pass Accuracy"
          icon={<CheckCircle2 className="w-5 h-5 text-cyan-500" />}
          accent="text-cyan-500 dark:text-cyan-400"
        />
        <KPICard
          value="100%"
          label="IndexTTS2 Detection"
          sublabel="Held-out Neural Model Generalization"
          icon={<Zap className="w-5 h-5 text-purple-500" />}
          accent="text-purple-500 dark:text-purple-400"
        />
      </div>

      {/* EER Leaderboard Table */}
      <div className="replica-card overflow-hidden">
        <div className="p-6 border-b border-[var(--border-app)] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <span>Model Comparison Leaderboard</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Evaluated on ASVspoof 2021 LA eval benchmark partition (Lower EER indicates higher accuracy)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-mono text-xs uppercase border-b border-[var(--border-app)]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Model Architecture</th>
                <th className="px-6 py-3.5 font-semibold">Equal Error Rate (EER ↓)</th>
                <th className="px-6 py-3.5 font-semibold">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-app)]">
              {EER_RESULTS.map((row) => (
                <tr
                  key={row.model}
                  className={`transition-colors ${
                    row.prod
                      ? 'bg-indigo-600/10 hover:bg-indigo-600/15'
                      : 'hover:bg-[var(--bg-elevated)]/50'
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <span>{row.model}</span>
                    {row.prod && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-500 dark:text-indigo-300 border border-indigo-500/30">
                        <Star className="w-3 h-3 text-indigo-500 fill-current" />
                        Deployed Production Model
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-indigo-500 dark:text-indigo-300">
                    {row.eer.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {row.prod ? (
                      <span className="text-emerald-500 font-semibold">ACTIVE</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">Benchmark Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Theme-Aware EER Performance Visual Chart */}
      <div className="replica-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Equal Error Rate by Model</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Visualization of detector benchmark performance across state-of-the-art models (Theme-adaptive contrast)
          </p>
        </div>

        <div className="pt-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={EER_RESULTS} margin={{ left: -10, bottom: 20 }}>
              <XAxis
                dataKey="model"
                tick={{ fill: chartTextColor, fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fill: chartTextColor, fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '8px',
                  color: tooltipText,
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                }}
                formatter={(v: number) => [`${v}%`, 'EER']}
              />
              <Bar dataKey="eer" radius={[6, 6, 0, 0]}>
                {EER_RESULTS.map((entry) => (
                  <Cell
                    key={entry.model}
                    fill={entry.prod ? '#6366f1' : isDark ? '#1e293b' : '#cbd5e1'}
                    stroke={entry.prod ? '#818cf8' : isDark ? '#334155' : '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Out-Of-Distribution Robustness Breakdown */}
      <div className="replica-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Unseen Voice Robustness</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Generalization of deployed XLS-R + AASIST architecture across modern held-out TTS engines
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {OOD.map(({ system, rate, kind }) => (
            <div key={system} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[var(--text-primary)]">{system}</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{rate}%</span>
              </div>
              <div className="h-2.5 bg-[var(--bg-input)] rounded-full overflow-hidden border border-[var(--border-app)]">
                <div
                  className={`h-full rounded-full ${
                    kind === 'pass' ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confusion Matrix Card */}
      <div className="replica-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Baseline Confusion Matrix</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Validation distribution for enhanced XGBoost classical baseline
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg">
          {[
            { label: 'True Positive (TP)', value: CONFUSION.TP, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' },
            { label: 'False Negative (FN)', value: CONFUSION.FN, color: 'bg-rose-500/10 border-rose-500/30 text-rose-500' },
            { label: 'False Positive (FP)', value: CONFUSION.FP, color: 'bg-amber-500/10 border-amber-500/30 text-amber-500' },
            { label: 'True Negative (TN)', value: CONFUSION.TN, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`p-4 rounded-xl border ${color} text-center space-y-1`}>
              <p className="text-[10px] font-mono uppercase">{label}</p>
              <p className="text-2xl font-bold font-mono">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Detection History */}
      <div className="replica-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Recent Session Detections</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Audio analysis log stored locally for this browser session
            </p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearHistory()
                setHistory([])
              }}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-rose-500 px-3 py-1.5 rounded-lg border border-[var(--border-app)] bg-[var(--bg-secondary)] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center bg-[var(--bg-input)] rounded-xl border border-[var(--border-app)] text-xs text-[var(--text-muted)] font-mono">
            No analysis history recorded yet. Run detections in the Detect tab to populate this session log.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--border-app)]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-mono uppercase border-b border-[var(--border-app)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Audio Filename</th>
                  <th className="px-4 py-3 font-semibold">Verdict</th>
                  <th className="px-4 py-3 font-semibold">Confidence</th>
                  <th className="px-4 py-3 font-semibold">Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-app)]">
                {history.map((h) => (
                  <tr key={h.ts} className="hover:bg-[var(--bg-elevated)]/50">
                    <td className="px-4 py-3 text-[var(--text-secondary)] font-mono">
                      {new Date(h.ts).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)] max-w-[14rem] truncate">
                      {h.filename}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold font-mono uppercase text-[11px] ${
                          h.label === 'fake' ? 'text-rose-500' : 'text-emerald-500'
                        }`}
                      >
                        {h.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--text-primary)]">
                      {Math.round(h.confidence * 100)}%
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--text-secondary)]">{h.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
