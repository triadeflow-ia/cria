# CRIA — SaaS de Criacao de Agentes IA Conversacional

## Status: BANCO PRONTO + TEMPLATES EXPORTADOS — Construindo motor de deploy

## O que eh
SaaS que transforma briefing em agente de IA funcional no WhatsApp.
CRIA = Criacao Rapida de Inteligencia para Atendimento.

Dois modelos:
- **Managed:** Roda na infra Triadeflow (cliente so usa)
- **White-label:** Roda na infra do cliente (ele fornece n8n, CRM, API keys)

## Stack
- Frontend: React 19 + Vite 7 + Tailwind v4 + React Router + Lucide Icons
- Backend: Express + Claude API (Sonnet) + Drizzle ORM
- Banco: PostgreSQL 16 (Railway) — zero vendor lock, migra pra Hetzner depois
- Crypto: AES-256-GCM para credenciais
- Build: `npm run build` → `dist/`
- Dev frontend: `npm run dev` → http://localhost:5173 (proxy /api → 3000)
- Dev backend: `npm run dev:server` → http://localhost:3000
- Producao: `npm start` (Express serve dist/ + API)

## Banco de Dados (13 tabelas)
```
organizations     → Empresas/agencias
users             → Usuarios com auth
credentials       → Tokens e API keys (AES-256-GCM criptografado)
projects          → Cada agente criado
briefings         → Dados brutos do formulario (~90 campos)
generated_docs    → System prompt, KB, persona, fluxos, cenarios
workflows         → Templates n8n gerados (JSON) + status deploy
conversations     → Historico de conversas
messages          → Cada mensagem (user/agent/system)
feedback_reports  → Relatos de alucinacao, respostas erradas
refinements       → Ajustes aplicados ao prompt/KB (auto-melhoria)
audit_logs        → Tudo que aconteceu (quem, quando, oque)
agent_metrics     → Performance diaria (conversas, tempo, satisfacao)
```

## Templates de Workflows

### Kommo (exportados do Petiscos Alimentos)
- `docs/templates/kommo/agente-ia.json` — AI Agent + 5 tools + Redis memory
- `docs/templates/kommo/conector-langchain-kommo.json` — Cerebro (65 nodes)
- `docs/templates/kommo/tool-consultar-cliente.json`
- `docs/templates/kommo/tool-registrar-lead.json`
- `docs/templates/kommo/tool-registrar-pedido.json`
- `docs/templates/kommo/tool-marcar-como-cliente.json`
- `docs/templates/kommo/tool-catalogo-pdf.json`
- `docs/templates/kommo/tool-parar-ia.json`
- `docs/templates/kommo/token-kommo.json`

### GHL (exportados da Clara SDR)
- `docs/templates/ghl/clara-sdr-whatsapp-ghl.json` — Cerebro (59 nodes)
- `docs/templates/ghl/clara-tools-ghl.json` — Tools unificado (29 nodes)
- `docs/templates/ghl/tool-buscar-contato.json`
- `docs/templates/ghl/tool-qualificar-lead.json`
- `docs/templates/ghl/tool-agendar-consulta.json`
- `docs/templates/ghl/tool-transferir-humano.json`

## Paginas (5)
1. **Home** (`/`) — Landing do metodo
2. **Onboarding** (`/onboarding`) — Formulario guiado com export .md
3. **Prompt Generator** (`/prompt-generator`) — Gera system prompt copiavel
4. **Validacao** (`/validation`) — 10 cenarios + red teaming
5. **Briefing** (`/briefing`) — Standalone, 14 etapas, ~90 campos, IA gera 5 docs

## Briefing Step 10 — Integracao e CRM
- Cards visuais: Kommo (azul) | GHL (verde) | Outro (cinza)
- Campos condicionais por CRM (subdominio Kommo, Location ID GHL, etc)
- Escolha determina quais workflow templates sao usados

## Fluxo do Produto
```
Briefing → IA analisa → Decide tools → Gera docs → Gera workflows → Deploy n8n → Agente funcional
```

## Estrutura
```
src/
├── components/Layout.jsx
├── data/criaData.js
├── db/
│   ├── schema.js          — 13 tabelas Drizzle ORM
│   ├── index.js            — Pool PostgreSQL + Drizzle instance
│   └── crypto.js           — AES-256-GCM encrypt/decrypt
├── pages/
│   ├── Home.jsx
│   ├── Onboarding.jsx
│   ├── Briefing.jsx        — 14 etapas + CRM selection cards
│   ├── PromptGenerator.jsx
│   └── Validation.jsx
├── index.css
└── main.jsx
docs/templates/
├── kommo/                  — 9 workflow templates
└── ghl/                    — 6 workflow templates
server.js                   — Express + Claude API + Notion + Webhook
drizzle.config.js           — Config Drizzle Kit
.env                        — DATABASE_URL, ANTHROPIC_API_KEY, ENCRYPTION_KEY (gitignored)
```

## Infra
- **Railway:** PostgreSQL (projeto `cria`, ID: fc400312-c255-44b9-9560-8886631947ae)
- **Railway:** n8n (projeto `N8N - TRIADEFLOW`, URL: primary-production-9b0e9.up.railway.app)
- **Futuro:** Migrar tudo pra Hetzner VPS (Docker Compose)

## Repo
- GitHub: `triadeflow-ia/cria` (privado)
- Branch: `master`

## Pendencias (proxima sessao)
- [ ] Parametrizar templates (trocar IDs hardcoded por {{variaveis}})
- [ ] Criar API endpoints: POST /api/projects, POST /api/deploy
- [ ] Motor de decisao (IA analisa briefing → decide tools)
- [ ] Integrar briefing → salvar no banco (organizations + projects + briefings)
- [ ] Deploy no Railway (Web Service)
- [ ] Dominio: cria.triadeflow.ai
- [ ] Dashboard do cliente (ver status, editar, monitorar)
- [ ] Sistema de feedback (reportar alucinacao → refinamento auto)
- [ ] Billing (Stripe/Asaas)

## Decisoes Tecnicas
- PostgreSQL puro (sem Supabase) — zero vendor lock
- Drizzle ORM — leve, type-safe, migrations nativas
- AES-256-GCM para credenciais — chave em env var
- Templates modulares — cada tool eh um workflow separado
- CRM-agnostico — mesmo motor, templates diferentes por CRM
- Railway agora, Hetzner depois (so muda DATABASE_URL)
