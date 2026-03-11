import { useState } from 'react'
import { Copy, Check, RotateCcw } from 'lucide-react'

const defaultState = {
  nome_agente: '',
  papel: '',
  empresa: '',
  tom: 'Semi-formal',
  tratamento: 'Voce',
  emojis: 'Pouco',
  comprimento: 'Curto (1-2 frases)',
  objetivo: '',
  produtos: '',
  precos: '',
  horario: '',
  localizacao: '',
  perguntas: '',
  escalar_quando: '',
  escalar_para: '',
  msg_transicao: '',
  regras_extras: '',
}

export default function PromptGenerator() {
  const [form, setForm] = useState(defaultState)
  const [copied, setCopied] = useState(false)

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const prompt = `Voce eh ${form.nome_agente || '[NOME]'}, ${form.papel || '[PAPEL]'} da ${form.empresa || '[EMPRESA]'}.

## Sua Personalidade
- Tom: ${form.tom}
- Tratamento: ${form.tratamento}
- Emojis: ${form.emojis}
- Respostas: ${form.comprimento}

## Seu Objetivo
- ${form.objetivo || '[OBJETIVO PRINCIPAL]'}

## Regras INVIOLAVEIS
1. NUNCA invente informacoes. Se nao sabe, diga que vai verificar com a equipe.
2. NUNCA colete dados sensiveis (CPF, cartao de credito) pelo chat.
3. Se o cliente pedir para falar com humano, transfira IMEDIATAMENTE.
4. NUNCA fale sobre concorrentes.
5. NUNCA prometa prazos ou resultados que nao estao documentados.
6. Responda APENAS sobre assuntos relacionados a ${form.empresa || '[EMPRESA]'}.${form.regras_extras ? `\n${form.regras_extras.split('\n').map((r, i) => `${i + 7}. ${r}`).join('\n')}` : ''}

## Fluxo de Qualificacao
Faca as seguintes perguntas em ordem:
${form.perguntas ? form.perguntas.split('\n').filter(Boolean).map((q, i) => `${i + 1}. ${q}`).join('\n') : '1. [PERGUNTA 1]\n2. [PERGUNTA 2]\n3. [PERGUNTA 3]'}

## Informacoes do Negocio
- Empresa: ${form.empresa || '[EMPRESA]'}
- Produtos/Servicos: ${form.produtos || '[LISTA]'}
- Precos: ${form.precos || '[CONSULTAR COM ESPECIALISTA]'}
- Horario: ${form.horario || '[HORARIO]'}
- Localizacao: ${form.localizacao || '[LOCAL]'}

## Escalacao
Transferir para humano quando:
${form.escalar_quando ? form.escalar_quando.split('\n').filter(Boolean).map(r => `- ${r}`).join('\n') : '- Cliente pede explicitamente\n- Reclamacao ou insatisfacao\n- Lead qualificado pronto para fechar'}

Mensagem de transicao: "${form.msg_transicao || `Vou te conectar com ${form.escalar_para || 'nosso especialista'}. Ele(a) vai continuar o atendimento a partir daqui.`}"`

  const copy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = 'w-full bg-surface border border-surface-lighter rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-sm'
  const selectClass = inputClass

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <span className="text-4xl">🧠</span>
        <h1 className="text-3xl font-bold text-white mt-3 mb-2">System Prompt Generator</h1>
        <p className="text-slate-400">Preencha os campos e gere o system prompt pronto para usar</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          {/* Identity */}
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-5">
            <h3 className="text-sm font-semibold text-primary-light mb-4">🎭 Identidade</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome do agente *</label>
                <input className={inputClass} value={form.nome_agente} onChange={e => set('nome_agente', e.target.value)} placeholder="ex: Sofia" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Papel *</label>
                <input className={inputClass} value={form.papel} onChange={e => set('papel', e.target.value)} placeholder="ex: assistente de vendas" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Empresa *</label>
                <input className={inputClass} value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Nome da empresa" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Objetivo principal *</label>
                <input className={inputClass} value={form.objetivo} onChange={e => set('objetivo', e.target.value)} placeholder="ex: Qualificar leads e agendar consultas" />
              </div>
            </div>
          </div>

          {/* Tone */}
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-5">
            <h3 className="text-sm font-semibold text-primary-light mb-4">🗣️ Tom de Voz</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tom</label>
                <select className={selectClass} value={form.tom} onChange={e => set('tom', e.target.value)}>
                  {['Formal', 'Semi-formal', 'Informal', 'Consultivo', 'Amigavel'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tratamento</label>
                <select className={selectClass} value={form.tratamento} onChange={e => set('tratamento', e.target.value)}>
                  {['Voce', 'Senhor(a)', 'Tu'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Emojis</label>
                <select className={selectClass} value={form.emojis} onChange={e => set('emojis', e.target.value)}>
                  {['Nunca', 'Pouco', 'Moderado', 'Bastante'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Comprimento de resposta</label>
                <select className={selectClass} value={form.comprimento} onChange={e => set('comprimento', e.target.value)}>
                  {['Curto (1-2 frases)', 'Medio (3-4 frases)', 'Detalhado'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Business */}
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-5">
            <h3 className="text-sm font-semibold text-primary-light mb-4">📦 Negocio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Produtos/Servicos</label>
                <textarea className={`${inputClass} min-h-[60px]`} value={form.produtos} onChange={e => set('produtos', e.target.value)} placeholder="Liste os produtos..." />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Precos</label>
                  <input className={inputClass} value={form.precos} onChange={e => set('precos', e.target.value)} placeholder="Faixas ou valores" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Horario</label>
                  <input className={inputClass} value={form.horario} onChange={e => set('horario', e.target.value)} placeholder="seg-sex 9h-18h" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Localizacao</label>
                  <input className={inputClass} value={form.localizacao} onChange={e => set('localizacao', e.target.value)} placeholder="Cidade/Estado" />
                </div>
              </div>
            </div>
          </div>

          {/* Qualification */}
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-5">
            <h3 className="text-sm font-semibold text-primary-light mb-4">🎯 Qualificacao</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Perguntas de qualificacao (uma por linha)</label>
              <textarea className={`${inputClass} min-h-[100px]`} value={form.perguntas} onChange={e => set('perguntas', e.target.value)} placeholder="Qual seu interesse?&#10;Qual sua cidade?&#10;Qual seu orcamento?" />
            </div>
          </div>

          {/* Escalation */}
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-5">
            <h3 className="text-sm font-semibold text-primary-light mb-4">🔄 Escalacao</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Quando escalar (uma razao por linha)</label>
                <textarea className={`${inputClass} min-h-[80px]`} value={form.escalar_quando} onChange={e => set('escalar_quando', e.target.value)} placeholder="Cliente pede humano&#10;Reclamacao&#10;Lead qualificado" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Para quem</label>
                  <input className={inputClass} value={form.escalar_para} onChange={e => set('escalar_para', e.target.value)} placeholder="ex: equipe comercial" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Mensagem de transicao</label>
                  <input className={inputClass} value={form.msg_transicao} onChange={e => set('msg_transicao', e.target.value)} placeholder="Vou te conectar com..." />
                </div>
              </div>
            </div>
          </div>

          {/* Extra Rules */}
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-5">
            <h3 className="text-sm font-semibold text-primary-light mb-4">⚠️ Regras Extras</h3>
            <textarea className={`${inputClass} min-h-[80px]`} value={form.regras_extras} onChange={e => set('regras_extras', e.target.value)} placeholder="Uma regra por linha...&#10;ex: Nunca mencionar produto X&#10;Sempre oferecer produto Y primeiro" />
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-surface-light border border-surface-lighter rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-surface-lighter">
              <h3 className="text-sm font-semibold text-white">System Prompt</h3>
              <div className="flex gap-2">
                <button onClick={() => setForm(defaultState)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-surface-lighter transition-colors" title="Limpar">
                  <RotateCcw size={16} />
                </button>
                <button onClick={copy} className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary/20 text-primary-light hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors">
                  {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>
            </div>
            <pre className="p-5 text-sm text-slate-300 whitespace-pre-wrap max-h-[75vh] overflow-y-auto leading-relaxed font-mono">
              {prompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
