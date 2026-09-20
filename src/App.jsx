import Header from './components/Header.jsx'
import SectionNav from './components/SectionNav.jsx'
import InfraMap from './components/InfraMap.jsx'
import TradeFlow from './components/TradeFlow.jsx'
import FailureSimulator from './components/FailureSimulator.jsx'
import RoadmapStrip from './components/RoadmapStrip.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-base-bg text-base-text selection:bg-build/30 selection:text-white">
      <Header />
      <SectionNav />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8">
        <section id="infra-map" className="scroll-mt-28">
          <InfraMap />
        </section>

        <section id="trade-flow" className="scroll-mt-28">
          <TradeFlow />
        </section>

        <section id="failure-sim" className="scroll-mt-28">
          <FailureSimulator />
        </section>
      </main>

      <div id="roadmap" className="scroll-mt-28">
        <RoadmapStrip />
      </div>
    </div>
  )
}

