import { useState } from 'react'
import {
  Shield,
  Activity,
  Sparkles,
  Search,
  FileCheck,
  FileText,
  Cpu,
  Zap,
  Lock,
  Award,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react'

export default function AboutTab() {
  const [activeArchStep, setActiveArchStep] = useState<number>(0)
  const [techCategory, setTechCategory] = useState<'all' | 'frontend' | 'backend' | 'ml' | 'audio' | 'infra' | 'security'>('all')

  const ARCH_STEPS = [
    {
      title: 'Audio Input / Streaming',
      desc: 'WAV/MP3/FLAC uploads or real-time 16kHz microphone stream over WebSocket.',
      details: 'Supports up to 50MB files or continuous 2-second streaming windows.',
      icon: Activity,
    },
    {
      title: 'Preprocessing & Quality Guard',
      desc: 'Signal validation, resampling, and RawBoost acoustic data augmentation.',
      details: 'Input-quality guard automatically rejects silent or sub-second audio clips.',
      icon: Zap,
    },
    {
      title: 'Feature Extraction & SSL',
      desc: 'Self-Supervised Learning (SSL) representation with XLS-R-300M backbone.',
      details: 'Extracts deep time-frequency acoustic embeddings across 1024 channels.',
      icon: Cpu,
    },
    {
      title: 'AASIST Neural Classification',
      desc: 'Graph Attention Network (AASIST) evaluating spectral & temporal anomalies.',
      details: 'Official ASVspoof 2021 LA eval EER of 2.84% on production v9c checkpoint.',
      icon: Shield,
    },
    {
      title: 'XAI Integrated Gradients',
      desc: 'Explainable AI attribution highlighting suspicious spectral frequency bands.',
      details: 'Generates pixel-accurate time-frequency attribution heatmap.',
      icon: Search,
    },
    {
      title: 'C2PA & Forensic Reporting',
      desc: 'SHA-256 chain-of-custody logging and NIST SP 800-86 compliant PDF reports.',
      details: 'Embeds C2PA signed manifests and spectral watermarks into synthesized audio.',
      icon: FileCheck,
    },
  ]

  const TECH_STACK = [
    { name: 'PyTorch', category: 'ml', desc: 'Core deep learning model training & inference engine' },
    { name: 'Transformers', category: 'ml', desc: 'HuggingFace XLS-R, Wav2Vec2 & WavLM model backbones' },
    { name: 'AASIST', category: 'ml', desc: 'Spectrogram Graph Attention Network for anti-spoofing' },
    { name: 'XGBoost', category: 'ml', desc: 'IEEE SM2026 classical baseline ML classifier' },
    { name: 'Captum', category: 'ml', desc: 'Integrated-Gradients attribution for Explainable AI' },
    { name: 'ONNX Runtime', category: 'ml', desc: '0.62 MB edge model execution engine (~30ms CPU)' },
    { name: 'FastAPI', category: 'backend', desc: 'High-performance Python async REST API & WebSocket server' },
    { name: 'python-jose', category: 'backend', desc: 'Role-based JWT authentication & cryptographic signing' },
    { name: 'slowapi', category: 'backend', desc: 'Rate limiting and abuse prevention middleware' },
    { name: 'React 18', category: 'frontend', desc: 'Modern reactive component architecture & hooks' },
    { name: 'Vite', category: 'frontend', desc: 'Next-generation lightning fast frontend build tool' },
    { name: 'Tailwind CSS', category: 'frontend', desc: 'Utility-first dark/light theme CSS framework' },
    { name: 'Recharts', category: 'frontend', desc: 'Interactive temporal attribution & benchmark charts' },
    { name: 'librosa & torchaudio', category: 'audio', desc: 'DSP feature extraction, resampling & spectral analysis' },
    { name: 'Kokoro-82M', category: 'audio', desc: 'Fast local neural text-to-speech synthesis engine' },
    { name: 'XTTS v2 / IndexTTS-2', category: 'audio', desc: 'Zero-shot voice cloning engines with reference clips' },
    { name: 'C2PA Manifest', category: 'security', desc: 'Cryptographic digital provenance signing for generated audio' },
    { name: 'Spectral Watermarking', category: 'security', desc: 'Inaudible frequency domain provenance embedding' },
    { name: 'SHA-256 Chain', category: 'security', desc: 'Tamper-evident forensic chain of custody' },
    { name: 'Nginx + systemd', category: 'infra', desc: 'Production reverse proxy, TLS termination & process supervision' },
    { name: 'Docker Compose', category: 'infra', desc: 'Containerized deployment & local environment orchestration' },
    { name: 'GitHub Actions', category: 'infra', desc: 'Automated CI/CD pipeline, pytest, ruff & bandit audits' },
  ]

  const filteredTech = techCategory === 'all'
    ? TECH_STACK
    : TECH_STACK.filter(t => t.category === techCategory)

  return (
    <div className="space-y-16 max-w-[1240px] mx-auto pb-12">

      {/* Hero Section */}
      <div className="relative overflow-hidden replica-card p-8 sm:p-14 space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-semibold tracking-wider uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>AI Voice Security Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.08]">
            Protecting Identity in the Age of Synthetic Voice
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            REPLICA (VoiceGuard) is an end-to-end AI platform engineered to detect voice deepfakes in real time, provide explainable forensic attributions, watermark synthetic speech with cryptographic C2PA provenance, and ship small enough for edge runtime.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-primary)]">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>IEEE SM2026 Accepted</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-primary)]">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <span>Canadian University Dubai</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-primary)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>2.84% ASVspoof EER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: What is REPLICA? (Project Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="replica-card p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">The Vishing Crisis</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              AI voice cloning has transformed telephone fraud into a scalable cyber weapon. In 2024, criminals stole <b>US$25 Million</b> using deepfaked executive audio during a video call, and reported voice-phishing (vishing) incidents surged over <b>1,600%</b> in early 2025.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Off-the-shelf detectors collapse under real-world telephone codecs, background noise, and modern zero-shot TTS engines — offering no actionable evidence for human security analysts.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-xs font-mono text-[var(--text-muted)] space-y-1">
            <span className="text-rose-500 font-bold block">1,600%+ Vishing Surge</span>
            <span>Unprotected audio channels leave enterprises and individuals vulnerable to real-time voice spoofing.</span>
          </div>
        </div>

        <div className="replica-card p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">The REPLICA Solution</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              REPLICA combines production SSL deep learning models (XLS-R + AASIST) with explainable AI (Integrated Gradients) to deliver instant, verifiable verdicts on incoming audio feeds and telephone calls.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every synthetic file generated by REPLICA is embedded with inaudible spectral watermarks and cryptographic C2PA provenance manifests, establishing an unbroken chain of custody.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-600 dark:text-indigo-400 space-y-1">
            <span className="font-bold block">Production Model XLS-R + AASIST (v9c)</span>
            <span>Hardened against unseen ElevenLabs-v3, Kokoro, XTTS v2, and IndexTTS-2 voice clones.</span>
          </div>
        </div>
      </div>

      {/* Section 5: Core Capabilities */}
      <div className="space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">Core Capabilities</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Comprehensive security architecture built for audio detection, live call protection, and provenance verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Voice Deepfake Detection',
              desc: 'Production XLS-R-300M + AASIST v9c model with 2.84% ASVspoof 2021 LA EER. Detects modern voice clones and premium TTS.',
              icon: Shield,
              badge: 'Detection Engine',
            },
            {
              title: 'Live Mic & VoIP Streaming',
              desc: 'Real-time WebSocket mic monitoring and Twilio Media Streams bridge for live telephone call screening.',
              icon: Activity,
              badge: 'Real-Time Protection',
            },
            {
              title: 'Explainable AI (XAI)',
              desc: 'Integrated-Gradients attribution revealing exact time-frequency moments driving the deepfake verdict.',
              icon: Search,
              badge: 'Transparency',
            },
            {
              title: 'Synthesis & Watermarking',
              desc: 'Local Kokoro-82M TTS and zero-shot voice cloning (XTTS v2 / IndexTTS-2) with C2PA provenance signing.',
              icon: Sparkles,
              badge: 'Provenance',
            },
            {
              title: 'Forensic PDF Reports',
              desc: 'SHA-256 chain-of-custody logging generating NIST SP 800-86 compliant PDF evidence documentation.',
              icon: FileText,
              badge: 'Audit Trail',
            },
            {
              title: 'Edge Runtime Deployment',
              desc: '0.62 MB ONNX INT8 quantized model running at ~30 ms CPU latency on resource-constrained devices.',
              icon: Cpu,
              badge: 'Edge-Ready',
            },
          ].map((cap, idx) => (
            <div key={idx} className="replica-card p-6 space-y-4 hover:border-indigo-500/40 transition-all group">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  <cap.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-muted)]">
                  {cap.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{cap.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6 & 14: Interactive Project Flow & System Architecture */}
      <div className="replica-card p-8 sm:p-10 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-500">
            PIPELINE FLOW & ARCHITECTURE
          </span>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">How REPLICA Works</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Click through the pipeline stages to inspect REPLICA's multi-layered detection and forensic reporting system.
          </p>
        </div>

        {/* Pipeline Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ARCH_STEPS.map((step, idx) => {
            const Icon = step.icon
            const isActive = activeArchStep === idx
            return (
              <button
                key={idx}
                onClick={() => setActiveArchStep(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all space-y-2 ${isActive
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 replica-glow-indigo'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-app)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold font-mono truncate">{step.title.split(' ')[0]}</div>
              </button>
            )
          })}
        </div>

        {/* Selected Step Detailed View */}
        <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-app)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-indigo-500">STAGE 0{activeArchStep + 1}</span>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{ARCH_STEPS[activeArchStep].title}</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{ARCH_STEPS[activeArchStep].desc}</p>
            <p className="text-xs font-mono text-[var(--text-muted)] pt-1">{ARCH_STEPS[activeArchStep].details}</p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
            {(() => {
              const Icon = ARCH_STEPS[activeArchStep].icon
              return <Icon className="w-10 h-10" />
            })()}
          </div>
        </div>

        {/* Architecture Mermaid Schematic Representation */}
        <div className="p-6 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-app)] space-y-4">
          <span className="text-xs font-mono text-[var(--text-muted)] block uppercase font-bold tracking-wider">
            SYSTEM DATAFLOW DIAGRAM
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] space-y-1">
              <span className="text-indigo-500 font-bold block">1. Client Tier</span>
              <span className="text-[11px] text-[var(--text-secondary)] block">React 18 · WebSocket · Audio Recorder</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] space-y-1">
              <span className="text-purple-500 font-bold block">2. API Gateway</span>
              <span className="text-[11px] text-[var(--text-secondary)] block">FastAPI · JWT Auth · PDPL Auto-Delete</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] space-y-1">
              <span className="text-emerald-500 font-bold block">3. SSL AI Engine</span>
              <span className="text-[11px] text-[var(--text-secondary)] block">XLS-R + AASIST v9c · Integrated Gradients</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] space-y-1">
              <span className="text-amber-500 font-bold block">4. Provenance & Edge</span>
              <span className="text-[11px] text-[var(--text-secondary)] block">C2PA Manifest · SHA-256 · ONNX 0.62MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 8: Technology Stack */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">Technology Stack</h2>
            <p className="text-sm text-[var(--text-secondary)]">Verified framework dependencies powering REPLICA.</p>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-xs font-mono">
            {(['all', 'ml', 'backend', 'frontend', 'audio', 'security', 'infra'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setTechCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${techCategory === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTech.map((tech, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] space-y-1.5 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--text-primary)] font-mono">{tech.name}</span>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {tech.category}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 9, 10 & 11: Performance, Benchmark & Lineage Comparison */}
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-500">
            MEASURED BENCHMARKS
          </span>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">Performance & Evaluation</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Official ASVspoof 2021 LA evaluation protocol metrics and real-world out-of-distribution voice clone detection rates.
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { metric: '2.84%', label: 'ASVspoof 2021 LA EER', sub: '95% CI 2.67–3.02%' },
            { metric: '96%', label: 'Real Audio Pass Rate', sub: 'Disjoint speakers' },
            { metric: '100%', label: 'Kokoro Clone Detection', sub: '100/family tested' },
            { metric: '100%', label: 'XTTS v2 Detection', sub: 'Zero-shot clones' },
            { metric: '95.8%', label: 'ElevenLabs-v3 Detection', sub: 'Unseen engine' },
            { metric: '0.62 MB', label: 'Edge ONNX INT8 Size', sub: '~30 ms CPU latency' },
          ].map((kpi, idx) => (
            <div key={idx} className="replica-card p-5 space-y-1.5 text-center font-mono">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block tracking-tight">
                {kpi.metric}
              </span>
              <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">{kpi.label}</span>
              <span className="text-[10px] text-[var(--text-muted)] block">{kpi.sub}</span>
            </div>
          ))}
        </div>

        {/* Model Lineage Table */}
        <div className="replica-card p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-mono flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
            <span>Model Lineage Benchmark Table</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Demonstrating why v9c is selected for production over lower EER models that collapse on modern voice clones.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-app)] text-[var(--text-muted)] uppercase text-[10px]">
                  <th className="py-3 px-4">Model Architecture</th>
                  <th className="py-3 px-4">ASVspoof Eval EER</th>
                  <th className="py-3 px-4">Full-Pool EER</th>
                  <th className="py-3 px-4">Catches Clones</th>
                  <th className="py-3 px-4">ElevenLabs-v3</th>
                  <th className="py-3 px-4">Deployment Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-app)]">
                <tr className="bg-indigo-500/10 text-[var(--text-primary)] font-bold">
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>XLS-R + AASIST (v9c)</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-500">2.84%</td>
                  <td className="py-3.5 px-4">8.21%</td>
                  <td className="py-3.5 px-4 text-emerald-500">✓ All ≥97%</td>
                  <td className="py-3.5 px-4 text-emerald-500">✓ 95.8%</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500 text-white text-[10px]">
                      DEPLOYED PRODUCTION
                    </span>
                  </td>
                </tr>
                <tr className="text-[var(--text-secondary)]">
                  <td className="py-3.5 px-4">XLS-R + AASIST (v7)</td>
                  <td className="py-3.5 px-4">3.38%</td>
                  <td className="py-3.5 px-4">8.60%</td>
                  <td className="py-3.5 px-4">✓ All ≥96.7%</td>
                  <td className="py-3.5 px-4 text-rose-400">85.0%</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">Previous Production</td>
                </tr>
                <tr className="text-[var(--text-secondary)]">
                  <td className="py-3.5 px-4">XLS-R + AASIST (v8)</td>
                  <td className="py-3.5 px-4 text-emerald-400">2.49%</td>
                  <td className="py-3.5 px-4">9.91%</td>
                  <td className="py-3.5 px-4 text-rose-400">✗ (Kokoro 62.5%)</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">—</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">Rejected (Lowest EER, Clone-Blind)</td>
                </tr>
                <tr className="text-[var(--text-secondary)]">
                  <td className="py-3.5 px-4">Wav2Vec2-large Baseline</td>
                  <td className="py-3.5 px-4">3.09%</td>
                  <td className="py-3.5 px-4">7.07%</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">—</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">—</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">HuggingFace Fallback Baseline</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 12: Security & Privacy by Design */}
      <div className="replica-card p-8 space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-500">
            PRIVACY & DATA GOVERNANCE
          </span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Security by Design</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Built following strict privacy-preserving principles and digital forensic protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'PDPL Auto-Deletion', desc: 'Audio clips auto-purged after 60 seconds (PDPL_MAX_AGE_SECONDS=60).' },
            { title: 'C2PA Digital Signing', desc: 'Synthesized audio carries cryptographically signed C2PA provenance manifests.' },
            { title: 'SHA-256 Audit Trail', desc: 'NIST SP 800-86 forensic reports with SHA-256 chain of custody.' },
            { title: 'Zero Audio Retention', desc: 'No persistent raw audio storage on servers post-analysis.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] space-y-1.5">
              <span className="text-xs font-bold text-[var(--text-primary)] block font-mono">{item.title}</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 17: Future Scope & Roadmap */}
      <div className="replica-card p-8 space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-purple-500">
            ROADMAP & RESEARCH
          </span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">What's Next</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-3 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="font-bold text-emerald-500 uppercase block">✓ Completed Milestones</span>
            <ul className="space-y-2 text-[var(--text-primary)]">
              <li className="flex items-center gap-2">✓ Trained DSFNetTiny for 0.62 MB ONNX edge export</li>
              <li className="flex items-center gap-2">✓ Reproduced ASVspoof 2021 LA 2.61% baseline EER</li>
              <li className="flex items-center gap-2">✓ True signed C2PA provenance on synthesized audio</li>
              <li className="flex items-center gap-2">✓ Permanent hosted deployment with Cloudflare Tunnel</li>
            </ul>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="font-bold text-indigo-500 uppercase block">🚀 Active Research Scope</span>
            <ul className="space-y-2 text-[var(--text-primary)]">
              <li className="flex items-center gap-2">⏳ ElevenLabs premium TTS hardening with real-pass safety gate</li>
              <li className="flex items-center gap-2">⏳ Backbone adversarial fine-tuning for PGD attack robustness</li>
              <li className="flex items-center gap-2">⏳ GADC (Gulf-Arabic Deepfake Corpus) + human perception study</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3 & 18: Team / Developers — AIMERS 1.0 */}
      <div className="replica-card p-8 sm:p-12 space-y-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-500">
            DEVELOPMENT TEAM
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight font-sans">
            BUILT BY AIMERS 1.0
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            A team building intelligent systems for emerging security challenges.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-2 text-left">
          {[
            {
              name: 'Tridip Samanta & Sourav Das',
              role: 'Detection Architecture & Backend',
              tasks: 'Detection architecture, FastAPI backend, CI/CD pipeline, server deployment',
            },
            {
              name: 'Subham Sidhanta & Kaniska Ojha',
              role: 'Feature Extraction & ML Baseline',
              tasks: 'Feature extraction, classical ML models, SSL representation, evaluation scripts',
            },
            {
              name: 'Sohini & Ishita Ghosh',
              role: 'Frontend, Watermarking & VoIP',
              tasks: 'React 18 frontend, synthesis engines, C2PA watermarking, VoIP bridge, XAI',
            },
          ].map((member, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-app)] space-y-3 hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-lg">
                0{idx + 1}
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{member.name}</h3>
                <span className="text-xs font-mono text-indigo-500 font-semibold block mt-0.5">{member.role}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{member.tasks}</p>
            </div>
          ))}
        </div>

        {/* Academic Supervision & Citation */}
        <div className="relative z-10 p-6 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-app)] max-w-3xl mx-auto space-y-3 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--border-app)] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-primary)]">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>Academic Mentorship & Institutional Context</span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Graduation Project GP2 (2025–2026)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[var(--text-secondary)]">
            <div>
              <span className="text-[var(--text-muted)] block">Supervisor:</span>
              <span className="text-[var(--text-primary)] font-bold block">Dr. Arunita Das</span>
              <span></span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">IEEE SM2026 Citation:</span>
              <span className="text-[var(--text-primary)] font-bold block">Accepted Conference Paper</span>
              <span>Classical Baseline (F1 = 0.95)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
