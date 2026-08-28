import { useState } from 'react'
import { Lock, Key, ShieldCheck, AlertCircle, X, Sun, Moon } from 'lucide-react'
import { ApiError } from '../config/apiConfig'
import { login } from '../services/authService'
import { useTheme } from '../context/ThemeContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('voiceguard2026')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(username, password)
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? 'Invalid username or password' : err.message)
      } else {
        setError('Could not connect to authentication server.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-app)] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">

        {/* Header with Close and Segmented Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center p-1.5">
              <img src="/replica-logo.png" alt="REPLICA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-wide">
                REPLICA Secure Access
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                Authentication Required
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-500" />
          <span>Restricted AI platform environment. Log in with admin credentials.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono mb-1.5">
              Username / Identity
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[var(--bg-input)] border border-[var(--border-app)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono mb-1.5">
              Access Token / Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--bg-input)] border border-[var(--border-app)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl replica-btn-primary disabled:opacity-50 font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In to REPLICA</span>
            )}
          </button>
        </form>

        <div className="text-center">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Default credentials: <code className="text-indigo-600 dark:text-indigo-400">admin</code> / <code className="text-indigo-600 dark:text-indigo-400">voiceguard2026</code>
          </span>
        </div>

      </div>
    </div>
  )
}
