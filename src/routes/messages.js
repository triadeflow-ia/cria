import { Router } from 'express'
import { db } from '../db/index.js'
import { sql } from 'drizzle-orm'

const router = Router()

// POST /api/messages — Salvar mensagem
router.post('/messages', async (req, res) => {
  try {
    const { phone, message_id, push_name, content, message_type, role, project_id } = req.body
    const result = await db.execute(sql`
      INSERT INTO agent_messages (phone, message_id, push_name, content, message_type, role, project_id)
      VALUES (${phone}, ${message_id}, ${push_name || null}, ${content}, ${message_type || 'text'}, ${role || 'user'}, ${project_id || null})
      ON CONFLICT (message_id) DO NOTHING
      RETURNING id, message_id
    `)
    res.json({ success: true, inserted: result.rows?.length > 0, id: result.rows?.[0]?.id })
  } catch (e) {
    console.error('Messages insert error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

// GET /api/messages/check?message_id=xxx — Verificar se msg existe
router.get('/messages/check', async (req, res) => {
  try {
    const { message_id } = req.query
    const result = await db.execute(sql`
      SELECT id FROM agent_messages WHERE message_id = ${message_id} LIMIT 1
    `)
    res.json({ exists: result.rows?.length > 0 })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/messages/last?phone=xxx — Buscar ultima msg do telefone
router.get('/messages/last', async (req, res) => {
  try {
    const { phone } = req.query
    const result = await db.execute(sql`
      SELECT * FROM agent_messages
      WHERE phone = ${phone} AND processed = false
      ORDER BY created_at DESC LIMIT 1
    `)
    res.json({ message: result.rows?.[0] || null })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/messages/pending?phone=xxx — Buscar todas msgs pendentes
router.get('/messages/pending', async (req, res) => {
  try {
    const { phone } = req.query
    const result = await db.execute(sql`
      SELECT * FROM agent_messages
      WHERE phone = ${phone} AND processed = false
      ORDER BY created_at ASC
    `)
    res.json({ messages: result.rows || [] })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// PATCH /api/messages/process?phone=xxx — Marcar como processadas
router.patch('/messages/process', async (req, res) => {
  try {
    const { phone } = req.query
    const result = await db.execute(sql`
      UPDATE agent_messages SET processed = true
      WHERE phone = ${phone} AND processed = false
    `)
    res.json({ success: true, updated: result.rowCount })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
