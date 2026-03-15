import { pgTable, uuid, text, varchar, timestamp, jsonb, integer, boolean, pgEnum } from 'drizzle-orm/pg-core'

// ==========================================
// ENUMS
// ==========================================

export const deployModeEnum = pgEnum('deploy_mode', ['managed', 'whitelabel'])
export const crmTypeEnum = pgEnum('crm_type', ['kommo', 'ghl', 'outro'])
export const projectStatusEnum = pgEnum('project_status', ['draft', 'generating', 'ready', 'deploying', 'active', 'paused', 'error'])
export const deployStatusEnum = pgEnum('deploy_status', ['pending', 'deploying', 'active', 'failed', 'stopped'])
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewing', 'applied', 'dismissed'])

// ==========================================
// ORGANIZACOES & USUARIOS
// ==========================================

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  plan: varchar('plan', { length: 50 }).default('free'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ==========================================
// CREDENCIAIS (CRIPTOGRAFADAS)
// ==========================================

export const credentials = pgTable('credentials', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // 'n8n', 'ghl', 'kommo', 'openai', 'stevo', 'redis'
  label: varchar('label', { length: 255 }),
  encryptedData: text('encrypted_data').notNull(), // AES-256-GCM encrypted JSON
  iv: text('iv').notNull(),
  authTag: text('auth_tag').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ==========================================
// PROJETOS (AGENTES)
// ==========================================

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  deployMode: deployModeEnum('deploy_mode').default('managed').notNull(),
  crmType: crmTypeEnum('crm_type').notNull(),
  crmOther: varchar('crm_other', { length: 100 }),
  status: projectStatusEnum('status').default('draft').notNull(),
  agentName: varchar('agent_name', { length: 100 }),
  agentType: varchar('agent_type', { length: 50 }), // 'sdr', 'atendimento', 'vendas', 'suporte'
  niche: varchar('niche', { length: 100 }),
  channels: jsonb('channels').default([]), // ['whatsapp', 'instagram']
  config: jsonb('config').default({}), // variaveis especificas (pipeline_id, location_id, etc)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ==========================================
// BRIEFINGS
// ==========================================

export const briefings = pgTable('briefings', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  data: jsonb('data').notNull(), // dados brutos do formulario (~90 campos)
  version: integer('version').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ==========================================
// DOCUMENTOS GERADOS
// ==========================================

export const generatedDocs = pgTable('generated_docs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  docType: varchar('doc_type', { length: 50 }).notNull(), // 'persona', 'system-prompt', 'knowledge-base', 'fluxo', 'cenarios'
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  version: integer('version').default(1).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ==========================================
// WORKFLOWS N8N
// ==========================================

export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  templateId: varchar('template_id', { length: 50 }).notNull(), // 'conector', 'agente', 'tool-buscar', etc
  n8nWorkflowId: varchar('n8n_workflow_id', { length: 100 }), // ID no n8n apos deploy
  name: varchar('name', { length: 255 }).notNull(),
  templateData: jsonb('template_data').default({}), // JSON do workflow com variaveis substituidas
  status: deployStatusEnum('status').default('pending').notNull(),
  deployedAt: timestamp('deployed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ==========================================
// CONVERSAS & MENSAGENS
// ==========================================

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  contactPhone: varchar('contact_phone', { length: 50 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }),
  channel: varchar('channel', { length: 50 }).default('whatsapp'),
  crmContactId: varchar('crm_contact_id', { length: 100 }),
  status: varchar('status', { length: 50 }).default('active'), // 'active', 'closed', 'transferred'
  metadata: jsonb('metadata').default({}),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
})

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'user', 'agent', 'system'
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 20 }).default('text'), // 'text', 'audio', 'image', 'document'
  toolsUsed: jsonb('tools_used').default([]),
  tokenCount: integer('token_count'),
  latencyMs: integer('latency_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ==========================================
// FEEDBACK & REFINAMENTO (AUTO-MELHORIA)
// ==========================================

export const feedbackReports = pgTable('feedback_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  messageId: uuid('message_id').references(() => messages.id),
  reportType: varchar('report_type', { length: 50 }).notNull(), // 'hallucination', 'wrong_answer', 'bad_tone', 'missing_info', 'other'
  description: text('description').notNull(),
  expectedAnswer: text('expected_answer'),
  status: reportStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const refinements = pgTable('refinements', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  feedbackId: uuid('feedback_id').references(() => feedbackReports.id),
  targetDoc: varchar('target_doc', { length: 50 }).notNull(), // 'system-prompt', 'knowledge-base', 'persona'
  changeSummary: text('change_summary').notNull(),
  beforeContent: text('before_content'),
  afterContent: text('after_content'),
  appliedBy: varchar('applied_by', { length: 50 }).default('ai'), // 'ai', 'human'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ==========================================
// ANALYTICS & LOGS
// ==========================================

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id),
  projectId: uuid('project_id').references(() => projects.id),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // 'project.create', 'workflow.deploy', 'credential.access'
  details: jsonb('details').default({}),
  ip: varchar('ip', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const agentMetrics = pgTable('agent_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  date: timestamp('date').notNull(),
  totalConversations: integer('total_conversations').default(0),
  totalMessages: integer('total_messages').default(0),
  avgResponseMs: integer('avg_response_ms'),
  transferRate: integer('transfer_rate'), // % transferido pra humano
  resolutionRate: integer('resolution_rate'), // % resolvido sem humano
  satisfactionScore: integer('satisfaction_score'), // 0-100
  hallucinationCount: integer('hallucination_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
