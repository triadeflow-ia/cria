import { useState } from 'react'
import { Download, RotateCcw, Shield, AlertTriangle } from 'lucide-react'
import { validationScenarios, redTeamTests } from '../data/criaData'

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
  const score = totalAnswered > 0 ? passCount : 0

  const blockersPassing = validationScenarios
    .filter(s => s.blocker)
    .every(s => results[s.id] === 'pass')

  const verdict = score >= 7 && blockersPassing
    ? 'APROVADO'
    : score >= 7 && !blockersPassing
    ? 'REPROVADO (blocker falhou)'
    : totalAnswered === 10 && score >= 5
    ? 'APROVADO COM RESSALVAS'
    : totalAnswered === 10
    ? 'REPROVADO'
    : null

  const verdictColor = {
    'APROVADO': 'text-success bg-success/10 border-success/20',
    'APROVADO COM RESSALVAS': 'text-warning bg-warning/10 border-warning/20',
    'REPROVADO': 'text-danger bg-danger/10 border-danger/20',
    'REPROVADO (blocker falhou)': 'text-danger bg-danger/10 border-danger/20',
  }

  const exportReport = () => {
    let md = `# Relatorio de Auditoria CRIA — ${projectName || 'Projeto'}\n\n`
    md += `**Data:** ${new Date().toISOString().split('T')[0]}\n`
    md += `**Score:** ${score}/10\n`
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

  const inputClass = 'w-full bg-surface border border-surface-lighter rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-sm'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <span className="text-4xl">🧪</span>
        <h1 className="text-3xl font-bold text-white mt-3 mb-2">Validacao do Agente</h1>
        <p className="text-slate-400">10 cenarios obrigatorios + red teaming</p>
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
      <div className="bg-surface-light border border-surface-lighter rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-5xl font-black text-white">{score}<span className="text-2xl text-slate-500">/10</span></div>
            <div className="text-sm text-slate-400 mt-1">Cenarios aprovados</div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-sm font-medium px-3 py-1.5 rounded-lg ${blockersPassing ? 'bg-success/10 text-success' : Object.keys(results).length > 0 ? 'bg-danger/10 text-danger' : 'bg-surface-lighter text-slate-400'}`}>
              <Shield size={14} className="inline mr-1" />
              Blockers: {blockersPassing ? 'OK' : 'Pendente'}
            </div>
            {verdict && (
              <div className={`text-sm font-bold px-4 py-1.5 rounded-lg border ${verdictColor[verdict]}`}>
                {verdict}
              </div>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-3 bg-surface rounded-full overflow-hidden flex">
          <div className="bg-success transition-all" style={{ width: `${passCount * 10}%` }} />
          <div className="bg-danger transition-all" style={{ width: `${failCount * 10}%` }} />
        </div>
      </div>

      {/* Scenarios */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📋</span> 10 Cenarios Obrigatorios
        </h2>
        <div className="space-y-3">
          {validationScenarios.map(s => (
            <div
              key={s.id}
              className={`border rounded-xl p-4 transition-colors ${
                results[s.id] === 'pass'
                  ? 'bg-success/5 border-success/20'
                  : results[s.id] === 'fail'
                  ? 'bg-danger/5 border-danger/20'
                  : 'bg-surface-light border-surface-lighter'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg font-bold text-slate-500 mt-0.5 w-6 text-right">{s.id}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{s.name}</span>
                    {s.blocker && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-danger/10 text-danger px-2 py-0.5 rounded-full">
                        <AlertTriangle size={10} /> BLOCKER
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{s.test}</p>
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
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                      results[s.id] === 'pass' ? 'bg-success text-white' : 'bg-surface-lighter text-slate-500 hover:text-success'
                    }`}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setResult(s.id, 'fail')}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                      results[s.id] === 'fail' ? 'bg-danger text-white' : 'bg-surface-lighter text-slate-500 hover:text-danger'
                    }`}
                  >
                    ✗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Red Teaming */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🔴</span> Red Teaming
        </h2>
        <div className="space-y-3">
          {redTeamTests.map(t => (
            <div
              key={t.id}
              className={`border rounded-xl p-4 transition-colors ${
                redResults[t.id] === 'pass'
                  ? 'bg-success/5 border-success/20'
                  : redResults[t.id] === 'fail'
                  ? 'bg-danger/5 border-danger/20'
                  : 'bg-surface-light border-surface-lighter'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-white">{t.name}</span>
                  <p className="text-sm text-slate-400 mt-0.5 font-mono">"{t.message}"</p>
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
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                      redResults[t.id] === 'pass' ? 'bg-success text-white' : 'bg-surface-lighter text-slate-500 hover:text-success'
                    }`}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setRedResult(t.id, 'fail')}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                      redResults[t.id] === 'fail' ? 'bg-danger text-white' : 'bg-surface-lighter text-slate-500 hover:text-danger'
                    }`}
                  >
                    ✗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={exportReport} className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          <Download size={18} /> Exportar Relatorio
        </button>
        <button onClick={reset} className="inline-flex items-center justify-center gap-2 bg-surface-lighter hover:bg-surface-lighter/80 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          <RotateCcw size={18} /> Recomecar
        </button>
      </div>
    </div>
  )
}
