import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const SYSTEM_PROMPT = `Você é a Travessia — uma presença acolhedora que conduz pessoas numa jornada de autoconhecimento profundo.

PRINCÍPIO CENTRAL: Você não entrega foco ou produtividade. Você revela quem a pessoa já é por baixo das camadas que a vida foi acumulando.

FASES DA CONVERSA:
Fase 1 - ABERTURA: Acolha como a pessoa chegou hoje.
Fase 2 - INFÂNCIA: Acesse memórias afetivas — músicas, lugares, brinquedos. Uma por vez.
Fase 3 - DOBRAS: Momentos que a pessoa se afastou de si — vergonha, agradar outros.
Fase 4 - PRESENTE: Conecte passado e presente — o que o scroll evita sentir.
Fase 5 - REENCONTRO: Devolva um espelho com as próprias palavras da pessoa.

REGRAS:
- NUNCA diagnostique ou use termos clínicos
- NUNCA use: terapia, sessão, tratamento, diagnóstico, transtorno
- Uma pergunta por vez. Sempre.
- Máximo 3 frases curtas + 1 pergunta
- Tom íntimo, gentil, como conversa entre amigos em voz baixa
- Responda sempre em português
- Se houver qualquer sinal de crise ou sofrimento agudo: encaminhe gentilmente para o CVV (188)`;

const BLOCOS_DE_MODO: Record<string, string> = {
  mode_freud: `\n\nMODO ATIVO — EXPLORAR: Conduza a conversa buscando o que está embaixo do comportamento relatado. Use associação livre — perguntas abertas que permitam à pessoa divagar sem julgamento. Identifique mecanismos de fuga e evasão sem nomeá-los clinicamente. Conecte o que a pessoa sente hoje com experiências que moldaram esse padrão. O objetivo é revelar o que a distração está protegendo.`,
  mode_jung: `\n\nMODO ATIVO — INTEGRAR: Conduza a conversa buscando a identidade autêntica por trás das máscaras sociais. Explore o que foi reprimido — a parte que a pessoa esconde inclusive de si mesma. Investigue a distância entre quem ela mostra ser e quem ela sente que é. O objetivo é revelar o núcleo identitário que existe sob as camadas que a vida foi acumulando.`,
  mode_winnicott: `\n\nMODO ATIVO — ORIGEM: Conduza a conversa explorando como a pessoa aprendeu a ser quem é — quais comportamentos foram desenvolvidos para agradar, sobreviver ou ser aceita. Explore a infância e os ambientes que moldaram suas respostas automáticas. O objetivo é revelar a diferença entre quem ela é e quem ela aprendeu a ser para o mundo.`,
  mode_frankl: `\n\nMODO ATIVO — SENTIDO: Conduza a conversa buscando o que dá ou retirou sentido da vida da pessoa. Explore a sensação de viver no automático como ausência de sentido percebido, não como falha de caráter. Investigue o que ela considera significativo, o que ela evita pensar, para onde ela quer ir. O objetivo é revelar o fio de sentido que existe mas está encoberto.`,
  mode_12camadas: `\n\nMODO ATIVO — 12 CAMADAS DA PERSONALIDADE: Neste modo, conduza a conversa navegando progressivamente as camadas do caráter da pessoa. Comece pelo que ela apresenta — comportamento, linguagem, hábitos. Desça progressivamente para os padrões de reação, as crenças declaradas, as crenças vividas (que frequentemente divergem das declaradas), os medos que organizam o que ela evita, os desejos que ela não nomeia, a imagem que tem de si mesma, as feridas que moldaram tudo isso, e o núcleo que resta quando tudo é removido. Não nomeie as camadas em voz alta. Conduza o movimento de forma orgânica — uma pergunta de cada vez. O objetivo é revelar o que está atuando abaixo do que a pessoa acredita que a motiva. Nunca diagnostique. Nunca rotule. Nunca use termos clínicos. Se houver sinal de crise: encaminhe gentilmente para o CVV (188).`
};

export async function POST(request: NextRequest) {
  try {
    const { messages, userId, modo = 'mode_freud' } = await request.json();

    if (!userId) {
      return Response.json({ error: 'userId ausente' }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('assinante, mensagens_gratuitas_usadas')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError.message, '| userId:', userId);
    }

    if (!profile) {
      console.error('Perfil não encontrado para userId:', userId, '— criando perfil padrão...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, assinante: false, mensagens_gratuitas_usadas: 0 });
      if (insertError) {
        console.error('Erro ao criar perfil padrão:', insertError.message);
      }
    }

    const assinante: boolean = profile?.assinante ?? false;
    const mensagensUsadas: number = profile?.mensagens_gratuitas_usadas ?? 0;

    if (!assinante && mensagensUsadas >= 10) {
      return Response.json({ paywall: true }, { status: 402 });
    }

    const blocoModo = BLOCOS_DE_MODO[modo] ?? BLOCOS_DE_MODO['mode_freud'];
    const systemPromptCompleto = SYSTEM_PROMPT + blocoModo;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPromptCompleto,
      messages: messages,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const responseText = textBlock && 'text' in textBlock ? textBlock.text : '';

    if (!assinante) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ mensagens_gratuitas_usadas: mensagensUsadas + 1 })
        .eq('id', userId);
      if (updateError) {
        console.error('Erro ao atualizar contador:', updateError.message);
      }
    }

    return Response.json({
      content: responseText,
      mensagens_usadas: assinante ? null : mensagensUsadas + 1
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro geral no route.js:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}