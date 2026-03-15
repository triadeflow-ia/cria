import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cria-briefing-draft'

const steps = [
  {
    id: 1,
    title: 'Dados da Empresa',
    description: 'Informacoes completas sobre o negocio',
    fields: [
      { name: 'empresa', label: 'Nome da empresa', type: 'text', required: true },
      { name: 'nicho', label: 'Nicho/Segmento', type: 'text', placeholder: 'ex: restaurante japones, clinica estetica, loja de roupas', required: true },
      { name: 'site', label: 'Site (URL)', type: 'url', placeholder: 'https://' },
      { name: 'instagram', label: 'Instagram (@ e numero de seguidores)', type: 'text', placeholder: 'ex: @sushidahora — 80K seguidores' },
      { name: 'facebook', label: 'Facebook', type: 'text', placeholder: '@pagina' },
      { name: 'tiktok', label: 'TikTok', type: 'text', placeholder: '@perfil' },
      { name: 'whatsapp', label: 'WhatsApp comercial (com DDD)', type: 'tel', placeholder: '+55 85 99999-9999' },
      { name: 'cidade', label: 'Cidade/Estado', type: 'text' },
      { name: 'responsavel', label: 'Responsavel pelo projeto', type: 'text', required: true },
      { name: 'email_responsavel', label: 'Email do responsavel', type: 'email', placeholder: 'email@empresa.com' },
      { name: 'telefone_responsavel', label: 'Telefone do responsavel', type: 'tel' },
      { name: 'slogan', label: 'Slogan ou frase de efeito da marca', type: 'text', placeholder: 'ex: E da hora, e Japa, e comida feita com amor!' },
      { name: 'diferenciais', label: 'Diferenciais da empresa (o que te destaca da concorrencia)', type: 'textarea', placeholder: 'O que faz sua empresa ser unica no mercado?' },
      { name: 'historia', label: 'Historia resumida da empresa', type: 'textarea', placeholder: 'Quando comecou, como cresceu, momentos marcantes...' },
    ],
  },
  {
    id: 2,
    title: 'Unidades e Locais',
    description: 'Filiais, enderecos, horarios e cobertura',
    fields: [
      { name: 'num_unidades', label: 'Quantas unidades/filiais voce tem?', type: 'select', options: ['1 (unica)', '2', '3', '4', '5', '6 ou mais', 'Empresa 100% online'] },
      { name: 'unidade_1', label: 'Unidade 1 — Nome/Bairro, Endereco, WhatsApp, Horario, Delivery/Retirada/Presencial, Link cardapio', type: 'textarea', placeholder: 'Ex:\nBarra do Ceara\nRua X, 123\nWhatsApp: (85) 99921-0061\nHorario: 17h-23h\nDelivery + Retirada\nCardapio: pedir.delivery/app/menu' },
      { name: 'unidade_2', label: 'Unidade 2 (se tiver)', type: 'textarea', placeholder: 'Mesmo formato da unidade 1...' },
      { name: 'unidade_3', label: 'Unidade 3 (se tiver)', type: 'textarea', placeholder: 'Mesmo formato...' },
      { name: 'unidade_4', label: 'Unidade 4 (se tiver)', type: 'textarea', placeholder: 'Mesmo formato...' },
      { name: 'unidade_5', label: 'Unidade 5 (se tiver)', type: 'textarea', placeholder: 'Mesmo formato...' },
      { name: 'horarios_feriados', label: 'Os horarios mudam em feriados ou finais de semana? Como?', type: 'textarea' },
      { name: 'particularidades_unidades', label: 'Alguma unidade tem particularidade diferente das outras?', type: 'textarea' },
    ],
  },
  {
    id: 3,
    title: 'Canais e Objetivo',
    description: 'Onde e para que o agente vai atuar',
    fields: [
      { name: 'canais', label: 'Canais do agente', type: 'multiselect', options: ['WhatsApp', 'Instagram DM', 'SMS', 'Web Chat', 'Facebook Messenger', 'Telegram'], required: true },
      { name: 'objetivo', label: 'Objetivo principal', type: 'select', options: ['Qualificar leads e agendar', 'Atendimento e suporte', 'Vender diretamente', 'Agendar horarios/consultas', 'Tirar duvidas e direcionar', 'Misto'], required: true },
      { name: 'horario_bot', label: 'Agente funciona 24h ou horario especifico?', type: 'select', options: ['Sim, 24h', 'Apenas horario comercial', 'Horario customizado'] },
      { name: 'horario_humano', label: 'Horario de atendimento humano', type: 'text', placeholder: 'ex: seg-sex 9h-18h' },
      { name: 'volume', label: 'Volume medio de mensagens/conversas por dia', type: 'text', placeholder: 'ex: 50-100' },
      { name: 'atendimento_atual', label: 'Como eh feito o atendimento HOJE? Descreva o processo', type: 'textarea', placeholder: 'Quem atende, como funciona, quais os passos...' },
      { name: 'ferramenta_atual', label: 'Ferramentas de atendimento atuais', type: 'multiselect', options: ['WhatsApp Business', 'GHL/GoHighLevel', 'Manychat', 'Zendesk', 'Intercom', 'Nenhuma'] },
      { name: 'maior_dor', label: 'O que mais te incomoda no atendimento atual? Qual a maior dor?', type: 'textarea', placeholder: 'Ex: demora pra responder, perde leads fora do horario, atendimento inconsistente...' },
    ],
  },
  {
    id: 4,
    title: 'Persona do Agente',
    description: 'Personalidade, tom de voz e comportamento',
    fields: [
      { name: 'nome_agente', label: 'Nome do agente', type: 'text', placeholder: 'ex: Sofia, Hiro, Ana, Carlos', required: true },
      { name: 'genero', label: 'Genero', type: 'select', options: ['Feminino', 'Masculino', 'Neutro'] },
      { name: 'tom', label: 'Tom de voz', type: 'select', options: ['Formal e profissional', 'Semi-formal e consultivo', 'Amigavel e descontraido', 'Divertido e animado', 'Tecnico e objetivo'], required: true },
      { name: 'frases_exemplo', label: 'Escreva 3 exemplos de frases no tom da sua marca', type: 'textarea', placeholder: 'Ex:\n1. Oi! Que bom ter voce aqui! Como posso ajudar? 😊\n2. Temos opcoes incriveis pra voce!\n3. Vou te passar todas as informacoes, so um instante!' },
      { name: 'emojis', label: 'Uso de emojis', type: 'select', options: ['Bastante', 'Moderado', 'Raramente', 'Nunca'] },
      { name: 'emojis_marca', label: 'Quais emojis combinam com sua marca? (3-5)', type: 'text', placeholder: 'ex: 🍣😊🔥❤️👋' },
      { name: 'tratamento', label: 'Como tratar o cliente?', type: 'select', options: ['Voce', 'Senhor(a)', 'Tu', 'Pelo nome'] },
      { name: 'revelar_ia', label: 'O agente pode revelar que eh IA?', type: 'select', options: ['Sim, sem problema', 'Apenas se perguntado', 'Nunca revelar'] },
      { name: 'bordao', label: 'Expressao, giria ou bordao que a marca usa muito', type: 'text', placeholder: 'ex: E da hora!, Bora la!, Fechou!' },
      { name: 'tamanho_respostas', label: 'Tamanho ideal das respostas', type: 'select', options: ['Curtas e diretas (1-2 frases)', 'Medias (2-3 frases)', 'Detalhadas quando necessario'] },
    ],
  },
  {
    id: 5,
    title: 'Produtos e Servicos',
    description: 'Tudo que o agente precisa conhecer sobre sua oferta',
    fields: [
      { name: 'produtos', label: 'Liste TODOS os seus produtos/servicos com descricao e preco', type: 'textarea', placeholder: 'Ex:\n1. Combo Especial — 40 pecas variadas — R$89,90\n2. Temaki Salmao — Temaki grande — R$29,90\n3. Hot Roll — 10 unidades — R$34,90', required: true },
      { name: 'categorias', label: 'Categorias dos produtos', type: 'text', placeholder: 'ex: Sushi, Temaki, Hot Rolls, Combinados, Yakisoba' },
      { name: 'carro_chefe', label: 'Qual o produto/servico mais vendido (carro-chefe)?', type: 'text' },
      { name: 'catalogo_link', label: 'Link do cardapio/catalogo digital', type: 'url', placeholder: 'https://' },
      { name: 'pode_informar_preco', label: 'Agente pode informar precos?', type: 'select', options: ['Sim, todos os precos', 'Apenas faixas de preco', 'Nao, direcionar para cardapio/vendedor'] },
      { name: 'pagamento', label: 'Formas de pagamento aceitas', type: 'multiselect', options: ['Cartao credito', 'Cartao debito', 'PIX', 'Dinheiro', 'Boleto', 'Transferencia'] },
      { name: 'pedido_minimo', label: 'Valor minimo de pedido (se tiver)', type: 'text', placeholder: 'ex: R$30,00' },
      { name: 'taxa_entrega', label: 'Taxa de entrega — como funciona?', type: 'textarea', placeholder: 'ex: Gratis acima de R$80, senao R$5-15 por distancia' },
      { name: 'precos', label: 'Tabela de precos detalhada (se nao listou acima)', type: 'textarea' },
      { name: 'promocoes', label: 'Promocoes ou ofertas ativas atualmente', type: 'textarea' },
      { name: 'fidelidade', label: 'Programa de fidelidade ou desconto para recorrentes?', type: 'textarea' },
      { name: 'restricoes_produto', label: 'Restricoes importantes (area entrega, idade, estoque)', type: 'textarea' },
      { name: 'nao_oferecer', label: 'O que o agente NAO deve oferecer ou prometer?', type: 'textarea', placeholder: 'ex: nunca inventar itens do cardapio, nunca dar desconto sem autorizacao' },
    ],
  },
  {
    id: 6,
    title: 'Processo de Venda',
    description: 'Como funciona uma venda ou atendimento ideal',
    fields: [
      { name: 'fluxo_venda', label: 'Descreva passo a passo como uma venda/atendimento ideal acontece', type: 'textarea', placeholder: 'Ex:\nPasso 1: Cliente manda oi\nPasso 2: Agente cumprimenta e pergunta como pode ajudar\nPasso 3: Pergunta qual unidade\nPasso 4: Envia link do cardapio\nPasso 5: Coleta endereco\nPasso 6: Confirma pedido', required: true },
      { name: 'dados_coletar', label: 'Quais informacoes o agente PRECISA coletar do cliente?', type: 'multiselect', options: ['Nome', 'Telefone', 'Email', 'Endereco', 'CPF', 'Empresa', 'Qual unidade', 'Cidade'], required: true },
      { name: 'agente_fecha', label: 'O agente fecha a venda sozinho ou qualifica e passa?', type: 'select', options: ['Fecha sozinho (envia link, confirma pedido)', 'Qualifica e agenda com vendedor', 'Depende do caso'] },
      { name: 'como_finaliza', label: 'Como o cliente finaliza a compra hoje?', type: 'multiselect', options: ['Link do cardapio/e-commerce', 'WhatsApp com atendente', 'Loja fisica', 'App proprio'] },
    ],
  },
  {
    id: 7,
    title: 'Qualificacao de Leads',
    description: 'Como identificar e qualificar clientes ideais',
    hint: 'Se o objetivo do agente NAO eh qualificar leads, pode preencher brevemente ou pular.',
    fields: [
      { name: 'perguntas_qualificacao', label: 'Perguntas que o agente deve fazer para qualificar (em ordem)', type: 'textarea', placeholder: 'Ex:\n1. Qual seu nome?\n2. De qual cidade voce eh?\n3. Qual produto te interessa?\n4. Para quando precisa?\n5. Qual seu orcamento?' },
      { name: 'icp', label: 'Perfil do cliente ideal (ICP) — quem eh o cliente perfeito?', type: 'textarea', placeholder: 'Descreva: regiao, faixa etaria, poder aquisitivo, necessidade...' },
      { name: 'desqualifica', label: 'O que DESQUALIFICA um lead?', type: 'textarea', placeholder: 'ex: fora da area de entrega, sem orcamento, apenas curiosidade' },
      { name: 'lead_frio', label: 'O que fazer com leads desqualificados?', type: 'select', options: ['Encerrar educadamente', 'Enviar para nutricao/conteudo', 'Indicar parceiro', 'Mensagem especifica'] },
    ],
  },
  {
    id: 8,
    title: 'Escalacao e Regras',
    description: 'Transferencia para humano, limites e proibicoes',
    fields: [
      { name: 'quando_escalar', label: 'Em quais situacoes o agente DEVE transferir para humano?', type: 'textarea', placeholder: 'ex: reclamacao, pedido complexo, negociacao de preco, duvida que nao sabe', required: true },
      { name: 'escalar_para', label: 'Para QUEM transferir? (descreva por situacao)', type: 'textarea', placeholder: 'Ex:\nReclamacao → Gerente (WhatsApp 85 99999)\nVenda complexa → Vendedor (ramal 2)\nSuporte → Equipe tecnica', required: true },
      { name: 'humano_indisponivel', label: 'Se o humano NAO estiver disponivel, o que fazer?', type: 'textarea', placeholder: 'ex: informar horario de retorno, pegar contato e prometer callback' },
      { name: 'followup', label: 'O agente deve fazer follow-up com quem nao respondeu?', type: 'select', options: ['Sim', 'Nao'] },
      { name: 'followup_tempo', label: 'Se sim, apos quanto tempo e quantas tentativas?', type: 'text', placeholder: 'ex: apos 1h, maximo 2 tentativas' },
      { name: 'max_msgs', label: 'Limite maximo de mensagens do agente antes de escalar', type: 'text', placeholder: 'ex: 15-20' },
      { name: 'assuntos_proibidos', label: 'Assuntos que o agente NUNCA deve abordar', type: 'textarea', placeholder: 'ex: politica, religiao, concorrentes, precos de outros...' },
      { name: 'falar_concorrentes', label: 'O agente pode falar sobre concorrentes?', type: 'select', options: ['Nunca', 'Apenas se perguntado', 'Sim'] },
      { name: 'protocolo_reclamacao', label: 'Como lidar com RECLAMACOES? Descreva o protocolo', type: 'textarea', placeholder: 'ex: demonstrar empatia, pedir desculpas, coletar detalhes, encaminhar ao gerente' },
      { name: 'protocolo_elogio', label: 'Como lidar com ELOGIOS?', type: 'textarea', placeholder: 'ex: agradecer com entusiasmo, convidar a seguir no Instagram' },
      { name: 'idiomas', label: 'Idiomas que o agente deve atender', type: 'multiselect', options: ['Portugues', 'Espanhol', 'Ingles'] },
    ],
  },
  {
    id: 9,
    title: 'FAQ — Perguntas Frequentes',
    description: 'As perguntas mais comuns dos clientes com respostas ideais',
    fields: [
      ...Array.from({ length: 15 }, (_, i) => ({
        name: `faq_pergunta_${i + 1}`,
        label: `Pergunta ${i + 1}`,
        type: 'text',
        placeholder: 'Pergunta frequente do cliente...',
        pair: `faq_resposta_${i + 1}`,
      })),
      ...Array.from({ length: 15 }, (_, i) => ({
        name: `faq_resposta_${i + 1}`,
        label: `Resposta ${i + 1}`,
        type: 'textarea',
        placeholder: 'Resposta ideal no tom da marca...',
        hidden: true,
      })),
    ],
  },
  {
    id: 10,
    title: 'Integracao e CRM',
    description: 'Escolha o CRM onde o agente sera integrado — isso define os workflows automaticos',
    fields: [
      { name: 'crm', label: 'Qual CRM voce quer integrar com o agente?', type: 'crm_select', options: ['Kommo', 'GHL/GoHighLevel', 'Outro'], required: true },
      { name: 'crm_outro', label: 'Qual CRM voce usa?', type: 'text', placeholder: 'ex: HubSpot, RD Station, Pipedrive, Salesforce...', condition: { field: 'crm', value: 'Outro' } },
      { name: 'kommo_subdomain', label: 'Subdominio da sua conta Kommo', type: 'text', placeholder: 'ex: suaempresa (de suaempresa.kommo.com)', condition: { field: 'crm', value: 'Kommo' } },
      { name: 'kommo_pipeline', label: 'Nome do pipeline principal', type: 'text', placeholder: 'ex: Vendas, Atendimento, Leads', condition: { field: 'crm', value: 'Kommo' } },
      { name: 'ghl_location_id', label: 'Location ID do GHL', type: 'text', placeholder: 'ex: wYddnBo2ugaSkHsO3QWk', condition: { field: 'crm', value: 'GHL/GoHighLevel' } },
      { name: 'ghl_pipeline', label: 'Nome do pipeline principal', type: 'text', placeholder: 'ex: Vendas, Atendimento, Leads', condition: { field: 'crm', value: 'GHL/GoHighLevel' } },
      { name: 'automacao', label: 'Plataforma de automacao', type: 'select', options: ['n8n', 'Zapier', 'Make', 'Manychat', 'ActiveCampaign', 'Nenhuma', 'Outra'] },
      { name: 'sistema_pedidos', label: 'Sistema de pedidos/agendamento', type: 'text', placeholder: 'ex: iFood, Degusta.ai, Calendly, Google Agenda' },
      { name: 'integracoes_necessarias', label: 'O agente precisa se integrar com algum sistema?', type: 'textarea', placeholder: 'Descreva quais sistemas e como a integracao deveria funcionar' },
      { name: 'enviar_midias', label: 'Precisa enviar imagens, PDFs ou links durante a conversa?', type: 'select', options: ['Sim', 'Nao'] },
      { name: 'midias_detalhes', label: 'Se sim, quais midias?', type: 'textarea', placeholder: 'ex: fotos dos produtos, PDF do cardapio, link de pagamento' },
    ],
  },
  {
    id: 11,
    title: 'Cenarios Especiais',
    description: 'Como o agente deve reagir em situacoes inesperadas',
    fields: [
      { name: 'fora_horario', label: 'O que o agente deve fazer FORA do horario de atendimento?', type: 'textarea', placeholder: 'ex: informar horario, coletar dados e prometer retorno' },
      { name: 'cliente_audio', label: 'O que fazer se o cliente mandar audio em vez de texto?', type: 'textarea', placeholder: 'ex: pedir gentilmente para enviar por texto' },
      { name: 'cliente_imagem', label: 'O que fazer se o cliente mandar foto/imagem?', type: 'textarea', placeholder: 'ex: agradecer e perguntar como pode ajudar' },
      { name: 'outro_idioma', label: 'Como lidar com mensagens em outro idioma?', type: 'textarea' },
      { name: 'nao_sabe', label: 'O que fazer se o cliente perguntar algo que o agente nao sabe?', type: 'textarea', placeholder: 'ex: ser honesto, dizer que vai verificar e transferir para humano' },
      { name: 'cliente_agressivo', label: 'Como lidar com clientes agressivos ou usando palavroes?', type: 'textarea', placeholder: 'ex: manter calma, nao revidar, oferecer transferir para gerente' },
      { name: 'mensagens_proativas', label: 'O agente pode enviar mensagens proativas (promocoes, lembretes)?', type: 'select', options: ['Sim', 'Nao'] },
      { name: 'proativas_detalhes', label: 'Se sim, qual tipo e frequencia?', type: 'textarea', placeholder: 'ex: promo do dia 1x por conversa, lembrete de carrinho abandonado' },
    ],
  },
  {
    id: 12,
    title: 'Metricas e Expectativas',
    description: 'O que voce espera do agente nos primeiros 30 dias',
    fields: [
      { name: 'definicao_sucesso', label: 'O que voce considera SUCESSO para este agente em 30 dias?', type: 'textarea', placeholder: 'ex: atender 80% das conversas sem humano, converter 20% dos leads' },
      { name: 'conversas_dia', label: 'Quantas conversas por dia o agente deve atender?', type: 'text', placeholder: 'ex: 50-100' },
      { name: 'taxa_conversao', label: 'Qual taxa de conversao voce espera?', type: 'text', placeholder: 'ex: 15-20%' },
      { name: 'experiencia_ruim_bot', label: 'Algo que um bot ja fez que te irritou como cliente? (para evitar)', type: 'textarea', placeholder: 'ex: ficar em loop, nao entender a pergunta, ser muito robotico' },
      { name: 'referencia_bot', label: 'Tem algum concorrente que usa bot e voce acha bom? Qual?', type: 'text' },
    ],
  },
  {
    id: 13,
    title: 'Materiais de Apoio',
    description: 'Documentos e arquivos que vao enriquecer o agente',
    fields: [
      { name: 'materiais', label: 'Quais materiais voce pode nos enviar?', type: 'multiselect', options: ['Cardapio/catalogo (PDF ou link)', 'Logo da empresa', 'Manual de identidade visual', 'Script de atendimento atual', 'Prints de conversas reais', 'Apresentacao da empresa'] },
      { name: 'materiais_links', label: 'Cole aqui links dos materiais (Google Drive, Dropbox, etc)', type: 'textarea', placeholder: 'Link 1: https://...\nLink 2: https://...' },
      { name: 'materiais_observacoes', label: 'Observacoes sobre os materiais', type: 'textarea' },
    ],
  },
  {
    id: 14,
    title: 'Observacoes Finais',
    description: 'Tudo que nao coube nas secoes anteriores',
    fields: [
      { name: 'observacoes_finais', label: 'Algo mais que devemos saber para criar o melhor agente possivel?', type: 'textarea', placeholder: 'Qualquer informacao adicional, preferencias, preocupacoes, ideias...' },
    ],
  },
]

const TOTAL_STEPS = steps.length

const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 transition-colors text-sm'

function CrmSelectInput({ field, value, onChange }) {
  const crms = [
    { id: 'Kommo', label: 'Kommo', desc: 'CRM completo com chat integrado', icon: '💬', color: 'from-blue-500/20 to-blue-600/10 border-blue-400/30' },
    { id: 'GHL/GoHighLevel', label: 'GoHighLevel', desc: 'CRM + automacao all-in-one', icon: '🚀', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/30' },
    { id: 'Outro', label: 'Outro CRM', desc: 'HubSpot, Pipedrive, RD Station...', icon: '🔧', color: 'from-white/10 to-white/5 border-white/20' },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {crms.map(crm => (
        <button
          key={crm.id}
          type="button"
          onClick={() => onChange(field.name, crm.id)}
          className={`relative p-5 rounded-xl border-2 transition-all text-left ${
            value === crm.id
              ? `bg-gradient-to-br ${crm.color} scale-[1.02] shadow-lg`
              : 'bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          {value === crm.id && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-surface-900 text-xs font-bold">✓</span>
            </div>
          )}
          <span className="text-2xl block mb-2">{crm.icon}</span>
          <span className="text-white font-semibold block text-sm">{crm.label}</span>
          <span className="text-white/40 text-xs block mt-1">{crm.desc}</span>
        </button>
      ))}
    </div>
  )
}

function FieldInput({ field, value, onChange }) {
  if (field.type === 'crm_select') {
    return <CrmSelectInput field={field} value={value} onChange={onChange} />
  }
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
  const [genPhase, setGenPhase] = useState('') // 'analyzing', 'saving', 'generating'
  const [result, setResult] = useState(null)
  const [plan, setPlan] = useState(null)
  const [projectId, setProjectId] = useState(null)
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
      // Step 1: Analyze briefing
      setGenPhase('Analisando briefing...')
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing: data }),
      })
      if (!analyzeRes.ok) throw new Error('Erro ao analisar briefing')
      const { plan: analyzedPlan } = await analyzeRes.json()
      setPlan(analyzedPlan)

      // Step 2: Save project to database
      setGenPhase('Salvando projeto...')
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing: data }),
      })
      if (projectRes.ok) {
        const { project } = await projectRes.json()
        setProjectId(project.id)
      }

      // Step 3: Generate docs with AI
      setGenPhase('Gerando documentos com IA...')
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing: data }),
      })
      if (!genRes.ok) {
        const err = await genRes.json()
        throw new Error(err.error || 'Erro ao gerar documentos')
      }
      const json = await genRes.json()
      setResult({ ...json, plan: analyzedPlan })
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
      setGenPhase('')
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

  if (result) {
    const p = result.plan
    return (
      <div className="min-h-screen bg-[#001323] text-white font-['Exo_2',sans-serif]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 block">Resultado</span>
            <h1 className="text-3xl font-bold text-white mb-2">Agente criado com sucesso</h1>
            <p className="text-white/50">
              {result.docs.length} documentos + {p?.totalWorkflows || 0} workflows para <span className="text-white font-semibold">{result.empresa}</span>
            </p>
          </div>

          {p && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-2xl mb-1">{p.crmType === 'ghl' ? '🚀' : '💬'}</div>
                <div className="text-xs text-white/40">CRM</div>
                <div className="text-sm font-semibold text-white">{p.crmType?.toUpperCase()}</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-xs text-white/40">Tipo</div>
                <div className="text-sm font-semibold text-white capitalize">{p.agentType}</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-2xl mb-1">🔧</div>
                <div className="text-xs text-white/40">Tools</div>
                <div className="text-sm font-semibold text-white">{p.tools?.length || 0}</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-xs text-white/40">Workflows</div>
                <div className="text-sm font-semibold text-white">{p.totalWorkflows}</div>
              </div>
            </div>
          )}

          {p?.workflowsToDeploy && (
            <div className="rounded-xl mb-8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="px-5 py-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white/70">Workflows que serao criados</h3>
              </div>
              <div className="divide-y divide-white/5">
                {p.workflowsToDeploy.map((wf, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-mono">{wf.type}</span>
                      <span className="text-sm text-white">{wf.name}</span>
                    </div>
                    {wf.reason && <span className="text-xs text-white/30">{wf.reason}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <button onClick={downloadAll} className="bg-white text-surface-900 font-semibold px-6 py-3 rounded-md hover:bg-surface-100 transition-colors">
              Baixar Tudo (.md)
            </button>
            <button onClick={resetAll} className="bg-white/10 text-white font-semibold px-6 py-3 rounded-md hover:bg-white/15 transition-colors">
              Novo Briefing
            </button>
          </div>

          {projectId && (
            <div className="text-center mt-6 text-xs text-white/20">
              Projeto salvo — ID: {projectId}
            </div>
          )}

          <div className="text-center mt-8 text-sm text-white/30">
            Metodo CRIA — Triadeflow &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    )
  }

  const isFaqStep = step.id === 9
  const faqFields = isFaqStep
    ? step.fields.filter(f => !f.hidden).map(f => ({
        question: f,
        answer: step.fields.find(a => a.name === f.pair),
      }))
    : null

  return (
    <div className="min-h-screen bg-[#001323] text-white font-['Exo_2',sans-serif]">
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
            {currentStep + 1}/{TOTAL_STEPS} etapas
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {currentStep === 0 && Object.keys(data).length === 0 && (
          <div className="text-center mb-10 py-6">
            <h1 className="text-3xl font-bold text-white mb-3">Briefing Completo do Agente de IA</h1>
            <p className="text-white/50 max-w-md mx-auto leading-relaxed">
              Preencha as {TOTAL_STEPS} etapas abaixo com o maximo de detalhes. Nossa IA vai gerar toda a documentacao necessaria para criar seu agente.
            </p>
            <p className="text-white/30 text-sm mt-3">Tempo estimado: 30-45 minutos</p>
          </div>
        )}

        <div className="flex items-center gap-1 mb-8">
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

        <div className="mb-8">
          <div className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">
            Etapa {step.id} de {TOTAL_STEPS}
          </div>
          <h2 className="text-2xl font-bold text-white">{step.title}</h2>
          <p className="text-sm text-white/40 mt-1">{step.description}</p>
          {step.hint && <p className="text-xs text-brand-400/60 mt-2 italic">{step.hint}</p>}
        </div>

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
            step.fields.filter(f => {
              if (f.hidden) return false
              if (f.condition) return data[f.condition.field] === f.condition.value
              return true
            }).map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {f.label} {f.required && <span className="text-brand-300">*</span>}
                </label>
                <FieldInput field={f} value={data[f.name]} onChange={onChange} />
              </div>
            ))
          )}
        </div>

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
              {generating ? (genPhase || 'Processando...') : 'Gerar com IA'}
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
