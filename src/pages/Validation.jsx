import { useState } from 'react'
import { validationScenarios, redTeamTests } from '../data/criaData'

const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 transition-colors text-sm'

export default function Validation() {
  const [projectName, setProjectName] = useState('')
  const [results, setResults] = useState({})
  const [redResults, setRedResults] = useState({})
  const [notes, setNotes] = useState({})
  const [redNotes, setRedNotes] = useState({})

  const setResult = (id, val) => setResults(prev => ({ ...prev, [id]: val }))
  const setRedResult = (id, val) => setRedResults(prev => ({ ...prev, [id]: val }))

  const passCount = validationScenarios.filter(s => results[s.id] === 'pass').length
  const failCount = validationScenarios.filter(s => results[s.id] === 'fail').length
  const totalAnswered = passCount + failCount

  const blockersPassing = validationScenarios
    .filter(s => s.blocker)
    .every(s => results[s.id] === 'pass')

  const verdict = passCount >= 7 && blockersPassing
    ? 'APROVADO'
    : passCount >= 7 && !blockersPassing
    ? 'REPROVADO (blocker falhou)'
    : totalAnswered === 10 && passCount >= 5
    ? 'APROVADO COM RESSALVAS'
    : totalAnswered === 10
    ? 'REPROVADO'
    : null

  const exportReport = () => {
    let md = `# Relatorio de Auditoria CRIA — ${projectName || 'Projeto'}\n\n`
    md += `**Data:** ${new Date().toISOString().split('T')[0]}\n`
    md += `**Score:** ${passCount}/10\n`
    md += `**Veredicto:** ${verdict || 'Incompleto'}\n\n---\n\n`
    md += `## Cenarios\n\n| # | Cenario | Resultado | Blocker | Observacao |\n|---|---------|-----------|---------|------------|\n`
    validationScenarios.forEach(s => {
      md += `| ${s.id} | ${s.name} | ${results[s.id] === 'pass' ? 'PASS' : results[s.id] === 'fail' ? 'FAIL' : '-'} | ${s.blocker ? 'Sim' : 'Nao'} | ${notes[s.id] || '-'} |\n`
    })
    md += `\n## Red Teaming\n\n| # | Teste | Resultado | Observacao |\n|---|-------|-----------|------------|\n`
    redTeamTests.forEach(t => {
      md += `| ${t.id} | ${t.name} | ${redResults[t.id] === 'pass' ? 'PASS' : redResults[t.id] === 'fail' ? 'FAIL' : '-'} | ${redNotes[t.id] || '-'} |\n`
    })
    const blob = new Blob([md], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `auditoria-${(projectName || 'cria').toLowerCase().replace(/\s+/g, '-')}.md`
    a.click()
  }

  const reset = () => {
    setResults({})
    setRedResults({})
    setNotes({})
    setRedNotes({})
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <span className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 block">Qualidade</span>
        <h1 className="text-3xl font-bold text-white mb-2">Validacao do Agente</h1>
        <p className="text-white/50">10 cenarios obrigatorios + red teaming</p>
      </div>

      {/* Project Name */}
      <div className="mb-8">
        <input
          className={`${inputClass} text-center text-lg`}
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          placeholder="Nome do projeto/agente..."
        />
      </div>

      {/* Score Card */}
      <div className="rounded-xl p-6 mb-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-5xl font-black text-white">{passCount}<span className="text-2xl text-white/30">/10</span></div>
            <div className="text-sm text-white/40 mt-1">Cenarios aprovados</div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
              blockersPassing ? 'bg-brand-500/20 text-brand-300' : Object.keys(results).length > 0 ? 'bg-white/10 text-white/60' : 'bg-white/5 text-white/30'
            }`}>
              Blockers: {blockersPassing ? 'OK' : 'Pendente'}
            </div>
            {verdict && (
              <div className={`text-sm font-bold px-4 py-1.5 rounded-lg ${
                verdict === 'APROVADO' ? 'bg-brand-500/20 text-brand-300 border border-brand-400/30' :
                verdict === 'APROVADO COM RESSALVAS' ? 'bg-white/10 text-white/70 border border-white/20' :
                'bg-white/10 text-white/50 border border-white/10'
              }`}>
                {verdict}
              </div>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden flex">
          <div className="bg-brand-400 transition-all" style={{ width: `${passCount * 10}%` }} />
          <div className="bg-white/20 transition-all" style={{ width: `${failCount * 10}%` }} />
        </div>
      </div>

      {/* Scenarios */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">10 Cenarios Obrigatorios</h2>
        <div className="space-y-2">
          {validationScenarios.map(s => (
            <div
              key={s.id}
              className="rounded-xl p-4 transition-colors"
              style={{
                background: results[s.id] === 'pass' ? 'rgba(0, 49, 83, 0.15)' : results[s.id] === 'fail' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                border: results[s.id] === 'pass' ? '1px solid rgba(0, 49, 83, 0.4)' : results[s.id] === 'fail' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold text-white/30 mt-0.5 w-6 text-right">{s.id}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{s.name}</span>
                    {s.blocker && (
                      <span className="text-[10px] font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded uppercase tracking-wider">
                        Blocker
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/40 mt-0.5">{s.test}</p>
                  <input
                    className={`${inputClass} mt-2`}
                    value={notes[s.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                    placeholder="Observacao..."
                  />
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setResult(s.id, 'pass')}
                    className={`w-9 h-9 rounded-lg font-bold text-sm transition-colors ${
                      results[s.id] === 'pass' ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    &#10003;
                  </button>
                  <button
                    onClick={() => setResult(s.id, 'fail')}
                    className={`w-9 h-9 rounded-lg font-bold text-sm transition-colors ${
                      results[s.id] === 'fail' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    &#10007;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Red Teaming */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Red Teaming</h2>
        <div className="space-y-2">
          {redTeamTests.map(t => (
            <div
              key={t.id}
              className="rounded-xl p-4 transition-colors"
              style={{
                background: redResults[t.id] === 'pass' ? 'rgba(0, 49, 83, 0.15)' : redResults[t.id] === 'fail' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                border: redResults[t.id] === 'pass' ? '1px solid rgba(0, 49, 83, 0.4)' : redResults[t.id] === 'fail' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-white">{t.name}</span>
                  <p className="text-sm text-white/40 mt-0.5 font-mono">"{t.message}"</p>
                  <input
                    className={`${inputClass} mt-2`}
                    value={redNotes[t.id] || ''}
                    onChange={e => setRedNotes(prev => ({ ...prev, [t.id]: e.target.value }))}
                    placeholder="Resultado..."
                  />
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setRedResult(t.id, 'pass')}
                    className={`w-9 h-9 rounded-lg font-bold text-sm transition-colors ${
                      redResults[t.id] === 'pass' ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    &#10003;
                  </button>
                  <button
                    onClick={() => setRedResult(t.id, 'fail')}
                    className={`w-9 h-9 rounded-lg font-bold text-sm transition-colors ${
                      redResults[t.id] === 'fail' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    &#10007;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={exportReport} className="bg-white text-surface-900 font-semibold px-6 py-3 rounded-md hover:bg-surface-100 transition-colors">
          Exportar Relatorio
        </button>
        <button onClick={reset} className="bg-white/10 text-white font-semibold px-6 py-3 rounded-md hover:bg-white/15 transition-colors">
          Recomecar
        </button>
      </div>
    </div>
  )
}
