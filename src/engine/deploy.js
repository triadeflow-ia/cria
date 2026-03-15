/**
 * CRIA Deploy Engine
 * Cria workflows no n8n via API (managed ou whitelabel)
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parameterizeTemplate, hydrateTemplate, briefingToVars } from './template-vars.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = join(__dirname, '../../docs/templates')

/**
 * Carrega template JSON do disco
 */
function loadTemplate(crmType, filename) {
  const path = join(TEMPLATES_DIR, crmType, filename)
  return JSON.parse(readFileSync(path, 'utf-8'))
}

/**
 * Cria workflow no n8n via API
 */
async function createN8nWorkflow(n8nUrl, n8nApiKey, workflowData) {
  const res = await fetch(`${n8nUrl}/api/v1/workflows`, {
    method: 'POST',
    headers: {
      'X-N8N-API-KEY': n8nApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(`n8n API error: ${err.message || res.statusText}`)
  }

  return res.json()
}

/**
 * Ativa workflow no n8n
 */
async function activateN8nWorkflow(n8nUrl, n8nApiKey, workflowId) {
  const res = await fetch(`${n8nUrl}/api/v1/workflows/${workflowId}/activate`, {
    method: 'POST',
    headers: { 'X-N8N-API-KEY': n8nApiKey },
  })

  if (!res.ok) {
    console.warn(`[Deploy] Nao conseguiu ativar workflow ${workflowId}`)
  }
}

/**
 * Deploy completo de um projeto
 *
 * @param {Object} plan - Output do analyzeProject()
 * @param {Object} briefing - Dados do briefing
 * @param {Object} config - Credenciais e config
 * @param {Object} config.n8n_url - URL do n8n
 * @param {Object} config.n8n_api_key - API key do n8n
 * @param {Object} config.* - Outras credenciais (ghl_api_token, stevo_url, etc)
 */
export async function deployProject(plan, briefing, config) {
  const n8nUrl = config.n8n_url || process.env.N8N_URL
  const n8nApiKey = config.n8n_api_key || process.env.N8N_API_KEY

  if (!n8nUrl || !n8nApiKey) {
    throw new Error('n8n URL e API Key sao obrigatorios para deploy')
  }

  // Gerar variaveis a partir do briefing
  const vars = briefingToVars(briefing, config)

  const results = []
  const projectTag = `cria-${(briefing.empresa || 'projeto').toLowerCase().replace(/[^a-z0-9]/g, '-')}`

  for (const workflow of plan.workflowsToDeploy) {
    try {
      console.log(`[Deploy] Criando: ${workflow.name}...`)

      // 1. Carregar template original
      const template = loadTemplate(plan.crmType, workflow.template)

      // 2. Parametrizar (trocar IDs hardcoded por {{VAR}})
      const parameterized = parameterizeTemplate(template, plan.crmType)

      // 3. Hidratar (preencher {{VAR}} com valores reais)
      const hydrated = hydrateTemplate(parameterized, vars)

      // 4. Preparar payload para n8n API
      const workflowPayload = {
        name: `[CRIA] [${briefing.empresa}] ${workflow.name}`,
        nodes: hydrated.nodes || [],
        connections: hydrated.connections || {},
        settings: hydrated.settings || {},
        tags: [{ name: projectTag }],
      }

      // 5. Criar no n8n
      const created = await createN8nWorkflow(n8nUrl, n8nApiKey, workflowPayload)

      results.push({
        workflowType: workflow.type,
        workflowId: workflow.id || workflow.type,
        name: workflowPayload.name,
        n8nId: created.id,
        status: 'created',
      })

      console.log(`[Deploy] Criado: ${workflowPayload.name} (${created.id})`)

    } catch (err) {
      console.error(`[Deploy] Erro em ${workflow.name}:`, err.message)
      results.push({
        workflowType: workflow.type,
        workflowId: workflow.id || workflow.type,
        name: workflow.name,
        status: 'error',
        error: err.message,
      })
    }
  }

  return {
    projectTag,
    totalDeployed: results.filter(r => r.status === 'created').length,
    totalErrors: results.filter(r => r.status === 'error').length,
    workflows: results,
  }
}

/**
 * Exporta pacote completo para import manual (white-label offline)
 */
export function exportPackage(plan, briefing, config) {
  const vars = briefingToVars(briefing, config)
  const workflows = []

  for (const workflow of plan.workflowsToDeploy) {
    const template = loadTemplate(plan.crmType, workflow.template)
    const parameterized = parameterizeTemplate(template, plan.crmType)
    const hydrated = hydrateTemplate(parameterized, vars)

    workflows.push({
      name: `[CRIA] [${briefing.empresa}] ${workflow.name}`,
      type: workflow.type,
      data: hydrated,
    })
  }

  return {
    empresa: briefing.empresa,
    crmType: plan.crmType,
    agentType: plan.agentType,
    niche: plan.niche,
    exportedAt: new Date().toISOString(),
    workflows,
    instructions: `
Instrucoes de Import:
1. Acesse seu n8n
2. Va em Workflows → Import
3. Importe cada arquivo .json da pasta workflows/
4. Configure as credenciais em cada workflow
5. Ative os workflows
    `.trim(),
  }
}
