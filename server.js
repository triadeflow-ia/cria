import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Serve static files from dist/
app.use(express.static(join(__dirname, 'dist')))

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Notion direct integration (no SDK, just fetch)
const NOTION_TOKEN = process.env.NOTION_TOKEN || ''
const NOTION_DB_ID = process.env.NOTION_DB_ID || ''
if (NOTION_TOKEN && NOTION_DB_ID) console.log('[Notion] Direct API configured')

// Webhook fallback (n8n, Zapier, etc)
const WEBHOOK_URL = process.env.WEBHOOK_URL || ''
if (WEBHOOK_URL) console.log('[Webhook] Configured:', WEBHOOK_URL.slice(0, 50) + '...')

async function saveToNotion(empresa, briefingText, docsText) {
  if (!NOTION_TOKEN || !NOTION_DB_ID) return false
  try {
    // Create page in Notion database
    const blocks = []

    // Split content into chunks (Notion limit: 2000 chars per rich_text block)
    const addTextBlocks = (text, heading) => {
      if (heading) {
        blocks.push({
          object: 'block',
          type: 'heading_2',
          heading_2: { rich_text: [{ type: 'text', text: { content: heading } }] }
        })
      }
      const chunks = text.match(/.{1,1900}/gs) || [text]
      for (const chunk of chunks) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: [{ type: 'text', text: { content: chunk } }] }
        })
      }
    }

    addTextBlocks(briefingText, 'Briefing Completo')
    if (docsText) addTextBlocks(docsText, 'Documentos Gerados pela IA')

    // Notion API limit: max 100 blocks per request
    const blocksToSend = blocks.slice(0, 100)

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB_ID },
        properties: {
          title: {
            title: [{ text: { content: `Briefing — ${empresa}` } }]
          }
        },
        children: blocksToSend
      })
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[Notion] API Error:', err.message || JSON.stringify(err))
      return false
    }

    const page = await res.json()
    console.log(`[Notion] Page created: ${empresa} (${page.id})`)
    return true
  } catch (err) {
    console.error('[Notion] Error:', err.message)
    return false
  }
}

async function sendWebhook(type, data) {
  if (!WEBHOOK_URL) return
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data, timestamp: new Date().toISOString() })
    })
    console.log(`[Webhook] Sent: ${type} | ${data.empresa || ''}`)
  } catch (err) {
    console.error('[Webhook] Error:', err.message)
  }
}

// Health check — mostra status das integracoes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    notion: !!(NOTION_TOKEN && NOTION_DB_ID),
    webhook: !!WEBHOOK_URL,
    env_keys: Object.keys(process.env).filter(k => k.startsWith('NOTION') || k.startsWith('WEBHOOK') || k === 'NODE_ENV')
  })
})

app.post('/api/generate', async (req, res) => {
  try {
    const { briefing } = req.body
    if (!briefing || typeof briefing !== 'object') {
      return res.status(400).json({ error: 'Briefing data is required' })
    }

    const briefingText = formatBriefing(briefing)

    // Save briefing to Notion (non-blocking)
    saveToNotion(briefing.empresa || 'Sem nome', briefingText, null)
      .catch(err => console.error('[Notion] Background save failed:', err.message))

    // Send briefing via webhook (non-blocking)
    sendWebhook('briefing', { empresa: briefing.empresa, briefing })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 12000,
      messages: [
        {
          role: 'user',
          content: `Voce eh um especialista em criacao de agentes de IA conversacional usando o Metodo CRIA (Criacao Rapida de Inteligencia para Atendimento).

Com base no briefing completo abaixo, gere os 5 documentos necessarios para construir o agente. Seja EXTREMAMENTE detalhado, profissional e use TODAS as informacoes do briefing — cada dado fornecido deve aparecer nos documentos.

BRIEFING DO CLIENTE:
${briefingText}

Gere os 5 documentos abaixo em formato Markdown, separados pelo delimitador ===DOC_SEPARATOR===

DOCUMENTO 1 - PERSONA DO AGENTE:
- Nome, genero, papel, personalidade completa
- Tom de voz detalhado (com 5+ exemplos de frases reais)
- Emojis que usa e quando
- Regras de comportamento (DO / DON'T) — minimo 10 regras
- Como se apresentar na primeira mensagem
- Como lidar com: reclamacoes, elogios, agressividade, fora do horario
- Bordoes e expressoes da marca
- Tamanho e estilo das respostas

DOCUMENTO 2 - SYSTEM PROMPT:
- System prompt COMPLETO e EXTENSO, pronto para copiar e colar
- Incluir: identidade, objetivo, tom, regras de ouro, informacoes de todas unidades, horarios, modalidades, formas de pagamento
- Incluir FAQ embutida no prompt (todas as perguntas/respostas)
- Incluir fluxo de atendimento completo
- Incluir regras de escalacao e transferencia
- Incluir cenarios especiais (audio, imagem, fora horario, agressividade)
- Formato otimizado para LLM com secoes === marcadas

DOCUMENTO 3 - BASE DE CONHECIMENTO (KB):
- FAQ completa e estruturada no tom da persona (todas as perguntas/respostas do briefing + perguntas obvias do nicho)
- Catalogo/cardapio completo de produtos/servicos com precos
- Informacoes de CADA unidade (endereco, whatsapp, horario, cardapio, modalidades)
- Politicas (precos, pagamento, entrega, restricoes, fidelidade)
- Informacoes da empresa (historia, diferenciais, slogan, redes sociais)
- Cenarios especiais e como lidar

DOCUMENTO 4 - FLUXO CONVERSACIONAL:
- Mapa completo de intencoes do cliente (minimo 15 intencoes)
- Fluxo principal detalhado (happy path) com exemplo de conversa
- Fluxos alternativos: desqualificacao, escalacao, fora de horario, reclamacao, elogio
- Regras de qualificacao (perguntas + criterios ICP)
- Regras de transferencia para humano (quando, para quem, como)
- Fluxo de follow-up
- Tratamento de cenarios especiais

DOCUMENTO 5 - CENARIOS DE VALIDACAO:
- 15 cenarios de teste com mensagem simulada do cliente e resposta esperada do agente
- 5 testes de red teaming (prompt injection, manipulacao, dados sensiveis, fora do escopo, concorrentes)
- Criterios de aprovacao (score minimo 8/10)
- Cenarios especificos do nicho/negocio

Responda APENAS com os 5 documentos separados por ===DOC_SEPARATOR===. Comece cada documento com # Titulo.`
        }
      ]
    })

    const fullText = message.content[0].text
    const docs = fullText.split('===DOC_SEPARATOR===').map(d => d.trim()).filter(Boolean)

    const docNames = [
      'persona',
      'system-prompt',
      'knowledge-base',
      'fluxo-conversacional',
      'cenarios-validacao'
    ]

    const docTitles = [
      'Persona do Agente',
      'System Prompt',
      'Base de Conhecimento',
      'Fluxo Conversacional',
      'Cenarios de Validacao'
    ]

    const result = docs.map((content, i) => ({
      id: docNames[i] || `doc-${i + 1}`,
      title: docTitles[i] || `Documento ${i + 1}`,
      content
    }))

    // Save docs to Notion (non-blocking)
    const docsText = result.map(d => `# ${d.title}\n\n${d.content}`).join('\n\n---\n\n')
    saveToNotion(`${briefing.empresa || 'Sem nome'} — Docs IA`, '', docsText)
      .catch(err => console.error('[Notion] Docs save failed:', err.message))

    // Send via webhook (non-blocking)
    sendWebhook('docs_generated', { empresa: briefing.empresa, docs: result })

    res.json({
      success: true,
      empresa: briefing.empresa || 'Projeto',
      docs: result,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Generate error:', error.message)
    res.status(500).json({
      error: 'Falha ao gerar documentos',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

function formatBriefing(data) {
  const sections = [
    {
      title: 'DADOS DA EMPRESA',
      fields: {
        empresa: 'Empresa', nicho: 'Nicho/Segmento', site: 'Site',
        instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok',
        whatsapp: 'WhatsApp', cidade: 'Cidade/Estado',
        responsavel: 'Responsavel', email_responsavel: 'Email',
        telefone_responsavel: 'Telefone', slogan: 'Slogan',
        diferenciais: 'Diferenciais', historia: 'Historia'
      }
    },
    {
      title: 'UNIDADES E LOCAIS',
      fields: {
        num_unidades: 'Numero de unidades',
        unidade_1: 'Unidade 1', unidade_2: 'Unidade 2',
        unidade_3: 'Unidade 3', unidade_4: 'Unidade 4',
        unidade_5: 'Unidade 5',
        horarios_feriados: 'Horarios em feriados',
        particularidades_unidades: 'Particularidades'
      }
    },
    {
      title: 'CANAIS E OBJETIVO',
      fields: {
        canais: 'Canais', objetivo: 'Objetivo',
        horario_bot: 'Horario bot', horario_humano: 'Horario humano',
        volume: 'Volume mensagens/dia', atendimento_atual: 'Atendimento atual',
        ferramenta_atual: 'Ferramentas atuais', maior_dor: 'Maior dor'
      }
    },
    {
      title: 'PERSONA DO AGENTE',
      fields: {
        nome_agente: 'Nome do agente', genero: 'Genero', tom: 'Tom de voz',
        frases_exemplo: 'Exemplos de frases', emojis: 'Uso de emojis',
        emojis_marca: 'Emojis da marca', tratamento: 'Tratamento',
        revelar_ia: 'Revelar que eh IA', bordao: 'Bordao/expressao',
        tamanho_respostas: 'Tamanho das respostas'
      }
    },
    {
      title: 'PRODUTOS E SERVICOS',
      fields: {
        produtos: 'Produtos/servicos', categorias: 'Categorias',
        carro_chefe: 'Carro-chefe', catalogo_link: 'Link cardapio/catalogo',
        pode_informar_preco: 'Informar precos', pagamento: 'Formas de pagamento',
        pedido_minimo: 'Pedido minimo', taxa_entrega: 'Taxa de entrega',
        precos: 'Tabela de precos', promocoes: 'Promocoes',
        fidelidade: 'Programa fidelidade', restricoes_produto: 'Restricoes',
        nao_oferecer: 'NAO oferecer'
      }
    },
    {
      title: 'PROCESSO DE VENDA',
      fields: {
        fluxo_venda: 'Fluxo de venda/atendimento',
        dados_coletar: 'Dados a coletar', agente_fecha: 'Agente fecha venda',
        como_finaliza: 'Como finaliza compra'
      }
    },
    {
      title: 'QUALIFICACAO DE LEADS',
      fields: {
        perguntas_qualificacao: 'Perguntas qualificacao',
        icp: 'ICP (cliente ideal)', desqualifica: 'Desqualifica',
        lead_frio: 'Lead desqualificado'
      }
    },
    {
      title: 'ESCALACAO E REGRAS',
      fields: {
        quando_escalar: 'Quando escalar', escalar_para: 'Escalar para',
        humano_indisponivel: 'Humano indisponivel', followup: 'Follow-up',
        followup_tempo: 'Tempo follow-up', max_msgs: 'Limite mensagens',
        assuntos_proibidos: 'Assuntos proibidos',
        falar_concorrentes: 'Falar de concorrentes',
        protocolo_reclamacao: 'Protocolo reclamacao',
        protocolo_elogio: 'Protocolo elogio', idiomas: 'Idiomas'
      }
    },
    { title: 'FAQ PRINCIPAL', fields: {} },
    {
      title: 'INTEGRACAO E TECNOLOGIA',
      fields: {
        crm: 'CRM', crm_outro: 'CRM (outro)', automacao: 'Automacao',
        sistema_pedidos: 'Sistema pedidos/agendamento',
        integracoes_necessarias: 'Integracoes necessarias',
        enviar_midias: 'Enviar midias', midias_detalhes: 'Detalhes midias'
      }
    },
    {
      title: 'CENARIOS ESPECIAIS',
      fields: {
        fora_horario: 'Fora do horario', cliente_audio: 'Cliente envia audio',
        cliente_imagem: 'Cliente envia imagem', outro_idioma: 'Outro idioma',
        nao_sabe: 'Agente nao sabe responder',
        cliente_agressivo: 'Cliente agressivo',
        mensagens_proativas: 'Mensagens proativas',
        proativas_detalhes: 'Detalhes proativas'
      }
    },
    {
      title: 'METRICAS E EXPECTATIVAS',
      fields: {
        definicao_sucesso: 'Definicao de sucesso',
        conversas_dia: 'Conversas/dia esperadas',
        taxa_conversao: 'Taxa conversao esperada',
        experiencia_ruim_bot: 'Experiencia ruim com bot',
        referencia_bot: 'Referencia de bot bom'
      }
    },
    {
      title: 'MATERIAIS DE APOIO',
      fields: {
        materiais: 'Materiais disponiveis',
        materiais_links: 'Links dos materiais',
        materiais_observacoes: 'Observacoes'
      }
    },
    {
      title: 'OBSERVACOES FINAIS',
      fields: { observacoes_finais: 'Observacoes' }
    }
  ]

  let text = ''
  for (const section of sections) {
    text += `\n## ${section.title}\n`
    if (section.title === 'FAQ PRINCIPAL') {
      for (let i = 1; i <= 15; i++) {
        const q = data[`faq_pergunta_${i}`]
        const a = data[`faq_resposta_${i}`]
        if (q) {
          text += `- **P${i}:** ${q}\n`
          if (a) text += `  **R${i}:** ${a}\n`
        }
      }
    } else {
      for (const [key, label] of Object.entries(section.fields)) {
        const val = data[key]
        if (val) {
          text += `- **${label}:** ${Array.isArray(val) ? val.join(', ') : val}\n`
        }
      }
    }
  }
  return text
}

// SPA fallback - all routes serve index.html (Express 5 syntax)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
  } else {
    next()
  }
})

app.listen(PORT, () => {
  console.log(`CRIA server running on port ${PORT}`)
  console.log(`Notion: ${NOTION_TOKEN ? 'ON' : 'OFF'} | Webhook: ${WEBHOOK_URL ? 'ON' : 'OFF'}`)
})
