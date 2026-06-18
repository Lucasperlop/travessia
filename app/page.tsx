'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [visible, setVisible] = useState(false)

  const section2Ref = useRef<HTMLElement>(null)
  const section3Ref = useRef<HTMLElement>(null)
  const section4Ref = useRef<HTMLElement>(null)
  const section5Ref = useRef<HTMLElement>(null)
  const section6Ref = useRef<HTMLElement>(null)
  const section7Ref = useRef<HTMLElement>(null)
  const section8Ref = useRef<HTMLElement>(null)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/chat')
      } else {
        setCheckingAuth(false)
        setTimeout(() => setVisible(true), 100)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (checkingAuth) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    const sections = [section2Ref, section3Ref, section4Ref, section5Ref, section6Ref, section7Ref, section8Ref]
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current)
    })
    return () => observer.disconnect()
  }, [checkingAuth])

  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0d0f1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }} />
    )
  }

  const faqItems = [
    {
      pergunta: 'A Travessia é a mesma coisa que o ChatGPT?',
      resposta: 'Não. O ChatGPT responde ao que você pergunta. A Travessia conduz uma conversa estruturada de autoconhecimento. Você não precisa criar o prompt certo, organizar tudo antes ou saber exatamente por onde começar. A experiência foi desenhada para ajudar você a entrar na conversa certa.',
    },
    {
      pergunta: 'A Travessia é terapia?',
      resposta: 'Não. A Travessia não diagnostica, não trata e não substitui acompanhamento psicológico, psiquiátrico ou médico. Ela é uma ferramenta de autoconhecimento por conversa. Pode ajudar você a organizar pensamentos, perceber padrões e nomear melhor o que está sentindo, mas não ocupa o lugar de um profissional.',
    },
    {
      pergunta: 'A Travessia vai me dar conselhos?',
      resposta: 'A proposta não é mandar você fazer algo. A Travessia ajuda você a pensar melhor sobre o que está vivendo. Em vez de entregar uma resposta pronta, ela conduz perguntas, devolve padrões e ajuda a organizar o que ainda está confuso.',
    },
    {
      pergunta: 'Preciso saber explicar o que estou sentindo?',
      resposta: 'Não. Esse é justamente o ponto. Você pode começar sem saber nomear. Pode chegar confuso. Pode dizer só uma frase. A Travessia foi feita para ajudar a conversa a começar mesmo quando você ainda não sabe explicar direito.',
    },
    {
      pergunta: 'Meus dados ficam seguros?',
      resposta: 'A conversa é tratada com privacidade e responsabilidade. A Travessia não vende seus dados, não compartilha suas conversas para publicidade e segue princípios de proteção de dados. O que você escreve pertence à sua experiência dentro da plataforma.',
    },
    {
      pergunta: 'Posso cancelar quando quiser?',
      resposta: 'Sim. Sem fidelidade. Sem multa. Sem burocracia.',
    },
    {
      pergunta: 'E se eu estiver passando por algo sério?',
      resposta: 'A Travessia não é o lugar certo para emergências ou crises. Se você estiver em sofrimento intenso, em risco, ou pensando em se machucar, procure ajuda humana imediatamente. No Brasil, ligue para o CVV: 188. O atendimento é gratuito, sigiloso e funciona 24 horas.',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0d0f1a;
          color: #e8d9a0;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .section-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        .section-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .cta-btn {
          display: inline-block;
          background: #e8d9a0;
          color: #0d0f1a;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 16px 44px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .cta-btn:hover { opacity: 0.88; }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #aaa;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #e8d9a0; }

        .nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #0d0f1a;
          background: #e8d9a0;
          text-decoration: none;
          letter-spacing: 0.04em;
          padding: 9px 20px;
          border-radius: 6px;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .nav-cta:hover { opacity: 0.88; }

        .faq-item {
          border-bottom: 1px solid #252a40;
          padding: 28px 0;
        }
        .faq-item:first-child { border-top: 1px solid #252a40; }

        .faq-pergunta {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #e8d9a0;
          letter-spacing: 0.01em;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .faq-resposta {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 15px;
          color: #a0a0a0;
          line-height: 1.8;
        }

        .faq-resposta a {
          color: #c4aa6a;
          text-decoration: none;
        }

        .footer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #888;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .footer-link:hover { color: #e8d9a0; }

        .dialogo-bloco {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 540px;
          margin: 0 auto;
        }

        .dialogo-linha-user {
          display: flex;
          justify-content: flex-end;
        }

        .dialogo-linha-ai {
          display: flex;
          justify-content: flex-start;
        }

        .dialogo-balao-user {
          background: #13162a;
          border: 1px solid #252a40;
          border-radius: 12px 12px 2px 12px;
          padding: 14px 18px;
          max-width: 78%;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 15px;
          color: #b0b0c0;
          line-height: 1.65;
        }

        .dialogo-balao-ai {
          background: #0a0c18;
          border: 1px solid #252a40;
          border-radius: 2px 12px 12px 12px;
          padding: 14px 18px;
          max-width: 78%;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 17px;
          color: #e8d9a0;
          line-height: 1.7;
        }

        @media (max-width: 640px) {
          .hero-title { font-size: 34px !important; }
          .nav-links-desktop { display: none !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .footer-links-grupo { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '18px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #0d0f1aee, transparent)',
      }}>
        {/* Logo esquerda */}
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '22px',
          color: '#e8d9a0',
          letterSpacing: '0.02em',
        }}>
          Travessia
        </span>

        {/* Botões direita */}
        <div className="nav-links-desktop" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
        }}>
          <span className="nav-link" style={{ cursor: 'default', opacity: 0.5 }}>Sobre</span>
          <span className="nav-link" style={{ cursor: 'default', opacity: 0.5 }}>Para profissionais</span>
          <a href="/login" className="nav-cta">Voltar à minha Travessia</a>
        </div>
      </header>

      {/* ── SEÇÃO 1: HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease',
      }}>
        <div style={{
          width: '1px',
          height: '60px',
          background: 'linear-gradient(to bottom, transparent, #c4aa6a44)',
          marginBottom: '48px',
        }} />

        <h1 className="hero-title" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '46px',
          lineHeight: '1.25',
          color: '#e8d9a0',
          letterSpacing: '0.01em',
          maxWidth: '620px',
          marginBottom: '28px',
        }}>
          Tem algo que você carrega há anos sem conseguir nomear.
        </h1>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 300,
          fontSize: '17px',
          lineHeight: '1.75',
          color: '#888',
          maxWidth: '420px',
          marginBottom: '44px',
        }}>
          A Travessia não vai te apressar.
          <br />Vai conversar com você até o pensamento encontrar forma.
        </p>

        <a href="/login" className="cta-btn">
          Vamos conversar?
        </a>

        <div style={{
          width: '1px',
          height: '60px',
          background: 'linear-gradient(to bottom, #c4aa6a44, transparent)',
          marginTop: '72px',
        }} />
      </section>

      {/* ── SEÇÃO 2: DOR AMPLIADA ── */}
      <section
        ref={section2Ref}
        className="section-fade"
        style={{
          padding: '60px 24px',
          maxWidth: '560px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '28px',
          lineHeight: '1.55',
          color: '#e8d9a0',
          marginBottom: '32px',
          letterSpacing: '0.01em',
        }}>
          Você já tentou entender.
        </p>

        {[
          'Já pensou sozinho.',
          'Já leu coisas que pareciam explicar.',
          'Já ensaiou conversas que nunca teve.',
        ].map((frase, i) => (
          <p key={i} style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            fontSize: '17px',
            lineHeight: '1.75',
            color: '#a0a0a0',
            marginBottom: '10px',
          }}>
            {frase}
          </p>
        ))}

        <div style={{ height: '36px' }} />

        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '22px',
          lineHeight: '1.6',
          color: '#e8d9a0',
          marginBottom: '28px',
        }}>
          Mas ainda existe alguma coisa aí dentro que não terminou de sair.
        </p>

        {[
          'Não é drama.',
          'Não é fraqueza.',
          'Não é falta de esforço.',
        ].map((frase, i) => (
          <p key={i} style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            color: '#a0a0a0',
            marginBottom: '8px',
            letterSpacing: '0.02em',
          }}>
            {frase}
          </p>
        ))}

        <div style={{ height: '32px' }} />

        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '20px',
          lineHeight: '1.65',
          color: '#a0a0a0',
        }}>
          É só algo que ficou tempo demais sem um lugar seguro para ser dito.
        </p>
      </section>

      {/* ── SEÇÃO 3: MÉTODO ── */}
      <section
        ref={section3Ref}
        className="section-fade"
        style={{
          padding: '60px 24px',
          maxWidth: '560px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: '#c4aa6a',
          textTransform: 'uppercase',
          marginBottom: '28px',
        }}>
          Como funciona
        </p>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '32px',
          lineHeight: '1.35',
          color: '#e8d9a0',
          marginBottom: '28px',
        }}>
          A Travessia começa por uma conversa guiada.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '17px',
          lineHeight: '1.85',
          color: '#a0a0b8',
          marginBottom: '16px',
        }}>
          Ela não entrega respostas prontas.
          <br />Ela faz perguntas melhores.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '1.85',
          color: '#a0a0a0',
          marginBottom: '0',
        }}>
          Perguntas que ajudam você a organizar o que sente, perceber padrões,
          nomear pesos antigos e enxergar com mais clareza aquilo que parecia confuso.
        </p>

        <div style={{ height: '28px' }} />

        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '19px',
          color: '#a0a0a0',
          lineHeight: '1.65',
        }}>
          Você conversa no seu tempo.
          <br />Sem precisar saber por onde começar.
        </p>
      </section>

      {/* ── SEÇÃO 4: DEMONSTRAÇÃO (DIÁLOGO) ── */}
      <section
        ref={section4Ref}
        className="section-fade"
        style={{
          padding: '60px 24px',
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: '#c4aa6a',
          textTransform: 'uppercase',
          marginBottom: '36px',
          textAlign: 'center',
        }}>
          Uma conversa real
        </p>

        <div className="dialogo-bloco">
          <div className="dialogo-linha-user">
            <div className="dialogo-balao-user">
              Não sei explicar direito. Só sinto que tem algo errado comigo.
            </div>
          </div>
          <div className="dialogo-linha-ai">
            <div className="dialogo-balao-ai">
              Quando essa sensação aparece com mais força?
            </div>
          </div>
          <div className="dialogo-linha-user">
            <div className="dialogo-balao-user">
              Quando eu tento seguir em frente, mas parece que uma parte minha ainda está presa em coisas antigas.
            </div>
          </div>
          <div className="dialogo-linha-ai">
            <div className="dialogo-balao-ai">
              Então talvez a questão não seja o que há de errado com você. Talvez seja o que ainda não teve espaço suficiente para ser escutado.
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 5: AUTORIDADE TÉCNICA ── */}
      <section
        id="sobre"
        ref={section5Ref}
        className="section-fade"
        style={{
          padding: '60px 24px',
          maxWidth: '620px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: '40px',
          height: '1px',
          background: '#252a40',
          margin: '0 auto 48px',
        }} />

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: '#c4aa6a',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          A tecnologia
        </p>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '30px',
          lineHeight: '1.4',
          color: '#e8d9a0',
          marginBottom: '24px',
        }}>
          A Travessia conversa com você usando Claude Opus, modelo de alta
          capacidade da Anthropic para raciocínio complexo e conversas profundas.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '1.85',
          color: '#a0a0a0',
          marginBottom: '16px',
        }}>
          Sobre essa base, quatro métodos de conversa orientam a experiência:
          psicanálise, psicologia analítica, psicologia do desenvolvimento
          e logoterapia.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '15px',
          lineHeight: '1.85',
          color: '#a0a0a0',
          marginBottom: '24px',
        }}>
          A Anthropic também aplica essa tecnologia em domínios de alta
          responsabilidade — como saúde, pesquisa e análise de informações
          complexas. Na Travessia, esse cuidado técnico sustenta uma conversa
          guiada de autoconhecimento: mais estruturada, mais precisa, mais capaz
          de acompanhar o que você está tentando dizer.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '13px',
          lineHeight: '1.75',
          color: '#777',
          letterSpacing: '0.02em',
        }}>
          Não é terapia. Não é diagnóstico. Não substitui psicólogo, psiquiatra
          ou médico. Aqui, a tecnologia sustenta uma experiência de
          autoconhecimento por conversa.
        </p>
      </section>

      {/* ── SEÇÃO 6: SIGILO E PRIVACIDADE ── */}
      <section
        ref={section6Ref}
        className="section-fade"
        style={{
          padding: '60px 24px',
          maxWidth: '560px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: '40px',
          height: '1px',
          background: '#252a40',
          margin: '0 auto 48px',
        }} />

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '30px',
          lineHeight: '1.4',
          color: '#e8d9a0',
          marginBottom: '20px',
        }}>
          Uma conversa honesta só acontece quando existe segurança.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '1.85',
          color: '#a0a0a0',
          marginBottom: '24px',
        }}>
          Na Travessia, o que você escreve é tratado com cuidado, privacidade
          e respeito.
        </p>

        {[
          'Você não precisa performar.',
          'Não precisa parecer bem.',
          'Não precisa se explicar para ser levado a sério.',
        ].map((frase, i) => (
          <p key={i} style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            color: '#a0a0a0',
            marginBottom: '8px',
          }}>
            {frase}
          </p>
        ))}

        <p style={{
          marginTop: '28px',
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '22px',
          color: '#e8d9a0',
        }}>
          A conversa é sua.
        </p>
      </section>

      {/* ── SEÇÃO 7: FAQ ── */}
      <section
        ref={section7Ref}
        className="section-fade"
        style={{
          padding: '60px 24px',
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: '#c4aa6a',
          textTransform: 'uppercase',
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          Perguntas frequentes
        </p>

        {faqItems.map((item, i) => (
          <div key={i} className="faq-item">
            <p className="faq-pergunta">{item.pergunta}</p>
            <p className="faq-resposta">{item.resposta}</p>
          </div>
        ))}
      </section>

      {/* ── SEÇÃO 8: CTA FINAL ── */}
      <section
        ref={section8Ref}
        className="section-fade"
        style={{
          padding: '80px 24px 120px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '0 auto',
        }}
      >
        <div style={{
          width: '40px',
          height: '1px',
          background: '#252a40',
          margin: '0 auto 56px',
        }} />

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '38px',
          lineHeight: '1.3',
          color: '#e8d9a0',
          marginBottom: '20px',
        }}>
          Talvez você não precise resolver tudo agora.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '17px',
          color: '#a0a0a0',
          marginBottom: '16px',
          lineHeight: '1.75',
        }}>
          Talvez precise apenas começar a dizer, do jeito certo,
          aquilo que ficou preso por tempo demais.
        </p>

        <div style={{ height: '32px' }} />

        <a href="/login" className="cta-btn">
          Vamos conversar?
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid #252a40',
        padding: '28px 32px',
      }}>
        <div className="footer-inner" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Esquerda: marca */}
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '16px',
            color: '#888',
          }}>
            Travessia
          </span>

          {/* Centro: links */}
          <div className="footer-links-grupo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}>
            <a href="#planos" className="footer-link">Planos</a>

            {/* Instagram com ícone SVG */}
            <a
              href="https://www.instagram.com/travessia.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
              </svg>
              Instagram
            </a>

            <a href="/privacidade" className="footer-link">Privacidade</a>
            <a href="/login" className="footer-link">Voltar à minha Travessia</a>
          </div>

          {/* Direita: copyright */}
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '11px',
            color: '#666',
            letterSpacing: '0.04em',
          }}>
            © 2026 Travessia
          </span>
        </div>
      </footer>
    </>
  )
}