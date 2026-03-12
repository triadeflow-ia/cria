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
app.use(express.json({ limit: '1mb' }))

// Serve static files from dist/
app.use(express.static(join(__dirname, 'dist')))

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/generate', async (req, res) => {
  try {
    const { briefing } = req.body
    if (!briefing || typeof briefing !== 'object') {
      return res.status(400).json({ error: 'Briefing data is required' })
    }

    const briefingText = formatBriefing(briefing)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: `Voce eh um especialista em criacao de agentes de IA conversacional usando o Metodo CRIA (Criacao Rapida de Inteligencia para Atendimento).

Com base no briefing completo abaixo, gere os 5 documentos necessarios para construir o agente. Seja detalhado, profissional e use as informacoes exatas do briefing.

BRIEFING DO CLIENTE:
${briefingText}

Gere os 5 documentos abaixo em formato Markdown, separados pelo delimitador ===DOC_SEPARATOR===

DOCUMENTO 1 - PERSONA DO AGENTE:
- Nome, genero, papel
- Tom de voz detalhado (com exemplos de frases)
- Regras de comportamento (DO / DON'T)
- Como se apresentar
- Como lidar com situacoes dificeis

DOCUMENTO 2 - SYSTEM PROMPT:
- System prompt completo, pronto para copiar e colar na plataforma
- Incluir: identidade, objetivo, tom, regras, escalacao, limites
- Formato otimizado para LLM

DOCUMENTO 3 - BASE DE CONHECIMENTO (KB):
- FAQ estruturada no tom da persona (todas as perguntas/respostas do briefing)
- Catalogo de produtos/servicos formatado
- Politicas (precos, pagamento, restricoes)
- Informacoes da empresa

DOCUMENTO 4 - FLUXO CONVERSACIONAL:
- Mapa de intencoes do cliente
- Fluxo principal (happy path)
- Fluxos alternativos (desqualificacao, escalacao, fora de horario)
- Regras de qualificacao (perguntas + criterios ICP)
- Regras de transferencia para humano

DOCUMENTO 5 - CENARIOS DE VALIDACAO:
- 10 cenarios de teste com mensagem simulada do cliente e resposta esperada do agente
- 5 testes de red teaming (prompt injection, manipulacao, dados sensiveis)
- Criterios de aprovacao (score minimo 7/10)

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
      fields: { empresa: 'Empresa', nicho: 'Nicho/Segmento', site: 'Site', instagram: 'Instagram', whatsapp: 'WhatsApp', cidade: 'Cidade/Estado', responsavel: 'Responsavel' }
    },
    {
      title: 'CANAIS E OBJETIVO',
      fields: { canais: 'Canais', objetivo: 'Objetivo', horario_bot: 'Horario bot', horario_humano: 'Horario humano', volume: 'Volume mensagens/dia', ferramenta_atual: 'Ferramenta atual' }
    },
    {
      title: 'PERSONA DO AGENTE',
      fields: { nome_agente: 'Nome do agente', genero: 'Genero', tom: 'Tom de voz', emojis: 'Uso de emojis', tratamento: 'Tratamento', revelar_ia: 'Revelar que eh IA' }
    },
    {
      title: 'PRODUTOS E SERVICOS',
      fields: { produtos: 'Produtos/servicos', precos: 'Precos', pode_informar_preco: 'Informar precos', pagamento: 'Formas de pagamento', promocoes: 'Promocoes', restricoes_produto: 'Restricoes' }
    },
    {
      title: 'QUALIFICACAO',
      fields: { dados_coletar: 'Dados a coletar', perguntas_qualificacao: 'Perguntas qualificacao', icp: 'ICP (cliente ideal)', desqualifica: 'Desqualifica', lead_frio: 'Lead desqualificado' }
    },
    {
      title: 'ESCALACAO E REGRAS',
      fields: { quando_escalar: 'Quando escalar', escalar_para: 'Escalar para', humano_indisponivel: 'Humano indisponivel', followup: 'Follow-up', max_msgs: 'Limite mensagens', assuntos_proibidos: 'Assuntos proibidos', idiomas: 'Idiomas' }
    },
    {
      title: 'FAQ PRINCIPAL',
      fields: {}
    }
  ]

  let text = ''
  for (const section of sections) {
    text += `\n## ${section.title}\n`
    if (section.title === 'FAQ PRINCIPAL') {
      for (let i = 1; i <= 10; i++) {
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
})
