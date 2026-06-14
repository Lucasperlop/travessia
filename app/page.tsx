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
      { threshold: 0.12 }
    )
    const sections = [section2Ref, section3Ref, section4Ref, section5Ref]
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
        justifyContent: 'center'
      }} />
    )
  }

  const modos = [
    {
      icone: '≡',
      nome: 'O que estou carregando',
      descricao: 'Fale sobre aquilo que está pesando hoje.'
    },
    {
      icone: '∞',
      nome: 'Quem eu me tornei',
      descricao: 'Reflita sobre a distância entre quem você é e quem gostaria de ser.'
    },
    {
      icone: '~',
      nome: 'De onde isso vem',
      descricao: 'Explore padrões, escolhas e experiências que continuam se repetindo.'
    },
    {
      icone: '⊙',
      nome: 'O que realmente importa',
      descricao: 'Questões de propósito, direção e significado.'
    },
  ]

  const dorFrases = [
    'Você continua seguindo em frente.',
    'Mas existe algo que você evita pensar quando o dia termina.',
    'Uma conversa que nunca aconteceu.',
    'Uma pergunta que continua voltando.',
    'Uma parte de você que aprendeu a ficar em silêncio.',
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
          transform: translateY(28px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        .section-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .dor-frase {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .dor-frase.frase-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cta-btn {
          display: inline-block;
          background: #e8d9a0;
          color: #0d0f1a;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.04em;
          padding: 14px 36px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .cta-btn:hover { opacity: 0.88; }

        .modo-card {
          background: #080a12;
          border: 1px solid #1a1f35;
          border-radius: 10px;
          padding: 28px 24px;
          transition: border-color 0.2s ease;
        }

        .modo-card:hover { border-color: #c4aa6a; }

        @media (max-width: 640px) {
          .grid-modos { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 36px !important; }
          .passos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #0d0f1aee, transparent)',
      }}>
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
        <a href="/login" style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          color: '#888',
          textDecoration: 'none',
          letterSpacing: '0.06em',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e8d9a0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#888')}
        >
          Entrar
        </a>
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
        {/* linha decorativa superior */}
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
          maxWidth: '600px',
          marginBottom: '28px',
        }}>
          Quando foi a última vez que você falou sobre o que realmente está carregando?
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
          Nem tudo precisa de conselho. Nem tudo precisa de solução.
          <br />
          Às vezes você só precisa de um espaço para colocar em palavras
          aquilo que está preso há tempo demais.
        </p>

        <a href="/login" className="cta-btn">
          Começar minha travessia
        </a>

        <p style={{
          marginTop: '18px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          color: '#555',
          letterSpacing: '0.04em',
        }}>
          Nenhum compromisso. Só você.
        </p>

        {/* linha decorativa inferior */}
        <div style={{
          width: '1px',
          height: '60px',
          background: 'linear-gradient(to bottom, #c4aa6a44, transparent)',
          marginTop: '72px',
        }} />
      </section>

      {/* ── SEÇÃO 2: DOR ── */}
      <section
        ref={section2Ref}
        className="section-fade"
        style={{
          padding: '100px 24px',
          maxWidth: '560px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {dorFrases.map((frase, i) => (
          <DorFrase key={i} texto={frase} delay={i * 180} />
        ))}
      </section>

      {/* ── SEÇÃO 3: O QUE É ── */}
      <section
        ref={section3Ref}
        className="section-fade"
        style={{
          padding: '100px 24px',
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
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          O que é a Travessia
        </p>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '34px',
          lineHeight: '1.35',
          color: '#e8d9a0',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          A Travessia é um espaço de conversa guiada para quem precisa organizar pensamentos, sentimentos e perguntas difíceis.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: '1.85',
          color: '#777',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto 64px',
        }}>
          Sem julgamentos.
          <br />Sem precisar saber por onde começar.
          <br />Sem precisar ter todas as respostas.
          <br /><br />
          Você entra com o que está carregando.
          <br />A conversa ajuda você a enxergar com mais clareza.
        </p>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: '#555',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          Você pode começar por diferentes caminhos
        </p>

        <div className="grid-modos" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          {modos.map((m, i) => (
            <div key={i} className="modo-card">
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '22px',
                color: '#c4aa6a',
                marginBottom: '12px',
              }}>
                {m.icone}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#e8d9a0',
                letterSpacing: '0.02em',
                marginBottom: '8px',
              }}>
                {m.nome}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300,
                fontSize: '13px',
                color: '#666',
                lineHeight: '1.6',
              }}>
                {m.descricao}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEÇÃO 4: COMO FUNCIONA ── */}
      <section
        ref={section4Ref}
        className="section-fade"
        style={{
          padding: '100px 24px',
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
          marginBottom: '56px',
          textAlign: 'center',
        }}>
          Como funciona
        </p>

        <div className="passos-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px 48px',
        }}>
          {[
            { num: '01', titulo: 'Crie sua conta', desc: 'Leva menos de um minuto.' },
            { num: '02', titulo: 'Escolha um caminho', desc: 'Cada conversa começa de um lugar diferente.' },
            { num: '03', titulo: 'Comece a falar', desc: 'Sem respostas certas. Sem roteiro.' },
            { num: '04', titulo: 'Ganhe clareza', desc: 'Você não precisa sair com uma solução. Só precisa sair vendo algo que não via antes.' },
          ].map((p, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontSize: '13px',
                color: '#c4aa6a',
                letterSpacing: '0.08em',
                marginBottom: '10px',
              }}>
                {p.num}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                color: '#e8d9a0',
                marginBottom: '8px',
              }}>
                {p.titulo}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300,
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.7',
              }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEÇÃO 5: CTA FINAL ── */}
      <section
        ref={section5Ref}
        className="section-fade"
        style={{
          padding: '100px 24px 140px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '0 auto',
        }}
      >
        {/* divisor */}
        <div style={{
          width: '40px',
          height: '1px',
          background: '#1a1f35',
          margin: '0 auto 64px',
        }} />

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '38px',
          lineHeight: '1.3',
          color: '#e8d9a0',
          marginBottom: '20px',
        }}>
          A primeira travessia é gratuita.
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 300,
          fontSize: '15px',
          color: '#666',
          marginBottom: '44px',
          lineHeight: '1.7',
        }}>
          Você entra quando quiser. Sai quando quiser. Continua se fizer sentido.
        </p>

        <a href="/login" className="cta-btn">
          Entrar na travessia
        </a>

        <p style={{
          marginTop: '32px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          color: '#444',
          letterSpacing: '0.04em',
          lineHeight: '1.6',
        }}>
          A Travessia não substitui atendimento psicológico ou psiquiátrico.
          <br />É uma ferramenta de reflexão e autoconhecimento.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid #1a1f35',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '16px',
          color: '#444',
        }}>
          Travessia
        </span>

        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Privacidade', href: '/privacidade' },
            { label: 'Entrar', href: '/login' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px',
              color: '#444',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#888')}
              onMouseLeave={e => (e.currentTarget.style.color = '#444')}
            >
              {link.label}
            </a>
          ))}
        </div>

        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          color: '#333',
          letterSpacing: '0.04em',
        }}>
          © 2026 Travessia
        </span>
      </footer>
    </>
  )
}

/* ── Componente interno: DorFrase com IntersectionObserver ── */
function DorFrase({ texto, delay }: { texto: string; delay: number }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('frase-visible')
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <p
      ref={ref}
      className="dor-frase"
      style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: '24px',
        lineHeight: '1.55',
        color: '#e8d9a0',
        marginBottom: '36px',
        letterSpacing: '0.01em',
      }}
    >
      {texto}
    </p>
  )
}