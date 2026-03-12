import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx'
import { writeFileSync } from 'fs'

const BLUE = '1E3A5F'
const GRAY = '666666'
const LIGHT_BG = 'F0F4F8'

function title(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: BLUE, font: 'Calibri' })]
  })
}

function subtitle(text) {
  return new Paragraph({
    spacing: { before: 100, after: 200 },
    children: [new TextRun({ text, size: 22, color: GRAY, font: 'Calibri' })]
  })
}

function sectionTitle(num, text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 500, after: 200 },
    shading: { type: 'clear', fill: LIGHT_BG },
    children: [new TextRun({ text: `${num}. ${text}`, bold: true, size: 28, color: BLUE, font: 'Calibri' })]
  })
}

function question(num, text) {
  return new Paragraph({
    spacing: { before: 200, after: 50 },
    children: [new TextRun({ text: `${num} `, bold: true, size: 22, color: BLUE, font: 'Calibri' }), new TextRun({ text, size: 22, font: 'Calibri' })]
  })
}

function answerLine() {
  return new Paragraph({
    spacing: { before: 50, after: 150 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    children: [new TextRun({ text: ' ', size: 22, font: 'Calibri' })]
  })
}

function checkboxLine(text) {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    children: [new TextRun({ text: `☐  ${text}`, size: 22, font: 'Calibri' })]
  })
}

function hint(text) {
  return new Paragraph({
    spacing: { before: 50, after: 100 },
    children: [new TextRun({ text, size: 20, italics: true, color: '999999', font: 'Calibri' })]
  })
}

function spacer() {
  return new Paragraph({ spacing: { before: 100, after: 100 }, children: [] })
}

function makeTable(headers, rows, colCount) {
  const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
  const borders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle }

  const headerRow = new TableRow({
    children: headers.map(h => new TableCell({
      shading: { fill: BLUE },
      borders,
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })]
    }))
  })

  const dataRows = rows.map(row => new TableRow({
    children: row.map(cell => new TableCell({
      borders,
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, font: 'Calibri' })] })]
    }))
  }))

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows]
  })
}

function faqBlock(num) {
  return [
    question(`${num}.`, `Pergunta frequente ${num}:`),
    answerLine(),
    new Paragraph({
      spacing: { before: 50, after: 50 },
      children: [new TextRun({ text: 'Resposta ideal:', size: 22, italics: true, color: GRAY, font: 'Calibri' })]
    }),
    answerLine(),
    answerLine(),
  ]
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22 } }
    }
  },
  sections: [{
    properties: {
      page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } }
    },
    children: [
      // HEADER
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: 'BRIEFING CRIA', bold: true, size: 48, color: BLUE, font: 'Calibri' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Formulario Completo de Coleta', size: 28, color: GRAY, font: 'Calibri' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Criacao Rapida de Inteligencia para Atendimento | Triadeflow', size: 22, color: GRAY, font: 'Calibri' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { type: 'clear', fill: LIGHT_BG },
        spacing: { before: 200, after: 400 },
        children: [
          new TextRun({ text: 'Preencha TODAS as informacoes com o maximo de detalhes.\n', size: 22, font: 'Calibri' }),
          new TextRun({ text: 'Tempo estimado: 30-45 minutos | ', size: 20, color: GRAY, font: 'Calibri' }),
          new TextRun({ text: 'Se nao souber, escreva "nao sei" — nao deixe em branco.', size: 20, color: GRAY, font: 'Calibri' }),
        ]
      }),

      // 1. DADOS DA EMPRESA
      sectionTitle('1', 'DADOS DA EMPRESA'),
      question('1.1', 'Nome da empresa:'), answerLine(),
      question('1.2', 'Nicho/Segmento (ex: restaurante japones, clinica estetica, loja de roupas):'), answerLine(),
      question('1.3', 'Site:'), answerLine(),
      question('1.4', 'Instagram (@ e numero de seguidores):'), answerLine(),
      question('1.5', 'Facebook:'), answerLine(),
      question('1.6', 'TikTok:'), answerLine(),
      question('1.7', 'WhatsApp comercial (com DDD):'), answerLine(),
      question('1.8', 'Cidade/Estado:'), answerLine(),
      question('1.9', 'Nome do responsavel pelo projeto:'), answerLine(),
      question('1.10', 'Email do responsavel:'), answerLine(),
      question('1.11', 'Telefone do responsavel:'), answerLine(),
      question('1.12', 'Slogan ou frase de efeito da marca:'), answerLine(),
      question('1.13', 'Diferenciais da empresa (o que te destaca da concorrencia):'), answerLine(), answerLine(),
      question('1.14', 'Historia resumida da empresa (quando comecou, como cresceu):'), answerLine(), answerLine(),

      // 2. UNIDADES
      sectionTitle('2', 'UNIDADES / LOCAIS DE ATENDIMENTO'),
      hint('Se tiver mais de 1 unidade, preencha a tabela. Se for 100% online, pule para a secao 3.'),
      question('2.1', 'Quantas unidades/filiais voce tem?'), answerLine(),
      question('2.2', 'Detalhes de cada unidade:'),
      makeTable(
        ['Campo', 'Unidade 1', 'Unidade 2', 'Unidade 3', 'Unidade 4', 'Unidade 5'],
        [
          ['Nome/Bairro', '', '', '', '', ''],
          ['Endereco completo', '', '', '', '', ''],
          ['WhatsApp (DDD)', '', '', '', '', ''],
          ['Telefone fixo', '', '', '', '', ''],
          ['Horario funcionamento', '', '', '', '', ''],
          ['Delivery/Retirada/Presencial', '', '', '', '', ''],
          ['Link cardapio/catalogo', '', '', '', '', ''],
          ['Area de cobertura (delivery)', '', '', '', '', ''],
        ]
      ),
      spacer(),
      question('2.3', 'Os horarios mudam em feriados ou finais de semana? Como?'), answerLine(), answerLine(),
      question('2.4', 'Alguma unidade tem particularidade diferente das outras?'), answerLine(), answerLine(),

      // 3. CANAIS E OBJETIVO
      sectionTitle('3', 'CANAIS E OBJETIVO'),
      question('3.1', 'Em quais canais o agente vai atuar?'),
      checkboxLine('WhatsApp'), checkboxLine('Instagram DM'), checkboxLine('Web Chat'), checkboxLine('SMS'),
      checkboxLine('Facebook Messenger'), checkboxLine('Telegram'), checkboxLine('Outro: ___'),
      question('3.2', 'Qual o principal objetivo do agente?'),
      checkboxLine('Qualificar leads e agendar reuniao/visita'),
      checkboxLine('Atendimento e suporte ao cliente'),
      checkboxLine('Vender produtos/servicos diretamente'),
      checkboxLine('Agendar horarios/consultas'),
      checkboxLine('Tirar duvidas e direcionar'),
      checkboxLine('Misto (descreva): ___'),
      question('3.3', 'O agente deve funcionar 24h ou apenas em horarios especificos?'), answerLine(),
      question('3.4', 'Horario de atendimento humano (quando tem gente disponivel):'), answerLine(),
      question('3.5', 'Volume medio de mensagens/conversas por dia:'), answerLine(),
      question('3.6', 'Como eh feito o atendimento HOJE? (descreva o processo atual):'), answerLine(), answerLine(), answerLine(),
      question('3.7', 'Quais ferramentas de atendimento usa atualmente?'),
      checkboxLine('WhatsApp Business'), checkboxLine('GHL/GoHighLevel'), checkboxLine('Manychat'),
      checkboxLine('Zendesk'), checkboxLine('Intercom'), checkboxLine('Nenhuma'), checkboxLine('Outra: ___'),
      question('3.8', 'O que mais te incomoda no atendimento atual? Qual a maior dor?'), answerLine(), answerLine(),

      // 4. PERSONA DO AGENTE
      sectionTitle('4', 'PERSONA DO AGENTE'),
      question('4.1', 'Nome do agente (ex: Sofia, Hiro, Ana, Carlos):'), answerLine(),
      question('4.2', 'Genero do agente:'),
      checkboxLine('Feminino'), checkboxLine('Masculino'), checkboxLine('Neutro'),
      question('4.3', 'Tom de voz desejado:'),
      checkboxLine('Formal e profissional (ex: escritorio de advocacia)'),
      checkboxLine('Semi-formal e consultivo (ex: clinica medica)'),
      checkboxLine('Amigavel e descontraido (ex: restaurante, loja)'),
      checkboxLine('Divertido e animado (ex: delivery, entretenimento)'),
      checkboxLine('Tecnico e objetivo (ex: TI, engenharia)'),
      checkboxLine('Outro: ___'),
      question('4.4', 'Escreva 3 exemplos de frases que o agente diria (no tom da sua marca):'),
      hint('Ex: "Oi! Que bom ter voce aqui! Como posso te ajudar hoje?"'),
      new Paragraph({ spacing: { before: 50 }, children: [new TextRun({ text: '1. ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: '2. ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: '3. ', size: 22, font: 'Calibri' })] }), answerLine(),
      question('4.5', 'Pode usar emojis nas respostas?'),
      checkboxLine('Sim, bastante'), checkboxLine('Sim, com moderacao'), checkboxLine('Raramente'), checkboxLine('Nunca'),
      question('4.6', 'Quais emojis combinam com sua marca? (liste 3-5):'), answerLine(),
      question('4.7', 'Como tratar o cliente?'),
      checkboxLine('Voce'), checkboxLine('Senhor(a)'), checkboxLine('Tu'), checkboxLine('Pelo nome'), checkboxLine('Outro: ___'),
      question('4.8', 'O agente pode revelar que eh uma IA?'),
      checkboxLine('Sim, sem problema'), checkboxLine('Apenas se perguntado'), checkboxLine('Nunca, deve se passar por humano'),
      question('4.9', 'Tem alguma expressao, giria ou bordao que a marca usa muito?'), answerLine(),
      question('4.10', 'Tamanho ideal das respostas:'),
      checkboxLine('Curtas e diretas (1-2 frases)'), checkboxLine('Medias (2-3 frases)'), checkboxLine('Detalhadas quando necessario'),

      // 5. PRODUTOS E SERVICOS
      sectionTitle('5', 'PRODUTOS E SERVICOS'),
      question('5.1', 'Liste TODOS os seus produtos/servicos:'),
      makeTable(
        ['#', 'Produto/Servico', 'Descricao', 'Preco/Faixa'],
        Array.from({ length: 10 }, (_, i) => [`${i + 1}`, '', '', ''])
      ),
      hint('Se tiver mais de 10, adicione em folha separada ou anexe catalogo/cardapio.'),
      question('5.2', 'Categorias dos produtos (ex: Sushi, Temaki, Hot Rolls, Combinados):'), answerLine(),
      question('5.3', 'Qual seu produto/servico mais vendido (carro-chefe)?'), answerLine(),
      question('5.4', 'Tem cardapio/catalogo digital? Qual o link?'), answerLine(),
      question('5.5', 'O agente pode informar precos?'),
      checkboxLine('Sim, todos'), checkboxLine('Apenas faixas de preco'), checkboxLine('Nao, direcionar para vendedor/cardapio'),
      question('5.6', 'Formas de pagamento aceitas:'),
      checkboxLine('Cartao credito'), checkboxLine('Cartao debito'), checkboxLine('PIX'), checkboxLine('Dinheiro'),
      checkboxLine('Boleto'), checkboxLine('Transferencia'), checkboxLine('Outro: ___'),
      question('5.7', 'Tem valor minimo de pedido? Qual?'), answerLine(),
      question('5.8', 'Tem taxa de entrega? Como funciona?'), answerLine(),
      question('5.9', 'Promocoes ou ofertas ativas atualmente:'), answerLine(), answerLine(),
      question('5.10', 'Tem programa de fidelidade ou desconto para clientes recorrentes?'), answerLine(),
      question('5.11', 'Restricoes importantes:'),
      hint('Area de entrega, idade minima, estoque limitado, etc.'),
      answerLine(), answerLine(),
      question('5.12', 'O que o agente NAO deve oferecer ou prometer?'), answerLine(),

      // 6. PROCESSO DE VENDA
      sectionTitle('6', 'PROCESSO DE VENDA / ATENDIMENTO'),
      question('6.1', 'Descreva passo a passo como uma venda/atendimento ideal acontece hoje:'),
      hint('Ex: cliente manda oi > pergunta o que quer > envia cardapio > pega endereco > fecha pedido'),
      new Paragraph({ children: [new TextRun({ text: 'Passo 1: ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: 'Passo 2: ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: 'Passo 3: ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: 'Passo 4: ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: 'Passo 5: ', size: 22, font: 'Calibri' })] }), answerLine(),
      question('6.2', 'Quais informacoes o agente PRECISA coletar do cliente?'),
      checkboxLine('Nome'), checkboxLine('Telefone'), checkboxLine('Email'), checkboxLine('Endereco'),
      checkboxLine('CPF'), checkboxLine('Empresa'), checkboxLine('Qual unidade'), checkboxLine('Outro: ___'),
      question('6.3', 'O agente fecha a venda sozinho ou qualifica e passa pra frente?'),
      checkboxLine('Fecha sozinho (envia link, confirma pedido)'),
      checkboxLine('Qualifica e agenda com vendedor/atendente'),
      checkboxLine('Depende do caso (explique): ___'),
      question('6.4', 'Como o cliente finaliza a compra hoje?'),
      checkboxLine('Link do cardapio/e-commerce'), checkboxLine('WhatsApp com atendente'),
      checkboxLine('Loja fisica'), checkboxLine('App proprio'), checkboxLine('Outro: ___'),

      // 7. QUALIFICACAO
      sectionTitle('7', 'QUALIFICACAO DE LEADS'),
      hint('Se o objetivo nao eh qualificar leads, pule para a secao 8.'),
      question('7.1', 'Perguntas que o agente deve fazer para qualificar (em ordem):'),
      new Paragraph({ children: [new TextRun({ text: '1. ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: '2. ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: '3. ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: '4. ', size: 22, font: 'Calibri' })] }), answerLine(),
      new Paragraph({ children: [new TextRun({ text: '5. ', size: 22, font: 'Calibri' })] }), answerLine(),
      question('7.2', 'Perfil do cliente ideal (ICP) — quem eh o cliente perfeito?'), answerLine(), answerLine(),
      question('7.3', 'O que DESQUALIFICA um lead?'), answerLine(), answerLine(),
      question('7.4', 'O que fazer com leads desqualificados?'),
      checkboxLine('Encerrar educadamente'), checkboxLine('Direcionar para conteudo/material'),
      checkboxLine('Indicar parceiro'), checkboxLine('Outro: ___'),

      // 8. ESCALACAO E REGRAS
      sectionTitle('8', 'ESCALACAO, TRANSFERENCIA E REGRAS'),
      question('8.1', 'Em quais situacoes o agente DEVE transferir para humano?'),
      hint('Ex: reclamacao, pedido complexo, negociacao, duvida que nao sabe'),
      answerLine(), answerLine(),
      question('8.2', 'Para QUEM transferir?'),
      makeTable(
        ['Situacao', 'Transferir para', 'Contato'],
        [
          ['Reclamacao', '', ''],
          ['Venda complexa', '', ''],
          ['Suporte tecnico', '', ''],
          ['Duvida nao respondida', '', ''],
          ['Outro:', '', ''],
        ]
      ),
      spacer(),
      question('8.3', 'Se o humano NAO estiver disponivel, o que fazer?'), answerLine(), answerLine(),
      question('8.4', 'O agente deve fazer follow-up com quem nao respondeu?'),
      checkboxLine('Sim'), checkboxLine('Nao'),
      hint('Se sim: apos quanto tempo? ___ | Quantas tentativas? ___'),
      answerLine(),
      question('8.5', 'Limite maximo de mensagens do agente antes de escalar:'), answerLine(),
      question('8.6', 'Assuntos que o agente NUNCA deve falar sobre:'), answerLine(), answerLine(),
      question('8.7', 'O agente pode falar sobre concorrentes?'),
      checkboxLine('Sim'), checkboxLine('Nao'), checkboxLine('Apenas se perguntado'),
      question('8.8', 'Idiomas que o agente deve atender:'),
      checkboxLine('Portugues'), checkboxLine('Espanhol'), checkboxLine('Ingles'), checkboxLine('Outro: ___'),
      question('8.9', 'Como lidar com RECLAMACOES? (descreva o protocolo):'), answerLine(), answerLine(), answerLine(),
      question('8.10', 'Como lidar com ELOGIOS?'), answerLine(),

      // 9. FAQ
      sectionTitle('9', 'PERGUNTAS FREQUENTES (FAQ)'),
      hint('Liste as perguntas mais comuns dos clientes com as respostas IDEAIS (como voce quer que sejam respondidas):'),
      ...Array.from({ length: 15 }, (_, i) => faqBlock(i + 1)).flat(),

      // 10. INTEGRACAO
      sectionTitle('10', 'INTEGRACAO E TECNOLOGIA'),
      question('10.1', 'Usa algum CRM? Qual?'),
      checkboxLine('GHL/GoHighLevel'), checkboxLine('HubSpot'), checkboxLine('RD Station'),
      checkboxLine('Pipedrive'), checkboxLine('Salesforce'), checkboxLine('Nenhum'), checkboxLine('Outro: ___'),
      question('10.2', 'Usa alguma plataforma de automacao?'),
      checkboxLine('n8n'), checkboxLine('Zapier'), checkboxLine('Make'), checkboxLine('Manychat'),
      checkboxLine('ActiveCampaign'), checkboxLine('Nenhuma'), checkboxLine('Outra: ___'),
      question('10.3', 'Usa sistema de pedidos/agendamento? Qual?'),
      hint('Ex: iFood, Degusta.ai, Calendly, Google Agenda'),
      answerLine(),
      question('10.4', 'O agente precisa se integrar com algum sistema?'), answerLine(), answerLine(),
      question('10.5', 'Precisa enviar imagens, PDFs ou links durante a conversa?'),
      checkboxLine('Sim (descreva): ___'), checkboxLine('Nao'),

      // 11. CENARIOS ESPECIAIS
      sectionTitle('11', 'CENARIOS ESPECIAIS'),
      question('11.1', 'O que o agente deve fazer FORA do horario de atendimento?'), answerLine(), answerLine(),
      question('11.2', 'O que fazer se o cliente mandar audio em vez de texto?'), answerLine(),
      question('11.3', 'O que fazer se o cliente mandar foto/imagem?'), answerLine(),
      question('11.4', 'Como lidar com mensagens em outro idioma?'), answerLine(),
      question('11.5', 'O que fazer se o cliente perguntar algo que o agente nao sabe?'), answerLine(), answerLine(),
      question('11.6', 'Como lidar com clientes agressivos ou usando palavroes?'), answerLine(), answerLine(),
      question('11.7', 'O agente pode enviar mensagens proativas (promocoes, lembretes)?'),
      checkboxLine('Sim'), checkboxLine('Nao'),
      hint('Se sim, com qual frequencia e tipo: ___'),
      answerLine(),

      // 12. METRICAS
      sectionTitle('12', 'METRICAS E EXPECTATIVAS'),
      question('12.1', 'O que voce considera SUCESSO para este agente em 30 dias?'), answerLine(), answerLine(),
      question('12.2', 'Quantas conversas por dia o agente deve atender?'), answerLine(),
      question('12.3', 'Qual taxa de conversao voce espera?'), answerLine(),
      question('12.4', 'Algo que um bot ja fez que te irritou como cliente? (para evitar):'), answerLine(), answerLine(),
      question('12.5', 'Tem algum concorrente que usa bot e voce acha bom? Qual?'), answerLine(),

      // 13. MATERIAIS
      sectionTitle('13', 'MATERIAIS DE APOIO'),
      question('13.1', 'Anexe ou envie junto com este documento:'),
      checkboxLine('Cardapio/catalogo digital (link ou PDF)'),
      checkboxLine('Logo da empresa'),
      checkboxLine('Manual de identidade visual'),
      checkboxLine('Script de atendimento atual'),
      checkboxLine('Prints de conversas reais com clientes (ajuda a entender o tom)'),
      checkboxLine('Apresentacao da empresa'),
      checkboxLine('Outro: ___'),

      // FINAL
      sectionTitle('14', 'OBSERVACOES FINAIS'),
      question('14.1', 'Algo mais que devemos saber para criar o melhor agente possivel?'),
      answerLine(), answerLine(), answerLine(), answerLine(),

      // FOOTER
      spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { type: 'clear', fill: LIGHT_BG },
        spacing: { before: 400, after: 100 },
        children: [new TextRun({ text: 'Apos o preenchimento, envie este documento de volta para a Triadeflow.', size: 22, font: 'Calibri' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { type: 'clear', fill: LIGHT_BG },
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Geraremos automaticamente: Persona | System Prompt | Base de Conhecimento | Fluxo Conversacional | Cenarios de Validacao', size: 20, italics: true, color: GRAY, font: 'Calibri' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { type: 'clear', fill: LIGHT_BG },
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Prazo: 24-48h apos recebimento do briefing completo.', size: 20, bold: true, color: BLUE, font: 'Calibri' })]
      }),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'Triadeflow — Metodo CRIA', bold: true, size: 24, color: BLUE, font: 'Calibri' }),
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Criacao Rapida de Inteligencia para Atendimento', size: 20, italics: true, color: GRAY, font: 'Calibri' })]
      }),
    ]
  }]
})

const buffer = await Packer.toBuffer(doc)
const outputPath = 'C:\\Users\\Alex Campos\\Projetos\\cria\\docs\\BRIEFING-CRIA-Formulario-Completo.docx'
writeFileSync(outputPath, buffer)
console.log(`DOCX gerado: ${outputPath}`)
