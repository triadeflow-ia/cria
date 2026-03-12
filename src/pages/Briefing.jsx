import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cria-briefing-draft'

const steps = [
  {
    id: 1,
    title: 'Dados da Empresa',
    description: 'Informacoes basicas sobre o negocio',
    fields: [
      { name: 'empresa', label: 'Nome da empresa', type: 'text', required: true },
      { name: 'nicho', label: 'Nicho/Segmento', type: 'text', placeholder: 'ex: saude, delivery, educacao', required: true },
      { name: 'site', label: 'Site (URL)', type: 'url', placeholder: 'https://' },
      { name: 'instagram', label: 'Instagram', type: 'text', placeholder: '@empresa' },
      { name: 'whatsapp', label: 'WhatsApp comercial', type: 'tel', placeholder: '+55 11 99999-9999' },
      { name: 'cidade', label: 'Cidade/Estado ou Online/Nacional', type: 'text' },
      { name: 'responsavel', label: 'Responsavel pelo projeto', type: 'text', required: true },
    ],
  },
  {
    id: 2,
    title: 'Canais e Objetivo',
    description: 'Onde e para que o agente vai atuar',
    fields: [
      { name: 'canais', label: 'Canais do agente', type: 'multiselect', options: ['WhatsApp', 'Instagram DM', 'SMS', 'Web Chat', 'Facebook Messenger'], required: true },
      { name: 'objetivo', label: 'Objetivo principal', type: 'select', options: ['Vendas', 'Suporte', 'Agendamento', 'Qualificacao de leads', 'Misto'], required: true },
      { name: 'horario_bot', label: 'Agente funciona 24h?', type: 'select', options: ['Sim, 24h', 'Apenas horario comercial'] },
      { name: 'horario_humano', label: 'Horario de atendimento humano', type: 'text', placeholder: 'ex: seg-sex 9h-18h' },
      { name: 'volume', label: 'Volume medio de mensagens/dia', type: 'text', placeholder: 'ex: 50-100' },
      { name: 'ferramenta_atual', label: 'Ferramenta atual de atendimento', type: 'text', placeholder: 'ex: GHL, ManyChat, manual' },
    ],
  },
  {
    id: 3,
    title: 'Persona do Agente',
    description: 'Personalidade e tom de voz',
    fields: [
      { name: 'nome_agente', label: 'Nome do agente', type: 'text', placeholder: 'ex: Sofia, Ana, Lucas', required: true },
      { name: 'genero', label: 'Genero', type: 'select', options: ['Feminino', 'Masculino', 'Neutro'] },
      { name: 'tom', label: 'Tom de voz', type: 'select', options: ['Formal', 'Semi-formal', 'Informal', 'Consultivo', 'Amigavel'], required: true },
      { name: 'emojis', label: 'Uso de emojis', type: 'select', options: ['Nunca', 'Pouco', 'Moderado', 'Bastante'] },
      { name: 'tratamento', label: 'Tratamento', type: 'select', options: ['Voce', 'Senhor(a)', 'Tu'] },
      { name: 'revelar_ia', label: 'Revelar que eh IA?', type: 'select', options: ['Sim, sempre', 'So se perguntarem', 'Nao revelar'] },
    ],
  },
  {
    id: 4,
    title: 'Produtos e Servicos',
    description: 'O que o agente precisa conhecer',
    fields: [
      { name: 'produtos', label: 'Principais produtos/servicos', type: 'textarea', placeholder: 'Liste os produtos que o agente deve conhecer...', required: true },
      { name: 'precos', label: 'Tabela de precos (faixas ou valores)', type: 'textarea', placeholder: 'ex: Plano Basic R$97/mes, Plano Pro R$197/mes' },
      { name: 'pode_informar_preco', label: 'Agente pode informar precos?', type: 'select', options: ['Sim, diretamente', 'Apenas faixas', 'Nao, encaminhar para humano'] },
      { name: 'pagamento', label: 'Formas de pagamento', type: 'text', placeholder: 'PIX, cartao, boleto, parcelamento...' },
      { name: 'promocoes', label: 'Promocoes ativas', type: 'textarea', placeholder: 'Descricao de ofertas atuais...' },
      { name: 'restricoes_produto', label: 'Algo que o agente NAO deve oferecer?', type: 'textarea' },
    ],
  },
  {
    id: 5,
    title: 'Qualificacao de Leads',
    description: 'Como identificar e qualificar clientes',
    fields: [
      { name: 'dados_coletar', label: 'Dados a coletar do lead', type: 'text', placeholder: 'ex: nome, email, telefone, cidade', required: true },
      { name: 'perguntas_qualificacao', label: 'Perguntas de qualificacao (max 5-6)', type: 'textarea', placeholder: 'Liste as perguntas que o agente deve fazer...', required: true },
      { name: 'icp', label: 'Perfil do cliente ideal (ICP)', type: 'textarea', placeholder: 'Descreva o lead "quente"...' },
      { name: 'desqualifica', label: 'O que desqualifica um lead?', type: 'textarea', placeholder: 'ex: sem orcamento, regiao fora de atendimento' },
      { name: 'lead_frio', label: 'O que fazer com lead desqualificado?', type: 'select', options: ['Encerrar educadamente', 'Enviar para nutricao', 'Mensagem especifica'] },
    ],
  },
  {
    id: 6,
    title: 'Escalacao e Regras',
    description: 'Limites e transferencia para humano',
    fields: [
      { name: 'quando_escalar', label: 'Quando transferir para humano?', type: 'textarea', placeholder: 'ex: lead qualificado, reclamacao, pedido complexo', required: true },
      { name: 'escalar_para', label: 'Para quem transferir?', type: 'text', placeholder: 'Nome/setor/numero', required: true },
      { name: 'humano_indisponivel', label: 'Se humano nao disponivel?', type: 'textarea', placeholder: 'ex: fila de espera, promessa de retorno em Xh' },
      { name: 'followup', label: 'Follow-up apos quanto tempo sem resposta?', type: 'text', placeholder: 'ex: 1 hora, 24 horas' },
      { name: 'max_msgs', label: 'Limite de mensagens do agente', type: 'text', placeholder: 'ex: 15-20' },
      { name: 'assuntos_proibidos', label: 'Assuntos que o agente NUNCA deve abordar', type: 'textarea' },
      { name: 'idiomas', label: 'Idiomas suportados', type: 'text', placeholder: 'ex: PT-BR, Espanhol, Ingles' },
    ],
  },
  {
    id: 7,
    title: 'FAQ Principal',
    description: 'Perguntas e respostas mais comuns',
    fields: [
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `faq_pergunta_${i + 1}`,
        label: `Pergunta ${i + 1}`,
        type: 'text',
        placeholder: 'Pergunta frequente do cliente...',
        pair: `faq_resposta_${i + 1}`,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `faq_resposta_${i + 1}`,
        label: `Resposta ${i + 1}`,
        type: 'textarea',
        placeholder: 'Resposta ideal...',
        hidden: true,
      })),
    ],
  },
]

const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 transition-colors text-sm'

function FieldInput({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return <textarea className={`${inputClass} min-h-[100px] resize-y`} value={value || ''} onChange={e => onChange(field.name, e.target.value)} placeholder={field.placeholder} />
  }
  if (field.type === 'select') {
    return (
      <select className={inputClass} value={value || ''} onChange={e => onChange(field.name, e.target.value)}>
        <option value="">Selecione...</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  }
  if (field.type === 'multiselect') {
    return (
      <div className="flex flex-wrap gap-2">
        {field.options.map(o => (
          <button
            key={o}
            type="button"
            onClick={() => {
              const arr = value || []
              onChange(field.name, arr.includes(o) ? arr.filter(x => x !== o) : [...arr, o])
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              (value || []).includes(o)
                ? 'bg-brand-500/20 border-brand-400 text-white'
                : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    )
  }
  return <input type={field.type || 'text'} className={inputClass} value={value || ''} onChange={e => onChange(field.name, e.target.value)} placeholder={field.placeholder} />
}

export default function Briefing() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({})
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [activeDoc, setActiveDoc] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setData(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data])

  const onChange = (name, value) => setData(prev => ({ ...prev, [name]: value }))

  const step = steps[currentStep]

  const filledCount = steps.reduce((acc, s) => {
    const required = s.fields.filter(f => f.required && !f.hidden)
    const filled = required.filter(f => {
      const v = data[f.name]
      return v && (Array.isArray(v) ? v.length > 0 : v.trim?.() !== '')
    })
    return acc + (required.length > 0 && filled.length === required.length ? 1 : 0)
  }, 0)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const API_URL = window.location.hostname === 'localhost'
        ? '/api/generate'
        : `${window.location.origin}/api/generate`
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing: data }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao gerar documentos')
      }
      const json = await res.json()
      setResult(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const downloadAll = () => {
    if (!result) return
    let allContent = `# Documentacao Completa — ${result.empresa}\n`
    allContent += `**Gerado em:** ${new Date(result.generatedAt).toLocaleString('pt-BR')}\n`
    allContent += `**Metodo CRIA** — Triadeflow\n\n---\n\n`
    result.docs.forEach(doc => {
      allContent += doc.content + '\n\n---\n\n'
    })
    const blob = new Blob([allContent], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cria-docs-${(result.empresa || 'projeto').toLowerCase().replace(/\s+/g, '-')}.md`
    a.click()
  }

  const copyDoc = (content) => {
    navigator.clipboard.writeText(content)
  }

  const downloadDoc = (doc) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${doc.id}.md`
    a.click()
  }

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData({})
    setResult(null)
    setCurrentStep(0)
  }

  // Results screen
  if (result) {
    return (
      <div className="min-h-screen bg-[#001323] text-white font-['Exo_2',sans-serif]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 block">Resultado</span>
            <h1 className="text-3xl font-bold text-white mb-2">Documentacao gerada</h1>
            <p className="text-white/50">
              {result.docs.length} documentos criados para <span className="text-white font-semibold">{result.empresa}</span>
            </p>
          </div>

          {/* Doc tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {result.docs.map((doc, i) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(i)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeDoc === i
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-white/3 border border-transparent text-white/40 hover:text-white hover:border-white/10'
                }`}
              >
                {doc.title}
              </button>
            ))}
          </div>

          {/* Active doc */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="font-semibold text-white">{result.docs[activeDoc]?.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => copyDoc(result.docs[activeDoc]?.content)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  Copiar
                </button>
                <button onClick={() => downloadDoc(result.docs[activeDoc])} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors">
                  Download .md
                </button>
              </div>
            </div>
            <pre className="p-5 text-sm text-white/70 whitespace-pre-wrap overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed">
              {result.docs[activeDoc]?.content}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <button onClick={downloadAll} className="bg-white text-surface-900 font-semibold px-6 py-3 rounded-md hover:bg-surface-100 transition-colors">
              Baixar Tudo (.md)
            </button>
            <button onClick={resetAll} className="bg-white/10 text-white font-semibold px-6 py-3 rounded-md hover:bg-white/15 transition-colors">
              Novo Briefing
            </button>
          </div>

          <div className="text-center mt-12 text-sm text-white/30">
            Metodo CRIA — Triadeflow &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    )
  }

  // FAQ special layout
  const faqFields = step.id === 7
    ? step.fields.filter(f => !f.hidden).map(f => ({
        question: f,
        answer: step.fields.find(a => a.name === f.pair),
      }))
    : null

  return (
    <div className="min-h-screen bg-[#001323] text-white font-['Exo_2',sans-serif]">
      {/* Header bar */}
      <header className="border-b border-white/10 bg-[#001323]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">C</span>
            </div>
            <span className="font-bold text-lg text-white">CRIA</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Briefing</span>
          </div>
          <div className="text-sm text-white/30">
            {filledCount}/7 etapas
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome message */}
        {currentStep === 0 && Object.keys(data).length === 0 && (
          <div className="text-center mb-10 py-6">
            <h1 className="text-3xl font-bold text-white mb-3">Briefing do Agente de IA</h1>
            <p className="text-white/50 max-w-md mx-auto leading-relaxed">
              Preencha as 7 etapas abaixo e nossa IA vai gerar toda a documentacao necessaria para criar seu agente.
            </p>
          </div>
        )}

        {/* Step progress */}
        <div className="flex items-center gap-1.5 mb-8">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 h-1.5 rounded-full transition-all cursor-pointer ${
                i < currentStep ? 'bg-brand-400' : i === currentStep ? 'bg-white' : 'bg-white/10'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Step header */}
        <div className="mb-8">
          <div className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">
            Etapa {step.id} de {steps.length}
          </div>
          <h2 className="text-2xl font-bold text-white">{step.title}</h2>
          <p className="text-sm text-white/40 mt-1">{step.description}</p>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {faqFields ? (
            faqFields.map(({ question, answer }) => (
              <div key={question.name} className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">{question.label}</label>
                  <FieldInput field={question} value={data[question.name]} onChange={onChange} />
                </div>
                {answer && data[question.name] && (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">{answer.label}</label>
                    <FieldInput field={{ ...answer, hidden: false }} value={data[answer.name]} onChange={onChange} />
                  </div>
                )}
              </div>
            ))
          ) : (
            step.fields.filter(f => !f.hidden).map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {f.label} {f.required && <span className="text-brand-300">*</span>}
                </label>
                <FieldInput field={f} value={data[f.name]} onChange={onChange} />
              </div>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10 pb-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="text-white/40 hover:text-white disabled:opacity-30 transition-colors font-medium"
          >
            &larr; Anterior
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-white text-surface-900 font-semibold px-6 py-3 rounded-md hover:bg-surface-100 transition-colors"
            >
              Proximo &rarr;
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-white text-surface-900 font-semibold px-8 py-3 rounded-md hover:bg-surface-100 transition-colors disabled:opacity-60"
            >
              {generating ? 'Gerando documentos...' : 'Gerar com IA'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-white/5 border border-white/10 text-white/70 rounded-xl px-5 py-4 mb-6">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
