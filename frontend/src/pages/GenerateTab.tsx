import { useEffect, useMemo, useState } from 'react'
import {
  FlaskConical,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Volume2
} from 'lucide-react'
import { getEngines, synthesize, type EngineInfo } from '../services/synthesisService'
import { detectAudio, type DetectionResult } from '../services/detectionService'
import { apiFetch, ApiError } from '../config/apiConfig'

export default function GenerateTab() {
  const [text, setText] = useState('')
  const [engines, setEngines] = useState<EngineInfo[]>([])
  const [engineName, setEngineName] = useState('kokoro')
  const [voice, setVoice] = useState('af_heart')
  const [language, setLanguage] = useState('en')
  const [reference, setReference] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [watermarkId, setWatermarkId] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<DetectionResult | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    getEngines()
      .then((es) => {
        setEngines(es)
        const first = es.find((e) => e.available) ?? es[0]
        if (first) {
          setEngineName(first.name)
          if (first.preset_voices[0]) setVoice(first.preset_voices[0])
        }
      })
      .catch(() => setEngines([]))
  }, [])

  const engine = useMemo(
    () => engines.find((e) => e.name === engineName),
    [engines, engineName],
  )
  const needsRef = !!engine?.requires_reference
  const canSubmit =
    !!text.trim() && !loading && (!needsRef || (!!reference && consent))

  const handleSynthesize = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setAudioUrl(null)
    setVerdict(null)
    try {
      const data = await synthesize({ text, engine: engineName, voice, language, reference, consent })
      setAudioUrl(data.audio_url)
      setWatermarkId(data.watermark_id ?? null)
    } catch (e) {
      if (e instanceof ApiError) {
        setError(
          e.status === 501
            ? `The "${engine?.label ?? engineName}" engine is not installed on this server.`
            : e.message,
        )
      } else {
        setError('Could not reach synthesis backend API.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTestDetector = async () => {
    if (!audioUrl) return
    setTesting(true)
    setVerdict(null)
    try {
      const res = await apiFetch(audioUrl.replace(/^\/api/, ''))
      const blob = await res.blob()
      const file = new File([blob], 'synthetic_sample.wav', { type: 'audio/wav' })
      setVerdict(await detectAudio(file))
    } catch {
      setError('Could not run the detector on the generated sample.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
          DEFENSIVE BENCHMARKING
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-3">
          Synthetic Voice Lab
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-2xl">
          Generate controlled synthetic speech for security testing and detector evaluation.
        </p>
      </div>

      {/* Security Purpose Notice */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-300 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
        <span>
          <b>Defensive Research Notice:</b> Generated audio is automatically spectrally watermarked and registered in REPLICA to evaluate model robustness against synthetic voice attacks.
        </span>
      </div>

      {/* Main Form Card */}
      <div className="replica-card p-6 sm:p-8 space-y-6">

        {/* Text Input Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
              Text to Synthesize
            </label>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {text.length}/2000 characters
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Type or paste the speech prompt for synthetic audio generation..."
            className="w-full bg-[var(--bg-input)] border border-[var(--border-app)] rounded-xl p-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-indigo-500 text-sm font-sans leading-relaxed"
          />
        </div>

        {/* Engine and Voice Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider font-mono">
              Voice Engine
            </label>
            <select
              value={engineName}
              onChange={(e) => {
                setEngineName(e.target.value)
                const en = engines.find((x) => x.name === e.target.value)
                if (en?.preset_voices[0]) setVoice(en.preset_voices[0])
              }}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-app)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 font-medium"
            >
              {engines.map((e) => (
                <option key={e.name} value={e.name} disabled={!e.available}>
                  {e.label} {e.available ? '' : ' — Not installed'}
                </option>
              ))}
            </select>
          </div>

          {engine && engine.preset_voices.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider font-mono">
                Voice Preset
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-app)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 font-medium"
              >
                {engine.preset_voices.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider font-mono">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-app)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 font-medium"
              >
                {(engine?.languages ?? ['en']).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Zero-Shot Reference Voice Upload (if required by engine) */}
        {needsRef && (
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] space-y-3">
            <label className="block text-xs font-semibold text-[var(--text-primary)] font-mono uppercase">
              Reference Audio Sample (≥ 3 seconds)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setReference(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:font-semibold"
            />
            <label className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-[var(--border-app)] text-indigo-600 accent-indigo-600"
              />
              <span>
                I confirm authorization to utilize this sample for research and model detector evaluation purposes only.
              </span>
            </label>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleSynthesize}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/25 transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating synthetic audio...</span>
            </span>
          ) : (
            <>
              <FlaskConical className="w-4 h-4" />
              <span>{needsRef ? 'Clone & Synthesize Speech' : 'Synthesize Speech'}</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Audio Result */}
      {audioUrl && (
        <div className="replica-card p-6 space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-500" />
              <span>Synthesized Speech Output</span>
            </h3>
            {watermarkId && (
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Watermark ID: {watermarkId}</span>
              </span>
            )}
          </div>

          <audio controls src={audioUrl} className="w-full rounded-lg bg-[var(--bg-input)] p-2 border border-[var(--border-app)]" />

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={audioUrl}
              download="replica_synthetic_sample.wav"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-app)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span>Download Audio</span>
            </a>

            <button
              onClick={handleTestDetector}
              disabled={testing}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-xs font-semibold text-indigo-500 dark:text-indigo-400 transition-colors"
            >
              <Search className="w-4 h-4 text-indigo-500" />
              <span>{testing ? 'Evaluating against detector...' : 'Test Against REPLICA Detector'}</span>
            </button>
          </div>

          {/* Detector Evaluation Verdict */}
          {verdict && (
            <div className={`p-4 rounded-xl border ${
              verdict.label === 'fake'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
            } text-xs space-y-1`}>
              <p className="font-bold text-sm">
                Detector Verdict: <span className="uppercase font-mono">{verdict.label}</span>
              </p>
              <p className="text-[var(--text-secondary)]">
                Confidence: <span className="font-mono font-semibold">{Math.round(verdict.confidence * 100)}%</span> · Model: <span className="font-mono">{verdict.model}</span>
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
