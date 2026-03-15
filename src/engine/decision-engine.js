/**
 * CRIA Decision Engine
 * Analisa briefing e decide: tipo de agente, tools necessarias, workflows
 */

// Catalogo de tools disponiveis por CRM
const TOOL_CATALOG = {
  ghl: {
    'buscar-contato': { name: 'Buscar Contato', template: 'tool-buscar-contato.json', universal: true },
    'qualificar-lead': { name: 'Qualificar Lead', template: 'tool-qualificar-lead.json', universal: true },
    'transferir-humano': { name: 'Transferir Humano', template: 'tool-transferir-humano.json', universal: true },
    'agendar-consulta': { name: 'Agendar Consulta', template: 'tool-agendar-consulta.json', niches: ['clinica', 'saude', 'estetica', 'consultoria', 'servicos'] },
    // Futuras:
    // 'registrar-pedido': { name: 'Registrar Pedido', template: 'tool-registrar-pedido.json', niches: ['restaurante', 'delivery', 'loja', 'ecommerce'] },
    // 'catalogo-pdf': { name: 'Enviar Catalogo', template: 'tool-catalogo-pdf.json', niches: ['restaurante', 'loja', 'ecommerce', 'atacado'] },
  },
  kommo: {
    'consultar-cliente': { name: 'Consultar Cliente', template: 'tool-consultar-cliente.json', universal: true },
    'registrar-lead': { name: 'Registrar Lead', template: 'tool-registrar-lead.json', universal: true },
    'registrar-pedido': { name: 'Registrar Pedido', template: 'tool-registrar-pedido.json', niches: ['restaurante', 'delivery', 'loja', 'ecommerce'] },
    'marcar-como-cliente': { name: 'Marcar como Cliente', template: 'tool-marcar-como-cliente.json', universal: true },
    'catalogo-pdf': { name: 'Enviar Catalogo', template: 'tool-catalogo-pdf.json', niches: ['restaurante', 'loja', 'ecommerce', 'atacado'] },
    'parar-ia': { name: 'Parar IA', template: 'tool-parar-ia.json', universal: true },
    'token-kommo': { name: 'Token Refresh', template: 'token-kommo.json', universal: true },
  }
}

// Workflows core por CRM
const CORE_WORKFLOWS = {
  ghl: {
    connector: { name: 'Conector WhatsApp GHL', template: 'clara-sdr-whatsapp-ghl.json' },
    agent: null, // Embutido no conector GHL
  },
  kommo: {
    connector: { name: 'Conector Langchain Kommo', template: 'conector-langchain-kommo.json' },
    agent: { name: 'Agente IA', template: 'agente-ia.json' },
  }
}

// Mapeamento de nichos do briefing para categorias de tools
const NICHE_MAP = {
  // Alimentacao
  'restaurante': 'restaurante', 'delivery': 'delivery', 'pizzaria': 'restaurante',
  'hamburgueria': 'restaurante', 'sushi': 'restaurante', 'lanchonete': 'restaurante',
  'padaria': 'restaurante', 'confeitaria': 'restaurante', 'food': 'restaurante',
  'bar': 'restaurante', 'cafeteria': 'restaurante',

  // Saude
  'clinica': 'clinica', 'consultorio': 'clinica', 'medico': 'clinica',
  'dentista': 'clinica', 'psicolog': 'clinica', 'fisio': 'clinica',
  'nutricion': 'clinica', 'veterinar': 'clinica', 'hospital': 'clinica',

  // Estetica
  'estetica': 'estetica', 'beleza': 'estetica', 'salao': 'estetica',
  'barbearia': 'estetica', 'spa': 'estetica', 'manicure': 'estetica',

  // Varejo
  'loja': 'loja', 'ecommerce': 'ecommerce', 'atacado': 'atacado',
  'roupas': 'loja', 'calcados': 'loja', 'acessorios': 'loja',
  'pet shop': 'loja', 'farmacia': 'loja', 'otica': 'loja',

  // Servicos
  'advocacia': 'servicos', 'contabilidade': 'servicos', 'consultoria': 'consultoria',
  'imobiliaria': 'servicos', 'seguro': 'servicos', 'educacao': 'servicos',
  'academia': 'servicos', 'escola': 'servicos', 'curso': 'servicos',
}

/**
 * Detecta o nicho baseado no campo nicho + empresa do briefing
 */
function detectNiche(briefing) {
  const text = `${briefing.nicho || ''} ${briefing.empresa || ''}`.toLowerCase()

  for (const [keyword, category] of Object.entries(NICHE_MAP)) {
    if (text.includes(keyword)) return category
  }

  return 'generico'
}

/**
 * Detecta o tipo de agente baseado no objetivo do briefing
 */
function detectAgentType(briefing) {
  const objetivo = (briefing.objetivo || '').toLowerCase()

  if (objetivo.includes('qualificar') || objetivo.includes('agendar')) return 'sdr'
  if (objetivo.includes('vender')) return 'vendas'
  if (objetivo.includes('suporte') || objetivo.includes('atendimento')) return 'atendimento'
  if (objetivo.includes('agendar')) return 'agendamento'

  return 'misto'
}

/**
 * Decide quais tools sao necessarias baseado no briefing
 */
function selectTools(briefing, crmType) {
  const niche = detectNiche(briefing)
  const catalog = TOOL_CATALOG[crmType] || {}
  const selected = []

  for (const [toolId, tool] of Object.entries(catalog)) {
    // Tools universais sempre entram
    if (tool.universal) {
      selected.push({ id: toolId, ...tool, reason: 'universal' })
      continue
    }

    // Tools de nicho entram se o nicho bater
    if (tool.niches && tool.niches.includes(niche)) {
      selected.push({ id: toolId, ...tool, reason: `nicho: ${niche}` })
      continue
    }

    // Agendamento entra se objetivo mencionar agendar
    if (toolId === 'agendar-consulta' && briefing.objetivo?.toLowerCase().includes('agendar')) {
      selected.push({ id: toolId, ...tool, reason: 'objetivo: agendamento' })
    }
  }

  return selected
}

/**
 * Motor principal de decisao
 * Recebe briefing → retorna plano completo de deploy
 */
export function analyzeProject(briefing) {
  // Detectar CRM
  const crmRaw = briefing.crm || ''
  const crmType = crmRaw.toLowerCase().includes('ghl') || crmRaw.toLowerCase().includes('gohighlevel')
    ? 'ghl'
    : crmRaw.toLowerCase().includes('kommo')
      ? 'kommo'
      : 'outro'

  // Detectar nicho e tipo
  const niche = detectNiche(briefing)
  const agentType = detectAgentType(briefing)

  // Selecionar tools
  const tools = selectTools(briefing, crmType)

  // Selecionar workflows core
  const core = CORE_WORKFLOWS[crmType] || CORE_WORKFLOWS.ghl

  // Montar lista de workflows para deploy
  const workflowsToDeploy = []

  // Connector (sempre)
  if (core.connector) {
    workflowsToDeploy.push({
      type: 'connector',
      ...core.connector,
    })
  }

  // Agent (separado no Kommo, embutido no GHL)
  if (core.agent) {
    workflowsToDeploy.push({
      type: 'agent',
      ...core.agent,
    })
  }

  // Tools
  for (const tool of tools) {
    workflowsToDeploy.push({
      type: 'tool',
      id: tool.id,
      name: tool.name,
      template: tool.template,
      reason: tool.reason,
    })
  }

  return {
    crmType,
    niche,
    agentType,
    agentName: briefing.nome_agente || 'Agente',
    empresa: briefing.empresa || 'Projeto',
    channels: briefing.canais || ['WhatsApp'],
    tools,
    workflowsToDeploy,
    totalWorkflows: workflowsToDeploy.length,
    summary: `Agente ${agentType} para ${niche} no ${crmType.toUpperCase()} — ${tools.length} tools, ${workflowsToDeploy.length} workflows`,
  }
}
