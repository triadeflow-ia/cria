import { Link } from 'react-router-dom'
import { phases, platforms, metrics } from '../data/criaData'

export default function Home() {
  return (
    <div className="selection:bg-brand-400/30">
      {/* Hero */}
      <section className="relative pt-20 pb-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(0, 49, 83, 0.2) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full text-xs text-brand-300 mb-8">
            <span className="bg-brand-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">v1.0</span>
            <span>Framework para criacao de agentes de IA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Crie agentes de IA{' '}
            <br />
            com{' '}
            <span className="font-serif italic text-brand-300">metodo</span>
          </h1>

          <p className="max-w-2xl mx-auto text-white/50 text-lg mb-10 leading-relaxed">
            Framework de 7 fases para criar agentes conversacionais do zero ao go-live.
            WhatsApp, Instagram, SMS, Web Chat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/briefing"
              className="w-full sm:w-auto bg-white text-surface-900 px-8 py-4 rounded-md font-semibold hover:bg-surface-100 transition-all text-center no-underline"
            >
              Criar Briefing com IA
            </Link>
            <Link
              to="/onboarding"
              className="w-full sm:w-auto text-white/70 font-medium hover:text-white transition-colors no-underline"
            >
              Onboarding Manual &rarr;
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 text-white/40 text-xs font-medium uppercase tracking-widest mb-20">
            <span>7 fases estruturadas</span>
            <span>3 plataformas</span>
            <span>5-15 dias ao go-live</span>
            <span>10 cenarios de validacao</span>
          </div>
        </div>
      </section>

      {/* 7 Phases */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 block">Processo</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
              As 7 fases do{' '}
              <span className="font-serif italic text-white/50">CRIA</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">Cada fase produz um entregavel especifico. Sem pular etapas.</p>
          </div>

          <div className="space-y-3">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 49, 83, 0.5)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-300 text-sm font-bold">{phase.id}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{phase.name}</h3>
                        <span className="text-xs text-white/30">{phase.time}</span>
                      </div>
                      <p className="text-sm text-white/50">{phase.description}</p>
                    </div>
                  </div>
                  <div className="sm:ml-auto flex-shrink-0">
                    <div className="text-xs text-white/30 mb-1">Entregavel</div>
                    <div className="text-sm font-medium text-white/80 bg-white/5 rounded-lg px-3 py-1.5">
                      {phase.deliverable}
                    </div>
                  </div>
                </div>
                <div className="mt-4 ml-14 flex flex-wrap gap-2">
                  {phase.tasks.map((t, i) => (
                    <span key={i} className="text-xs bg-white/5 text-white/40 rounded-full px-3 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 block">Plataformas</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
              Escolha a plataforma{' '}
              <span className="font-serif italic text-white/50">certa</span>
            </h2>
            <p className="text-white/50">Use a ferramenta mais simples que resolve o problema</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="p-8 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 49, 83, 0.5)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <div className="mb-6">
                  <h3 className="font-bold text-white text-lg">{p.name}</h3>
                  <span className="text-xs text-white/40">{p.type}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Deploy</span><span className="text-white font-medium">{p.deployTime}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Complexidade</span><span className="text-white font-medium">{p.complexity}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Flexibilidade</span><span className="text-white font-medium">{p.flexibility}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Multi-agent</span><span className="text-white font-medium">{p.multiAgent ? 'Sim' : 'Nao'}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">RAG/KB</span><span className="text-white font-medium">{p.rag}</span></div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-xs text-white/30 mb-1">Melhor para</div>
                  <div className="text-sm text-white/70">{p.bestFor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 block">Metricas</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
              O que monitorar apos o{' '}
              <span className="font-serif italic text-white/50">go-live</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="text-lg font-bold text-white mb-1">{m.name}</div>
                <div className="text-sm text-white/40 mb-3">{m.description}</div>
                <div className="text-sm font-semibold text-brand-300">
                  Meta: {m.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className="p-12 md:p-16 rounded-3xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(0, 49, 83, 0.15) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para criar seu agente?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                Comece pelo briefing com IA — em 15 minutos voce tera toda a documentacao do seu agente gerada automaticamente.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/briefing"
                  className="bg-white text-surface-900 px-8 py-4 rounded-md font-semibold hover:bg-surface-100 transition-all no-underline"
                >
                  Criar Briefing com IA
                </Link>
                <Link
                  to="/prompt-generator"
                  className="text-white/70 font-medium hover:text-white transition-colors no-underline"
                >
                  System Prompt Generator &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
