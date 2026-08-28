import { useRef, useState } from 'react'
import {
  FileCheck2,
  FileQuestion,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Sparkles
} from 'lucide-react'
import {
  verifyProvenance,
  type WatermarkVerifyResult,
  type ProvenanceVerdict,
} from '../services/provenanceService'
import { ApiError } from '../config/apiConfig'

const VERDICT_VIEW: Record<
  ProvenanceVerdict,
  { label: string; cls: string; bg: string; icon: React.ReactNode; blurb: string }
> = {
  'voiceguard-generated': {
    label: 'REPLICA Provenance Detected',
    cls: 'border-indigo-500/40 text-indigo-500 dark:text-indigo-300',
    bg: 'bg-indigo-500/10 replica-glow-indigo',
    icon: <CheckCircle2 className="w-8 h-8 text-indigo-500" />,
    blurb: 'The keyed spectral watermark matches — this audio clip was synthesized by REPLICA.',
  },
  'ai-generated': {
    label: 'AI-Generated (C2PA Manifest Detected)',
    cls: 'border-amber-500/40 text-amber-500 dark:text-amber-300',
    bg: 'bg-amber-500/10',
    icon: <Sparkles className="w-8 h-8 text-amber-500" />,
    blurb: 'A signed cryptographic C2PA manifest marks this audio as algorithmic synthetic media.',
  },
  unknown: {
    label: 'C2PA Manifest Present — Origin Unclear',
    cls: 'border-[var(--border-app)] text-[var(--text-secondary)]',
    bg: 'bg-[var(--bg-secondary)]',
    icon: <HelpCircle className="w-8 h-8 text-[var(--text-muted)]" />,
    blurb: 'The file carries a C2PA metadata manifest but contains no AI-generation assertion.',
  },
  'no-provenance-found': {
    label: 'No Provenance Information Found',
    cls: 'border-[var(--border-app)] text-[var(--text-muted)]',
    bg: 'bg-[var(--bg-secondary)]',
    icon: <FileQuestion className="w-8 h-8 text-[var(--text-muted)]" />,
    blurb:
      'No REPLICA spectral watermark or C2PA manifest was detected. Note: Absence of provenance does not prove that audio is authentic — most recordings and deepfakes carry no provenance marks. Use the Detect tab for voice authenticity analysis.',
  },
}

function ResultPanel({ result }: { result: WatermarkVerifyResult }) {
  const view = VERDICT_VIEW[result.verdict]
  const rows: { k: string; v: string }[] = [
    {
      k: 'Spectral Watermark Status',
      v: result.spectral_checked
        ? result.spectral_detected
          ? `Detected (correlation ${result.spectral_correlation?.toFixed(4)})`
          : `Not Detected (correlation ${result.spectral_correlation?.toFixed(4)})`
        : 'Not checked — optionally enter Watermark ID above',
    },
    {
      k: 'C2PA Cryptographic Manifest',
      v: result.c2pa_has_manifest
        ? `Present · State: ${result.c2pa_validation_state ?? 'unvalidated'}`
        : 'Absent',
    },
  ]
  if (result.c2pa_has_manifest) {
    rows.push({
      k: 'C2PA AI Assertion',
      v: result.c2pa_ai_generated
        ? `AI-generated · Agent: ${result.c2pa_software_agent ?? 'unknown agent'}`
        : 'No AI-generation assertion found',
    })
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className={`rounded-2xl border-2 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 ${view.bg} ${view.cls}`}>
        <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-app)] shrink-0">
          {view.icon}
        </div>
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)]">
            PROVENANCE VERIFICATION VERDICT
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-0.5">
            {view.label}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
            {view.blurb}
          </p>
        </div>
      </div>

      <div className="replica-card divide-y divide-[var(--border-app)] overflow-hidden">
        {rows.map(({ k, v }) => (
          <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
            <span className="text-xs font-medium text-[var(--text-secondary)]">{k}</span>
            <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function VerifyTab() {
  const [file, setFile] = useState<File | null>(null)
  const [watermarkId, setWatermarkId] = useState('')
  const [result, setResult] = useState<WatermarkVerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleVerify = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await verifyProvenance(file, watermarkId))
    } catch (e) {
      if (e instanceof ApiError) {
        setError(
          e.status === 401
            ? 'Authentication required. Please sign in with "Secure Access" in the top right header.'
            : e.message,
        )
      } else {
        setError('Could not connect to REPLICA provenance API.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
          MEDIA PROVENANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-3">
          Verify Audio Provenance
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-2xl">
          Check whether an audio file contains REPLICA provenance information, spectral watermarks, or C2PA manifests.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="replica-card p-6 sm:p-8 space-y-6">
        <input
          ref={fileRef}
          type="file"
          accept=".wav,.mp3,.flac,.ogg,audio/*"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null)
            setResult(null)
          }}
        />

        {!file ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="group flex flex-col items-center justify-center p-10 sm:p-12 border-2 border-dashed border-[var(--border-app)] hover:border-indigo-500/50 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-all duration-200 text-center"
          >
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all mb-4">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Drop audio here to verify</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Select an audio clip to scan for provenance signatures</p>
            <span className="mt-4 px-3 py-1 rounded-full text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-input)] border border-[var(--border-app)]">
              WAV · MP3 · FLAC · OGG
            </span>
          </div>
        ) : (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-app)] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                <FileAudio className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{file.name}</p>
                <p className="text-xs text-[var(--text-muted)] font-mono">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setResult(null)
              }}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg border border-[var(--border-app)] bg-[var(--bg-elevated)]"
            >
              Change File
            </button>
          </div>
        )}

        {/* Optional Watermark ID Field */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider font-mono">
            Watermark ID <span className="text-[var(--text-muted)] font-normal">(Optional — generated during TTS synthesis)</span>
          </label>
          <input
            type="text"
            value={watermarkId}
            onChange={(e) => setWatermarkId(e.target.value)}
            placeholder="e.g. 1f3a9c8b..."
            className="w-full bg-[var(--bg-input)] border border-[var(--border-app)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] text-sm font-mono placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit CTA */}
        <button
          onClick={handleVerify}
          disabled={!file || loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/25 transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying audio provenance...</span>
            </span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Verify Provenance</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && <ResultPanel result={result} />}

    </div>
  )
}
