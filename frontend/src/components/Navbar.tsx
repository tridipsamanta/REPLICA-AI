import { useEffect, useState } from 'react'
import {
  Shield,
  Activity,
  CheckCircle2,
  BarChart3,
  LogOut,
  UserCheck,
  Menu,
  X,
  Sun,
  Moon,
  Lock,
  Info
} from 'lucide-react'
import { getToken, clearToken } from '../config/apiConfig'
import { useTheme } from '../context/ThemeContext'

export type Tab = 'detect' | 'live' | 'generate' | 'verify' | 'results' | 'about'

interface NavbarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  onOpenLogin: () => void
}

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'detect', label: 'Detect', icon: Shield },
  { id: 'live', label: 'Live', icon: Activity },
  { id: 'verify', label: 'Verify', icon: CheckCircle2 },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'about', label: 'About', icon: Info },
]

export default function Navbar({ activeTab, setActiveTab, onOpenLogin }: NavbarProps) {
  const [token, setToken] = useState<string | null>(getToken())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    clearToken()
    setToken(null)
    window.location.reload()
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 glass-navbar ${
        isScrolled
          ? 'h-20 sm:h-24 bg-[var(--navbar-scrolled)] border-b border-[var(--navbar-border-scrolled)] shadow-lg'
          : 'h-20 sm:h-24 bg-[var(--navbar-top)] border-b border-[var(--navbar-border-top)] shadow-sm'
      }`}
    >
      <div className="w-full max-w-[1440px] px-6 md:px-10 h-full mx-auto flex items-center justify-between gap-6">

        {/* Left: REPLICA Wide Logo Brand Display (Big Size) */}
        <div className="flex items-center gap-3.5 shrink-0">
          <button
            onClick={() => setActiveTab('detect')}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <img
              src="/logo2.png"
              alt="REPLICA AI Security"
              className="h-10 sm:h-12 md:h-14 w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[360px] object-contain filter drop-shadow-md select-none transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="text-xs sm:text-sm font-mono font-extrabold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 leading-none shrink-0 shadow-sm">
              v2.0
            </span>
          </button>
        </div>

        {/* Center: Navigation Tabs (Desktop Big Size) */}
        <nav className="hidden xl:flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-app)] shadow-sm">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wide transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-muted)]'}`} />
                <span>{label}</span>
                {/* Animated active underline indicator */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(91,95,239,0.8)] transition-all duration-300 ${isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'}`} />
              </button>
            )
          })}
        </nav>

        {/* Right: Premium Segmented Theme Toggle & Secure Access (Big Size) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">

          <nav className="flex xl:hidden items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-app)] shadow-sm mr-2">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative p-3 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wide transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                  title={label}
                >
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-muted)]'}`} />
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(91,95,239,0.8)] transition-all duration-300 ${isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'}`} />
                </button>
              )
            })}
          </nav>

          {/* Segmented Pill Theme Switcher (Big Size) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            className="p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-app)] flex items-center gap-1 shadow-inner cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <div
              className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-mono font-bold transition-all ${
                theme === 'light'
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-emerald-500' : ''}`} />
              <span className="hidden xl:inline">Light</span>
            </div>
            <div
              className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-mono font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : ''}`} />
              <span className="hidden xl:inline">Dark</span>
            </div>
          </button>

          {/* Engine Status Pill (Big Size) */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden xl:inline">Engine Active</span>
          </div>

          {/* Account / Secure Access CTA (Big Size) */}
          {token ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-xs sm:text-sm font-mono text-[var(--text-primary)] font-extrabold shadow-sm">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-secondary)] hover:text-rose-500 hover:border-rose-500/30 transition-all shadow-sm"
                title="Sign out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl replica-btn-primary font-bold text-xs sm:text-sm transition-all flex-shrink-0 shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>Secure Access</span>
            </button>
          )}
        </div>

        {/* Mobile Right Controls */}
        <div className="flex lg:hidden items-center gap-2 ml-auto">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-secondary)] shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-app)] text-[var(--text-secondary)] shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 bg-[var(--navbar-scrolled)] backdrop-blur-[20px] border-b border-[var(--border-app)] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id)
                  setMobileMenuOpen(false)
                }}
                className={`p-3 rounded-xl text-xs font-mono font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === id
                    ? 'bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-app)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border-app)] flex items-center justify-between">
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-semibold border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl replica-btn-primary text-white text-xs font-semibold"
              >
                <Lock className="w-4 h-4" />
                <span>Secure Access</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
