import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import SidePanel, { MobileNav } from './components/SidePanel.jsx'
import InfraMap from './components/InfraMap.jsx'
import ControlArchitecture from './components/ControlArchitecture.jsx'
import TradeFlow from './components/TradeFlow.jsx'
import FailureSimulator from './components/FailureSimulator.jsx'
import ResponsibilityMatrix from './components/ResponsibilityMatrix.jsx'
import PartnerScorecard from './components/PartnerScorecard.jsx'
import StrategySimulator from './components/StrategySimulator.jsx'
import FinalArchitecture from './components/FinalArchitecture.jsx'
import RoadmapStrip from './components/RoadmapStrip.jsx'

const pages = [
  {
    id: 'strategy',
    group: 'STRATEGY',
    label: 'Decision Board',
    icon: '🎯',
    tone: 'build',
    component: InfraMap,
  },
  {
    id: 'control-arch',
    group: 'STRATEGY',
    label: 'Control Architecture',
    icon: '🔌',
    tone: 'hybrid',
    component: ControlArchitecture,
  },
  {
    id: 'trade-flow',
    group: 'PRODUCT',
    label: 'Trade Flow',
    icon: '⚡',
    tone: 'hybrid',
    component: TradeFlow,
  },
  {
    id: 'failure-sim',
    group: 'PRODUCT',
    label: 'Failure Lab',
    icon: '💥',
    tone: 'build',
    component: FailureSimulator,
  },
  {
    id: 'responsibility',
    group: 'RISK',
    label: 'Ownership Matrix',
    icon: '🛡️',
    tone: 'partner',
    component: ResponsibilityMatrix,
  },
  {
    id: 'scorecard',
    group: 'RISK',
    label: 'Partner Scorecard',
    icon: '📊',
    tone: 'partner',
    component: PartnerScorecard,
  },
  {
    id: 'simulator',
    group: 'PLAN',
    label: 'Scenario Lab',
    icon: '🧪',
    tone: 'hybrid',
    component: StrategySimulator,
  },
  {
    id: 'final-arch',
    group: 'PLAN',
    label: 'Final Architecture',
    icon: '🏛️',
    tone: 'build',
    component: FinalArchitecture,
  },
  {
    id: 'roadmap',
    group: 'PLAN',
    label: 'Roadmap',
    icon: '📍',
    tone: 'partner',
    component: RoadmapStrip,
  },
]

export default function App() {
  const [pageId, setPageId] = useState('strategy')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 15)
    return () => clearTimeout(t)
  }, [pageId])

  const active = pages.find((p) => p.id === pageId) || pages[0]
  const ActivePage = active.component

  const navigate = (id) => {
    setPageId(id)
    setReady(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-bg text-base-text">
      <div className="flex min-h-screen">
        <SidePanel pages={pages} active={pageId} onNavigate={navigate} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col md:pl-64">
          <Header />
          <MobileNav pages={pages} active={pageId} onNavigate={navigate} />

          <main className="flex-1 overflow-x-hidden">
            <div
              key={pageId}
              className={`mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-8 transition-opacity duration-300 ${
                ready ? 'animate-fade-slide-up' : 'opacity-0'
              }`}
            >
              <ActivePage />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
