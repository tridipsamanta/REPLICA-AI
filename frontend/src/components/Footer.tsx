import { ShieldCheck, Lock, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-app)] border-t border-[var(--border-app)] py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-secondary)]">

        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <img
            src="/logo2.png"
            alt="REPLICA AI Security"
            className="h-10 sm:h-12 md:h-13 w-auto max-w-[220px] sm:max-w-[260px] object-contain select-none filter drop-shadow-md transition-all hover:scale-[1.02]"
          />
          <span className="text-[var(--border-hover)]">|</span>
          <span className="text-xs font-mono font-medium text-[var(--text-secondary)]">AI Voice Security Platform</span>
        </div>

        {/* Links & Compliance Standards */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5 hover:text-[var(--text-primary)] cursor-pointer transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Security Standard</span>
          </span>
          <span className="flex items-center gap-1.5 hover:text-[var(--text-primary)] cursor-pointer transition-colors">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Privacy & PDPL Compliance</span>
          </span>
          <a
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
          >
            <span>API Specs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[var(--text-muted)]">
          © 2026 REPLICA. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
