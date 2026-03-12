import { useState } from 'react'

const steps = [
  {
    id: 1,
    title: 'Dados da Empresa',
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
    title: 'Qualificacao',
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

const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 transition-colors text-sm'

function FieldInput({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return <textarea className={`${inputClass} min-h-[80px] resize-y`} value={value || ''} onChange={e => onChange(field.name, e.target.value)} placeholder={field.placeholder} />
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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
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

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({})
  const [complete, setComplete] = useState(false)

  const step = steps[currentStep]
  const onChange = (name, value) => setData(prev => ({ ...prev, [name]: value }))

  const exportData = () => {
    let md = `# Briefing CRIA — ${data.empresa || 'Projeto'}\n\n`
    md += `**Data:** ${new Date().toISOString().split('T')[0]}\n\n---\n\n`
    steps.forEach(s => {
      md += `## ${s.title}\n\n`
      s.fields.filter(f => !f.hidden).forEach(f => {
        const val = data[f.name]
        if (val) {
          md += `**${f.label}:** ${Array.isArray(val) ? val.join(', ') : val}\n`
          if (f.pair && data[f.pair]) md += `**Resposta:** ${data[f.pair]}\n`
        }
        md += '\n'
      })
    })
    const blob = new Blob([md], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `briefing-${(data.empresa || 'cria').toLowerCase().replace(/\s+/g, '-')}.md`
    a.click()
  }

  if (complete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Briefing completo</h1>
        <p className="text-white/50 mb-8">Todas as informacoes foram coletadas. Exporte o briefing para iniciar a criacao do agente.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={exportData} className="bg-white text-surface-900 font-semibold px-6 py-3 rounded-md hover:bg-surface-100 transition-colors">
            Exportar Briefing (.md)
          </button>
          <button onClick={() => { setComplete(false); setCurrentStep(0) }} className="bg-white/10 text-white font-semibold px-6 py-3 rounded-md hover:bg-white/15 transition-colors">
            Recomecar
          </button>
        </div>
      </div>
    )
  }

  const faqFields = step.id === 7
    ? step.fields.filter(f => !f.hidden).map(f => ({
        question: f,
        answer: step.fields.find(a => a.name === f.pair),
      }))
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(i)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i < currentStep ? 'bg-brand-400' : i === currentStep ? 'bg-white' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Step Header */}
      <div className="mb-8">
        <div className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">Passo {step.id} de {steps.length}</div>
        <h1 className="text-2xl font-bold text-white">{step.title}</h1>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {faqFields ? (
          faqFields.map(({ question, answer }) => (
            <div key={question.name} className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{question.label}</label>
                <FieldInput field={question} value={data[question.name]} onChange={onChange} />
              </div>
              {answer && data[question.name] && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">{answer.label}</label>
                  <FieldInput field={{ ...answer, hidden: false }} value={data[answer.name]} onChange={onChange} />
                </div>
              )}
            </div>
          ))
        ) : (
          step.fields.filter(f => !f.hidden).map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                {f.label} {f.required && <span className="text-brand-300">*</span>}
              </label>
              <FieldInput field={f} value={data[f.name]} onChange={onChange} />
            </div>
          ))
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
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
            className="bg-white text-surface-900 font-semibold px-6 py-2.5 rounded-md hover:bg-surface-100 transition-colors"
          >
            Proximo &rarr;
          </button>
        ) : (
          <button
            onClick={() => setComplete(true)}
            className="bg-white text-surface-900 font-semibold px-6 py-2.5 rounded-md hover:bg-surface-100 transition-colors"
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  )
}
