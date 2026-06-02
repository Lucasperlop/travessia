export default function Privacidade() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0d0f1a',
      color: '#e8d9a0',
      fontFamily: 'Georgia, serif',
      lineHeight: '1.8',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '60px 24px 80px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '400',
          letterSpacing: '0.04em',
          marginBottom: '8px',
        }}>
          Política de Privacidade
        </h1>
        <p style={{ color: '#c4aa6a', marginBottom: '48px', fontSize: '13px' }}>
          Última atualização: 01 de junho de 2026
        </p>

        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#c4aa6a',
          marginTop: '40px', marginBottom: '8px', letterSpacing: '0.06em',
          textTransform: 'uppercase' }}>
          1. Quem somos
        </h2>
        <p style={{ fontSize: '15px' }}>
          O Travessia é uma plataforma digital de autoconhecimento guiada por
          inteligência artificial. Nosso objetivo é ajudar pessoas a se
          compreenderem melhor por meio de conversas reflexivas e estruturadas.
        </p>

        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#c4aa6a',
          marginTop: '40px', marginBottom: '8px', letterSpacing: '0.06em',
          textTransform: 'uppercase' }}>
          2. Quais dados coletamos
        </h2>
        <p style={{ fontSize: '15px' }}>
          Coletamos apenas os dados necessários para o funcionamento do serviço:
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px', fontSize: '15px' }}>
          <li style={{ marginBottom: '6px' }}>Endereço de email (para autenticação e comunicação)</li>
          <li style={{ marginBottom: '6px' }}>Conteúdo das conversas realizadas na plataforma</li>
          <li style={{ marginBottom: '6px' }}>Dados de uso e navegação (para melhoria do serviço)</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#c4aa6a',
          marginTop: '40px', marginBottom: '8px', letterSpacing: '0.06em',
          textTransform: 'uppercase' }}>
          3. Como usamos seus dados
        </h2>
        <ul style={{ paddingLeft: '20px', marginTop: '8px', fontSize: '15px' }}>
          <li style={{ marginBottom: '6px' }}>Para autenticar seu acesso à plataforma</li>
          <li style={{ marginBottom: '6px' }}>Para gerar as respostas da inteligência artificial</li>
          <li style={{ marginBottom: '6px' }}>Para enviar comunicações relacionadas ao serviço</li>
          <li style={{ marginBottom: '6px' }}>Para melhorar a experiência do produto</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#c4aa6a',
          marginTop: '40px', marginBottom: '8px', letterSpacing: '0.06em',
          textTransform: 'uppercase' }}>
          4. Compartilhamento de dados
        </h2>
        <p style={{ fontSize: '15px' }}>
          Não vendemos seus dados a terceiros. Utilizamos os seguintes
          prestadores de serviço para operar a plataforma: Supabase
          (banco de dados e autenticação), Anthropic (inteligência artificial)
          e Stripe (processamento de pagamentos). Cada um possui sua própria
          política de privacidade.
        </p>

        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#c4aa6a',
          marginTop: '40px', marginBottom: '8px', letterSpacing: '0.06em',
          textTransform: 'uppercase' }}>
          5. Seus direitos (LGPD)
        </h2>
        <p style={{ fontSize: '15px' }}>
          De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
          você tem direito a:
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px', fontSize: '15px' }}>
          <li style={{ marginBottom: '6px' }}>Acessar seus dados pessoais</li>
          <li style={{ marginBottom: '6px' }}>Corrigir dados incompletos ou desatualizados</li>
          <li style={{ marginBottom: '6px' }}>Solicitar a exclusão dos seus dados</li>
          <li style={{ marginBottom: '6px' }}>Revogar o consentimento a qualquer momento</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#c4aa6a',
          marginTop: '40px', marginBottom: '8px', letterSpacing: '0.06em',
          textTransform: 'uppercase' }}>
          6. Retenção de dados
        </h2>
        <p style={{ fontSize: '15px' }}>
          Seus dados são mantidos enquanto sua conta estiver ativa. Para
          solicitar a exclusão dos seus dados, entre em contato pelo email
          abaixo e atenderemos em até 30 dias.
        </p>

        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#c4aa6a',
          marginTop: '40px', marginBottom: '8px', letterSpacing: '0.06em',
          textTransform: 'uppercase' }}>
          7. Contato
        </h2>
        <p style={{ fontSize: '15px' }}>
          Para exercer seus direitos ou tirar dúvidas sobre esta política,
          entre em contato pelo email:{' '}
          <a href="mailto:travessia.chat@gmail.com"
             style={{ color: '#c4aa6a', textDecoration: 'underline' }}>
            travessia.chat@gmail.com
          </a>
        </p>

        <div style={{
          marginTop: '60px',
          paddingTop: '24px',
          borderTop: '1px solid #1e2235',
        }}>
          <a href="/" style={{ color: '#c4aa6a', fontSize: '13px',
            textDecoration: 'none', letterSpacing: '0.04em' }}>
            ← Voltar ao início
          </a>
        </div>
      </div>
    </main>
  )
}