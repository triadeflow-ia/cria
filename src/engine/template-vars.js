/**
 * CRIA Template Variables
 * Mapeamento de todas as variaveis que precisam ser substituidas nos templates
 */

// Variaveis GHL que aparecem nos templates Clara
export const GHL_VARS = {
  // IDs do CRM
  'LImTvhcHSBl9dFiTTZfD': '{{GHL_LOCATION_ID}}',
  'afd4NA6ULMKfs8VDlaAs': '{{GHL_CALENDAR_ID}}',

  // Credenciais (node do Configuração)
  'ghl_location_id': 'ghl_location_id',    // ja eh variavel no template
  'ghl_api_token': 'ghl_api_token',        // ja eh variavel

  // Stevo (WhatsApp provider)
  'https://sm-pavao.stevo.chat': '{{STEVO_SERVER_URL}}',

  // Supabase (banco de conversas)
  'https://ekyyuvxzqmggabujofxr.supabase.co': '{{SUPABASE_URL}}',
}

// Variaveis Kommo que aparecem nos templates Petiscos
export const KOMMO_VARS = {
  // Subdominio
  'petiscosalimentos': '{{KOMMO_SUBDOMAIN}}',
  'petiscosalimentos.kommo.com': '{{KOMMO_SUBDOMAIN}}.kommo.com',
  'petiscosalimentos.amocrm.com': '{{KOMMO_SUBDOMAIN}}.amocrm.com',
}

// Variaveis compartilhadas (aparecem em ambos)
export const SHARED_VARS = {
  // Nomes do projeto
  'PETISCOS ALIMENTOS': '{{PROJECT_NAME}}',
  'Petiscos Alimentos': '{{PROJECT_NAME}}',
  'Petisco': '{{PROJECT_NAME}}',
  'Clara SDR': '{{AGENT_NAME}}',
  'clara-sdr': '{{AGENT_SLUG}}',
  'peticosia': '{{WEBHOOK_PATH}}',
}

/**
 * Substitui variaveis hardcoded por placeholders no template JSON
 */
export function parameterizeTemplate(templateJson, crmType) {
  let str = JSON.stringify(templateJson)

  // Variaveis especificas do CRM
  const crmVars = crmType === 'ghl' ? GHL_VARS : KOMMO_VARS
  for (const [hardcoded, variable] of Object.entries(crmVars)) {
    str = str.split(hardcoded).join(variable)
  }

  // Variaveis compartilhadas
  for (const [hardcoded, variable] of Object.entries(SHARED_VARS)) {
    str = str.split(hardcoded).join(variable)
  }

  return JSON.parse(str)
}

/**
 * Preenche variaveis no template com dados reais do briefing/config
 */
export function hydrateTemplate(parameterizedJson, variables) {
  let str = JSON.stringify(parameterizedJson)

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    str = str.split(placeholder).join(value || '')
  }

  // Verifica se sobrou alguma variavel nao preenchida
  const missing = str.match(/\{\{[A-Z_]+\}\}/g)
  if (missing) {
    const unique = [...new Set(missing)]
    console.warn('[CRIA] Variaveis nao preenchidas:', unique.join(', '))
  }

  return JSON.parse(str)
}

/**
 * Mapeia dados do briefing para variaveis do template
 */
export function briefingToVars(briefing, projectConfig) {
  const vars = {
    // Projeto
    PROJECT_NAME: briefing.empresa || 'Meu Projeto',
    AGENT_NAME: briefing.nome_agente || 'Agente',
    AGENT_SLUG: (briefing.nome_agente || 'agente').toLowerCase().replace(/\s+/g, '-'),
    WEBHOOK_PATH: (briefing.empresa || 'projeto').toLowerCase().replace(/[^a-z0-9]/g, '') + '-ia',

    // WhatsApp
    STEVO_SERVER_URL: projectConfig.stevo_url || '',
    STEVO_API_KEY: projectConfig.stevo_api_key || '',
    STEVO_INSTANCE: projectConfig.stevo_instance || '',

    // Banco
    SUPABASE_URL: projectConfig.supabase_url || projectConfig.database_url || '',
    SUPABASE_KEY: projectConfig.supabase_key || '',

    // OpenAI
    OPENAI_API_KEY: projectConfig.openai_api_key || '',

    // Redis
    REDIS_URL: projectConfig.redis_url || '',
  }

  // Variaveis GHL
  if (briefing.crm === 'GHL/GoHighLevel') {
    vars.GHL_LOCATION_ID = briefing.ghl_location_id || projectConfig.ghl_location_id || ''
    vars.GHL_API_TOKEN = projectConfig.ghl_api_token || ''
    vars.GHL_CALENDAR_ID = projectConfig.ghl_calendar_id || ''
    vars.GHL_PIPELINE_ID = projectConfig.ghl_pipeline_id || ''
  }

  // Variaveis Kommo
  if (briefing.crm === 'Kommo') {
    vars.KOMMO_SUBDOMAIN = briefing.kommo_subdomain || ''
    vars.KOMMO_API_TOKEN = projectConfig.kommo_api_token || ''
    vars.KOMMO_PIPELINE_ID = projectConfig.kommo_pipeline_id || ''
  }

  return vars
}
