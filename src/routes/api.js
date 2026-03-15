import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { analyzeProject } from '../engine/decision-engine.js'
import { deployProject, exportPackage } from '../engine/deploy.js'
import { db, schema } from '../db/index.js'
import { encrypt, decrypt } from '../db/crypto.js'

const router = Router()

// POST /api/analyze — Analisa briefing e retorna plano de deploy
router.post('/api/analyze', (req, res) => {
  try {
    const { briefing } = req.body
    if (!briefing) return res.status(400).json({ error: 'Briefing obrigatorio' })
    const plan = analyzeProject(briefing)
    res.json({ success: true, plan })
  } catch (error) {
    console.error('Analyze error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/projects — Cria projeto no banco + salva briefing
router.post('/api/projects', async (req, res) => {
  try {
    const { briefing, deployMode = 'managed' } = req.body
    if (!briefing?.empresa) return res.status(400).json({ error: 'Briefing com empresa obrigatorio' })

    const plan = analyzeProject(briefing)
    const slug = (briefing.empresa || 'projeto').toLowerCase().replace(/[^a-z0-9]/g, '-')

    const [org] = await db.insert(schema.organizations).values({
      name: briefing.empresa,
      email: briefing.email_responsavel || 'sem@email.com',
      phone: briefing.whatsapp || '',
    }).returning()

    const [project] = await db.insert(schema.projects).values({
      orgId: org.id,
      name: briefing.empresa,
      slug,
      deployMode,
      crmType: plan.crmType,
      crmOther: briefing.crm_outro || null,
      agentName: briefing.nome_agente || 'Agente',
      agentType: plan.agentType,
      niche: plan.niche,
      channels: briefing.canais || ['WhatsApp'],
      config: {},
    }).returning()

    await db.insert(schema.briefings).values({ projectId: project.id, data: briefing })

    await db.insert(schema.auditLogs).values({
      orgId: org.id, projectId: project.id,
      action: 'project.create', details: { plan: plan.summary },
    })

    res.json({ success: true, project: { id: project.id, slug, name: project.name }, plan })
  } catch (error) {
    console.error('Project create error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/projects/:id/credentials
router.post('/projects/:id/credentials', async (req, res) => {
  try {
    const { id } = req.params
    const { credentials: creds } = req.body

    const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id))
    if (!project) return res.status(404).json({ error: 'Projeto nao encontrado' })

    for (const [provider, value] of Object.entries(creds)) {
      if (!value) continue
      const { encryptedData, iv, authTag } = encrypt(value)
      await db.insert(schema.credentials).values({
        orgId: project.orgId, provider,
        label: `${project.name} — ${provider}`,
        encryptedData, iv, authTag,
      })
    }

    res.json({ success: true, saved: Object.keys(creds).length })
  } catch (error) {
    console.error('Credentials error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/projects/:id/deploy
router.post('/projects/:id/deploy', async (req, res) => {
  try {
    const { id } = req.params
    const { config = {} } = req.body

    const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id))
    if (!project) return res.status(404).json({ error: 'Projeto nao encontrado' })

    const [briefingRow] = await db.select().from(schema.briefings).where(eq(schema.briefings.projectId, id))
    if (!briefingRow) return res.status(404).json({ error: 'Briefing nao encontrado' })

    const creds = await db.select().from(schema.credentials).where(eq(schema.credentials.orgId, project.orgId))
    const decryptedConfig = { ...config }
    for (const cred of creds) {
      decryptedConfig[cred.provider] = decrypt(cred.encryptedData, cred.iv, cred.authTag)
    }

    if (project.deployMode === 'managed') {
      decryptedConfig.n8n_url = decryptedConfig.n8n_url || process.env.N8N_URL
      decryptedConfig.n8n_api_key = decryptedConfig.n8n_api_key || process.env.N8N_API_KEY
    }

    const plan = analyzeProject(briefingRow.data)
    await db.update(schema.projects).set({ status: 'deploying', updatedAt: new Date() }).where(eq(schema.projects.id, id))

    const result = await deployProject(plan, briefingRow.data, decryptedConfig)

    for (const wf of result.workflows) {
      await db.insert(schema.workflows).values({
        projectId: id, templateId: wf.workflowId,
        n8nWorkflowId: wf.n8nId || null, name: wf.name,
        status: wf.status === 'created' ? 'active' : 'failed',
        deployedAt: wf.status === 'created' ? new Date() : null,
      })
    }

    const finalStatus = result.totalErrors === 0 ? 'active' : 'error'
    await db.update(schema.projects).set({ status: finalStatus, updatedAt: new Date() }).where(eq(schema.projects.id, id))

    res.json({ success: true, ...result })
  } catch (error) {
    console.error('Deploy error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/projects/:id/export
router.post('/projects/:id/export', async (req, res) => {
  try {
    const { id } = req.params
    const { config = {} } = req.body

    const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id))
    if (!project) return res.status(404).json({ error: 'Projeto nao encontrado' })

    const [briefingRow] = await db.select().from(schema.briefings).where(eq(schema.briefings.projectId, id))
    if (!briefingRow) return res.status(404).json({ error: 'Briefing nao encontrado' })

    const plan = analyzeProject(briefingRow.data)
    const pkg = exportPackage(plan, briefingRow.data, config)
    res.json({ success: true, package: pkg })
  } catch (error) {
    console.error('Export error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/projects/:id/feedback
router.post('/projects/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params
    const { reportType, description, expectedAnswer, conversationId, messageId } = req.body
    if (!reportType || !description) return res.status(400).json({ error: 'reportType e description obrigatorios' })

    const [report] = await db.insert(schema.feedbackReports).values({
      projectId: id, conversationId: conversationId || null,
      messageId: messageId || null, reportType, description,
      expectedAnswer: expectedAnswer || null,
    }).returning()

    res.json({ success: true, report })
  } catch (error) {
    console.error('Feedback error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

export default router
