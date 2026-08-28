import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar, { type Tab } from './components/Navbar'
import Footer from './components/Footer'
import DetectTab from './pages/DetectTab'
import LiveTab from './pages/LiveTab'
import GenerateTab from './pages/GenerateTab'
import VerifyTab from './pages/VerifyTab'
import ResultsTab from './pages/ResultsTab'
import AboutTab from './pages/AboutTab'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('detect')

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-200">

        {/* Top Transparent Glass Navbar (80-88px) */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Workspace Container */}
        <main className={`flex-1 w-full relative ${activeTab === 'live' ? 'max-w-none px-0 py-0 overflow-hidden' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12'}`}>
          <div key={activeTab} className="animate-page-in w-full h-full">
            {activeTab === 'detect' && <DetectTab />}
            {activeTab === 'live' && <LiveTab />}
            {activeTab === 'generate' && <GenerateTab />}
            {activeTab === 'verify' && <VerifyTab />}
            {activeTab === 'results' && <ResultsTab />}
            {activeTab === 'about' && <AboutTab />}
          </div>
        </main>

        {/* Footer (Hidden on Live Monitoring HUD to ensure 100vh zero-scroll fit) */}
        {activeTab !== 'live' && <Footer />}

      </div>
    </ThemeProvider>
  )
}
