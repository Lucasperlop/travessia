'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PlanosPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [visible, setVisible] = useState(false)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingPlano, setLoadingPlano] = useState<'mensal' | 'anual' | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
        setUserId(user.id)
      }
      setCheckingAuth(false)
      setTimeout(() => setVisible(true), 100)
    }
    checkAuth()
  }, [])

  async function iniciarCheckout(plano: 'mensal' | 'anual') {
    if (!userEmail || !userId) {
      router.push('/login')
      return
    }

    setLoadingPlano(plano)

    const priceId = plano === 'anual'
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANUAL
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MENSAL

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          priceId,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setLoadingPlano(null)
      }
    } catch (error) {
      setLoadingPlano(null)
    }
  }

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

  const faqPagamento = [
    {
      pergunta: 'O que acontece depois de assinar?',
      resposta: 'Após a confirmação do pagamento, você é encaminhado para continuar sua Travessia.',
    },
    {
      pergunta: 'Qual plano vale mais a pena?',
      resposta: 'O anual. Ele custa R$297 por ano, equivalente a R$24,75 por mês, e economiza R$147 em comparação com 12 meses no plano mensal.',
    },
    {
      pergunta: 'Posso cancelar?',
      resposta: 'Sim. Para cancelar, envie um email para travessia.chat@gmail.com se identificando com nome completo e CPF — a recorrência é interrompida imediatamente. Consulte os Termos de Uso para as condições completas.',
    },
    {
      pergunta: 'A Travessia é terapia?',
      resposta: 'Não. A Travessia não substitui terapia, psicólogo, médico ou atendimento de emergência. É uma experiência de autoconhecimento por conversa.',
    },
    {
      pergunta: 'Minhas conversas são privadas?',
      resposta: 'As informações são tratadas conforme a Política de Privacidade da Travessia.',
    },
    {
      pergunta: 'O pagamento é seguro?',
      resposta: 'Sim. O pagamento é processado pelo ambiente seguro do Stripe.',
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
        .cta-btn:disabled { opacity: 0.5; cursor: default; }

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
        .nav-link-ativo {
          color: #e8d9a0 !important;
        }

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

        .plano-card {
          border: 1px solid #252a40;
          border-radius: 12px;
          padding: 40px 32px;
          flex: 1;
          background: #0a0c18;
          display: flex;
          flex-direction: column;
        }

        .plano-card-destaque {
          border: 1px solid #c4aa6a55;
          background: #13162a;
          position: relative;
        }

        .plano-selo {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: #e8d9a0;
          color: #0d0f1a;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 16px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .plano-cards-wrap {
          display: flex;
          gap: 24px;
          max-width: 760px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .hero-title { font-size: 34px !important; }
          .nav-links-desktop { display: none !important; }
          .nav-hamburguer { display: flex !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .footer-links-grupo { flex-wrap: wrap !important; }
          .plano-cards-wrap { flex-direction: column !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '18px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #0d0f1aee, transparent)',
      }}>
        <a href="/" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '22px',
          color: '#e8d9a0',
          letterSpacing: '0.02em',
          textDecoration: 'none',
        }}>
          Travessia
        </a>

        <div className="nav-links-desktop" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
        }}>
          <span className="nav-link" style={{ cursor: 'default', opacity: 0.5 }}>Sobre</span>
          <span className="nav-link" style={{ cursor: 'default', opacity: 0.5 }}>Para profissionais</span>
          <a href="/planos" className="nav-link nav-link-ativo">Plano</a>
          <a href="/login" className="nav-cta">Login</a>
        </div>

        <button
          className="nav-hamburguer"
          onClick={() => setMenuMobileAberto(!menuMobileAberto)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            flexDirection: 'column',
            gap: '5px',
          }}
          aria-label="Menu"
        >
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: menuMobileAberto ? 'transparent' : '#e8d9a0', transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#e8d9a0', transition: 'all 0.2s', transform: menuMobileAberto ? 'rotate(45deg) translateY(6px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#e8d9a0', transition: 'all 0.2s', transform: menuMobileAberto ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
        </button>
      </header>

      {/* ── MENU MOBILE DRAWER ── */}
      {menuMobileAberto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#0d0f1a',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
        }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', color: '#555', letterSpacing: '0.04em', cursor: 'default' }}>
            Sobre
          </span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', color: '#555', letterSpacing: '0.04em', cursor: 'default' }}>
            Para profissionais
          </span>
          <a href="/planos" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', color: '#e8d9a0', textDecoration: 'none', letterSpacing: '0.04em' }}>
            Plano
          </a>
          <a
            href="/login"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '18px',
              fontWeight: 500,
              color: '#0d0f1a',
              background: '#e8d9a0',
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: '6px',
              letterSpacing: '0.04em',
            }}
          >
            Login
          </a>

          <button
            onClick={() => setMenuMobileAberto(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: '#e8d9a0',
              fontSize: '28px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── 1. HERO ── */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '140px 24px 60px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease',
      }}>
        <h1 className="hero-title" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '42px',
          lineHeight: '1.3',
          color: '#e8d9a0',
          letterSpacing: '0.01em',
          maxWidth: '600px',
          marginBottom: '24px',
        }}>
          Escolha como continuar sua Travessia.
        </h1>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#a0a0a0',
          maxWidth: '460px',
          marginBottom: '28px',
        }}>
          A primeira conversa abre o caminho. A assinatura é o que permite você
          voltar, continuar e construir continuidade no seu processo.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '13px',
          color: '#777',
          letterSpacing: '0.02em',
          marginBottom: '36px',
        }}>
          Pagamento seguro. Cancelamento simples. A Travessia não é terapia.
        </p>

        <a href="#planos" className="cta-btn">
          Ver planos
        </a>
      </section>

      {/* ── 2. FRASE PONTE ── */}
      <section className="section-fade section-visible" style={{
        padding: '0 24px 60px',
        maxWidth: '520px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '20px',
          lineHeight: '1.65',
          color: '#a0a0a0',
        }}>
          Nem toda conversa termina na primeira resposta. Esta página existe
          para você escolher como quer seguir: mês a mês, ou com mais
          continuidade no plano anual.
        </p>
      </section>

      {/* ── 3. CARDS DE PLANOS ── */}
      <section id="planos" className="section-fade section-visible" style={{
        padding: '40px 24px 60px',
      }}>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: '#c4aa6a',
          textTransform: 'uppercase',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          Planos
        </p>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '28px',
          color: '#e8d9a0',
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          Escolha como quer continuar.
        </h2>

        <div className="plano-cards-wrap">
          {/* CARD ANUAL */}
          <div className="plano-card plano-card-destaque">
            <span className="plano-selo">Melhor escolha</span>

            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#e8d9a0', fontWeight: 500, marginBottom: '4px', marginTop: '8px' }}>
              Anual
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '36px', fontWeight: 500, color: '#e8d9a0' }}>
                R$24,75
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#a0a0a0' }}>
                /mês
              </span>
            </div>

            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#777', marginBottom: '8px' }}>
              cobrado R$297 por ano
            </p>

            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#a0a0a0', textDecoration: 'line-through', marginBottom: '4px' }}>
              12 meses no mensal: R$444
            </p>

            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#c4aa6a', fontWeight: 500, marginBottom: '24px' }}>
              Economize R$147 no ano
            </p>

            <div style={{ flex: 1, marginBottom: '28px' }}>
              {[
                'Continuidade por 12 meses',
                'Menor custo mensal equivalente',
                'Menos interrupção entre conversas',
                'Acesso à Travessia enquanto a assinatura estiver ativa',
              ].map((item, i) => (
                <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#a0a0a0', lineHeight: '1.8', marginBottom: '6px' }}>
                  · {item}
                </p>
              ))}
            </div>

            <button
              onClick={() => iniciarCheckout('anual')}
              disabled={loadingPlano !== null}
              className="cta-btn"
              style={{ width: '100%', textAlign: 'center' }}
            >
              {loadingPlano === 'anual' ? 'Abrindo pagamento...' : 'Assinar anual'}
            </button>
          </div>

          {/* CARD MENSAL */}
          <div className="plano-card">
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#e8d9a0', fontWeight: 500, marginBottom: '4px' }}>
              Mensal
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '36px', fontWeight: 500, color: '#e8d9a0' }}>
                R$37
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#a0a0a0' }}>
                /mês
              </span>
            </div>

            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#777', marginBottom: '24px' }}>
              cobrança mensal recorrente
            </p>

            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '15px', color: '#a0a0a0', marginBottom: '20px' }}>
              Para continuar com liberdade, mês a mês.
            </p>

            <div style={{ flex: 1, marginBottom: '28px' }}>
              {[
                'Acesso enquanto a assinatura estiver ativa',
                'Cancelamento simples',
                'Sem compromisso de longo prazo',
              ].map((item, i) => (
                <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#a0a0a0', lineHeight: '1.8', marginBottom: '6px' }}>
                  · {item}
                </p>
              ))}
            </div>

            <button
              onClick={() => iniciarCheckout('mensal')}
              disabled={loadingPlano !== null}
              style={{
                width: '100%',
                textAlign: 'center',
                background: 'transparent',
                color: '#e8d9a0',
                border: '1px solid #e8d9a0',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                padding: '16px 44px',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: loadingPlano !== null ? 0.5 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {loadingPlano === 'mensal' ? 'Abrindo pagamento...' : 'Assinar mensal'}
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. TODOS OS PLANOS INCLUEM ── */}
      <section className="section-fade section-visible" style={{
        padding: '40px 24px 60px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '24px',
          color: '#e8d9a0',
          marginBottom: '28px',
        }}>
          Todos os planos incluem
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 32px' }}>
          {[
            'Acesso à Travessia',
            'Modos de conversa do app',
            'Continuidade da experiência',
            'Espaço privado de reflexão',
            'Experiência guiada por perguntas',
            'Pagamento seguro via Stripe',
            'Dados tratados conforme a Política de Privacidade',
            'Cancelamento simples',
          ].map((item, i) => (
            <span key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#a0a0a0', lineHeight: '1.8' }}>
              · {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── 5. SEGURANÇA DA COMPRA E CANCELAMENTO ── */}
      <section className="section-fade section-visible" style={{
        padding: '40px 24px 60px',
        maxWidth: '560px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{ width: '40px', height: '1px', background: '#252a40', margin: '0 auto 40px' }} />

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '26px',
          color: '#e8d9a0',
          marginBottom: '20px',
        }}>
          Pagamento seguro e cancelamento simples.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '15px',
          lineHeight: '1.85',
          color: '#a0a0a0',
          marginBottom: '20px',
        }}>
          O pagamento é processado em ambiente seguro via Stripe. A cobrança é
          recorrente conforme o plano escolhido — mensal renovado todo mês,
          anual renovado todo ano.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '15px',
          lineHeight: '1.85',
          color: '#a0a0a0',
        }}>
          Para cancelar, envie um email para{' '}
          <span style={{ color: '#c4aa6a' }}>travessia.chat@gmail.com</span>{' '}
          se identificando com nome completo e CPF — a recorrência é
          interrompida imediatamente. Condições completas nos Termos de Uso.
        </p>
      </section>

      {/* ── 6. O QUE A TRAVESSIA É — E O QUE NÃO É ── */}
      <section className="section-fade section-visible" style={{
        padding: '40px 24px 60px',
        maxWidth: '560px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '26px',
          color: '#e8d9a0',
          marginBottom: '20px',
        }}>
          O que a Travessia é — e o que ela não é.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '15px',
          lineHeight: '1.85',
          color: '#a0a0a0',
          marginBottom: '16px',
        }}>
          A Travessia é uma experiência de autoconhecimento por conversa. Ela
          ajuda você a organizar pensamentos, nomear o que carrega e refletir
          com mais clareza.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '15px',
          lineHeight: '1.85',
          color: '#a0a0a0',
          marginBottom: '24px',
        }}>
          A Travessia não é terapia, não realiza diagnóstico, não oferece
          tratamento e não substitui psicólogo, médico ou atendimento de
          emergência.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '13px',
          lineHeight: '1.75',
          color: '#777',
        }}>
          Em situação de risco imediato, procure ajuda emergencial. No Brasil,
          o CVV atende pelo número 188.
        </p>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="section-fade section-visible" style={{
        padding: '40px 24px 60px',
        maxWidth: '680px',
        margin: '0 auto',
      }}>
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

        {faqPagamento.map((item, i) => (
          <div key={i} className="faq-item">
            <p className="faq-pergunta">{item.pergunta}</p>
            <p className="faq-resposta">{item.resposta}</p>
          </div>
        ))}
      </section>

      {/* ── 8. FECHAMENTO FINAL ── */}
      <section className="section-fade section-visible" style={{
        padding: '60px 24px 120px',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '0 auto',
      }}>
        <div style={{ width: '40px', height: '1px', background: '#252a40', margin: '0 auto 56px' }} />

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '32px',
          lineHeight: '1.3',
          color: '#e8d9a0',
          marginBottom: '20px',
        }}>
          Continue de onde a conversa parou.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          color: '#a0a0a0',
          marginBottom: '36px',
          lineHeight: '1.75',
        }}>
          Você não precisa resolver tudo de uma vez. Só precisa escolher se
          quer continuar com liberdade mês a mês ou com mais continuidade no
          plano anual.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => iniciarCheckout('anual')} disabled={loadingPlano !== null} className="cta-btn">
            {loadingPlano === 'anual' ? 'Abrindo pagamento...' : 'Assinar anual'}
          </button>
          <button
            onClick={() => iniciarCheckout('mensal')}
            disabled={loadingPlano !== null}
            style={{
              background: 'transparent',
              color: '#e8d9a0',
              border: '1px solid #e8d9a0',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              padding: '16px 44px',
              borderRadius: '6px',
              cursor: 'pointer',
              opacity: loadingPlano !== null ? 0.5 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            {loadingPlano === 'mensal' ? 'Abrindo pagamento...' : 'Assinar mensal'}
          </button>
        </div>
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
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '16px',
            color: '#888',
          }}>
            Travessia
          </span>

          <div className="footer-links-grupo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}>
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
            <a href="/planos" className="footer-link">Planos</a>
            <a href="/login" className="footer-link">Login</a>
            <a href="/privacidade" className="footer-link">Privacidade</a>
          </div>

          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '11px',
            color: '#666',
            letterSpacing: '0.04em',
          }}>
            © 2026 Travessia
          </span>
        </div>

        <p style={{
          textAlign: 'center',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          color: '#666',
          marginTop: '20px',
          lineHeight: '1.6',
        }}>
          A Travessia não é terapia, não realiza diagnóstico e não substitui
          atendimento médico ou psicológico. Em caso de emergência, ligue 188 (CVV).
        </p>
      </footer>
    </>
  )
}