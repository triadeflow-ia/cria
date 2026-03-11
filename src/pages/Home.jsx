import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Clock, Target } from 'lucide-react'
import { phases, platforms, metrics } from '../data/criaData'

const colorMap = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-lg">🧬</span>
              <span className="text-sm font-medium text-primary-light">Framework v1.0</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
              Metodo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent">CRIA</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-3 font-semibold">
              Criacao Rapida de Inteligencia para Atendimento
            </p>
            <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Framework de 7 fases para criar agentes de IA conversacional do zero ao go-live.
              WhatsApp, Instagram, SMS, Web Chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors no-underline"
              >
                Iniciar Onboarding <ArrowRight size={18} />
              </Link>
              <Link
                to="/prompt-generator"
                className="inline-flex items-center justify-center gap-2 bg-surface-lighter hover:bg-surface-lighter/80 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors no-underline"
              >
                Gerar System Prompt
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-surface-lighter bg-surface-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="text-primary-light" size={24} />, value: '7', label: 'Fases estruturadas' },
              { icon: <Target className="text-accent" size={24} />, value: '3', label: 'Plataformas suportadas' },
              { icon: <Clock className="text-emerald-400" size={24} />, value: '5-15d', label: 'Zero ao go-live' },
              { icon: <span className="text-2xl">🧪</span>, value: '10', label: 'Cenarios de validacao' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Phases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">As 7 Fases do CRIA</h2>
          <p className="text-slate-400">Cada fase produz um entregavel especifico — sem pular etapas</p>
        </div>
        <div className="space-y-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`border rounded-xl p-5 sm:p-6 transition-all hover:scale-[1.01] ${colorMap[phase.color]}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl flex-shrink-0">{phase.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold opacity-60">FASE {phase.id}</span>
                      <span className="text-xs opacity-40">•</span>
                      <span className="text-xs opacity-60">{phase.time}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{phase.name}</h3>
                    <p className="text-sm opacity-80 mt-1">{phase.description}</p>
                  </div>
                </div>
                <div className="sm:ml-auto flex-shrink-0">
                  <div className="text-xs font-medium opacity-60 mb-1.5">Entregavel:</div>
                  <div className="text-sm font-semibold text-white bg-white/5 rounded-lg px-3 py-1.5">
                    {phase.deliverable}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {phase.tasks.map((t, i) => (
                  <span key={i} className="text-xs bg-white/5 rounded-full px-3 py-1 opacity-70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="bg-surface-light/30 border-y border-surface-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Escolha a Plataforma Certa</h2>
            <p className="text-slate-400">Use a ferramenta mais simples que resolve o problema</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {platforms.map((p) => (
              <div key={p.id} className={`border rounded-xl p-6 ${colorMap[p.color]} hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">{p.name}</h3>
                    <span className="text-xs font-medium opacity-60">{p.type}</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="opacity-60">Deploy</span><span className="text-white font-medium">{p.deployTime}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Complexidade</span><span className="text-white font-medium">{p.complexity}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Flexibilidade</span><span className="text-white font-medium">{p.flexibility}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Multi-agent</span><span className="text-white font-medium">{p.multiAgent ? 'Sim' : 'Nao'}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">RAG/KB</span><span className="text-white font-medium">{p.rag}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Gerenciado por</span><span className="text-white font-medium">{p.managedBy}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs font-medium opacity-60 mb-1">Melhor para:</div>
                  <div className="text-sm text-white">{p.bestFor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Metricas de Sucesso</h2>
          <p className="text-slate-400">O que monitorar apos o go-live</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-surface-light border border-surface-lighter rounded-xl p-5">
              <div className="text-lg font-bold text-white mb-1">{m.name}</div>
              <div className="text-sm text-slate-400 mb-3">{m.description}</div>
              <div className="inline-block bg-accent/10 text-accent-light text-sm font-semibold px-3 py-1 rounded-lg">
                Meta: {m.target}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/20 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Pronto para criar seu agente?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Comece pelo onboarding — em 15 minutos voce tera o briefing completo do seu agente.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors no-underline"
          >
            Comecar Onboarding <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
