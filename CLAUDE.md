# CRIA — Metodo de Criacao de Agentes IA Conversacional

## Status: BRIEFING + AI GENERATION PRONTO — Falta deploy Render

## O que eh
Framework de 7 fases (Metodo CRIA) para criar agentes de IA conversacional para WhatsApp, Instagram, SMS, Web Chat.
CRIA = Criacao Rapida de Inteligencia para Atendimento.

## Stack
- Frontend: React 19 + Vite 7 + Tailwind v4 + React Router + Lucide Icons
- Backend: Express + Claude API (Sonnet) para geracao de docs
- Build: `npm run build` → `dist/` (293KB JS + 34KB CSS)
- Dev frontend: `npm run dev` → http://localhost:5173 (proxy /api → 3000)
- Dev backend: `npm run dev:server` → http://localhost:3000
- Producao: `npm start` (Express serve dist/ + API)

## Paginas (5)
1. **Home** (`/`) — Landing do metodo: 7 fases, comparativo plataformas, metricas
2. **Onboarding** (`/onboarding`) — Formulario guiado 7 etapas com export .md
3. **Prompt Generator** (`/prompt-generator`) — Preenche campos → gera system prompt copiavel
4. **Validacao** (`/validation`) — 10 cenarios + red teaming com scoring + export relatorio
5. **Briefing** (`/briefing`) — **NOVO** Onboarding digital standalone + IA gera 5 docs automaticamente

## Rota /briefing (compartilhavel)
- Interface standalone (sem nav do app) — link direto para clientes
- 7 etapas completas (~40 campos) coletam TUDO do Metodo CRIA
- Auto-save no localStorage (rascunho nao se perde)
- Botao "Gerar com IA" → Claude API Sonnet → 5 docs:
  1. Persona do Agente
  2. System Prompt (pronto pra copiar)
  3. Base de Conhecimento (KB)
  4. Fluxo Conversacional
  5. Cenarios de Validacao
- Preview com tabs + copiar individual + download .md
- Download de tudo em 1 arquivo

## Estrutura
```
src/
├── components/Layout.jsx    — Header + nav + footer
├── data/criaData.js         — Dados das fases, plataformas, cenarios, metricas
├── pages/
│   ├── Home.jsx             — Landing page do metodo
│   ├── Onboarding.jsx       — Formulario multi-step (export .md)
│   ├── Briefing.jsx         — **NOVO** Onboarding digital + IA genera docs
│   ├── PromptGenerator.jsx  — Gerador de system prompt
│   └── Validation.jsx       — Checklist de validacao
├── index.css                — Tailwind v4 + tema custom
└── main.jsx                 — Router setup
server.js                    — Express backend + Claude API + SPA fallback
.env                         — ANTHROPIC_API_KEY (gitignored)
```

## Repo
- GitHub: `triadeflow-ia/cria` (privado)
- Branch: `master`

## AIOS Integration
- Agente: `@cria-master` (Cria) — `.aios-core/development/agents/cria-master.md`
- 8 tasks: cria-discovery, cria-architecture, cria-persona, cria-knowledge-base, cria-build, cria-validate, cria-launch, cria-audit
- Notion: Onboarding + Metodo CRIA completo

## Pendencias (proxima sessao)
- [ ] Deploy no Render (Web Service: build=`npm install && npm run build`, start=`npm start`)
- [ ] Env var no Render: ANTHROPIC_API_KEY
- [ ] Dominio customizado: `cria.triadeflow.ai` (CNAME no Cloudflare)
- [ ] Testar /briefing end-to-end com dados reais (2 clientes)
- [ ] Testar o @cria-master com um dos agentes que Alex precisa criar
- [ ] Squad CRIA (V2) — evolucao para multi-agent que cria agentes automaticamente
- [ ] Possivel: adicionar pagina Dashboard para gerenciar projetos de agentes

## Decisoes Tecnicas
- Dark theme (surface #0f172a) — mesmo padrao dos outros projetos Triadeflow
- Export .md nos formularios (compativel com AIOS)
- Dados centralizados em criaData.js (single source of truth)
- Backend Express leve serve dist/ + API /api/generate
- Claude Sonnet para geracao (rapido + barato, ~8K tokens por briefing)
- /briefing eh standalone (sem Layout) para ser link compartilhavel com clientes
- Auto-save localStorage para rascunhos nao se perderem
