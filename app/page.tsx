'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)
  const section5Ref = useRef<HTMLDivElement>(null)

  // Opção B: logado vai direto pro chat
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

  // Intersection Observer para fade-in das seções
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
      { threshold: 0.15 }
    )
    const sections = [section2Ref, section3Ref, section4Ref, section5Ref]
    sections.forEach(ref => { if (ref.current) observer.observe(ref.current) })
    return () => observer.disconnect()
  }, [checkingAuth])

  if (checkingAuth) {
    return (
      <div style={{
        height: '100vh',
        background: '#0d0f1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#c4aa6a',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #0d0f1a;
          color: #e8d9a0;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── HERO ANIMATION ── */
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }

        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes taglineFade {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes subtitleFade {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 0.65; transform: translateY(0); }
        }

        @keyframes ctaFade {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes ripple {
          0%   { transform: scaleX(1) scaleY(1); opacity: 0.7; }
          50%  { transform: scaleX(1.03) scaleY(0.97); opacity: 0.5; }
          100% { transform: scaleX(1) scaleY(1); opacity: 0.7; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }

        @keyframes glow {
          0%, 100% { filter: blur(18px); opacity: 0.35; }
          50%       { filter: blur(24px); opacity: 0.5; }
        }

        @keyframes particleRise {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          20%  { opacity: 0.6; }
          100% { transform: translateY(-80px) translateX(var(--drift)); opacity: 0; }
        }

        /* ── SECTION FADE IN ── */
        .section-fade {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── CTA BUTTON ── */
        .cta-btn {
          display: inline-block;
          background: #e8d9a0;
          color: #0d0f1a;
          border: none;
          padding: 16px 42px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.06em;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
          text-decoration: none;
        }
        .cta-btn:hover {
          background: #f0e4b2;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(196, 170, 106, 0.25);
        }

        /* ── MODO CARD ── */
        .modo-card {
          border: 1px solid rgba(196, 170, 106, 0.15);
          border-radius: 4px;
          padding: 24px 22px;
          transition: border-color 0.3s ease, background 0.3s ease;
          cursor: default;
        }
        .modo-card:hover {
          border-color: rgba(196, 170, 106, 0.4);
          background: rgba(196, 170, 106, 0.04);
        }

        /* ── STEP ── */
        .step-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(196, 170, 106, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #c4aa6a;
          flex-shrink: 0;
        }

        /* ── DOR FRASES ── */
        .dor-frase {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(22px, 3.5vw, 32px);
          font-style: italic;
          color: #e8d9a0;
          line-height: 1.5;
          padding: 28px 0;
          border-bottom: 1px solid rgba(232, 217, 160, 0.08);
          opacity: 0;
          transform: translateX(-12px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .dor-frase.frase-visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(196, 170, 106, 0.2); border-radius: 2px; }

        @media (max-width: 768px) {
          .hero-tagline { font-size: clamp(34px, 8vw, 52px) !important; }
          .hero-sub { font-size: 16px !important; }
          .grid-modos { grid-template-columns: 1fr !important; }
          .grid-steps { grid-template-columns: 1fr !important; }
          .section-inner { padding: 0 24px !important; }
        }
      `}</style>

      <main style={{ background: '#0d0f1a', minHeight: '100vh' }}>

        {/* ══════════════════════════════════════════
            SEÇÃO 1 — HERO
        ══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            height: '100vh',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Fundo — lago SVG animado */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #080a12 0%, #0d0f1a 45%, #0a1a1a 100%)',
          }} />

          {/* Lua */}
          <div style={{
            position: 'absolute',
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 38%, #f0e4b2, #e8d9a0 40%, #c4aa6a)',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 2,
          }}>
            {/* Halo */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,217,160,0.18) 0%, transparent 70%)',
              animation: 'glow 4s ease-in-out infinite',
            }} />
          </div>

          {/* Reflexo dourado na água */}
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '3px',
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(196,170,106,0.7), rgba(196,170,106,0.1), transparent)',
            filter: 'blur(2px)',
            animation: 'ripple 3s ease-in-out infinite',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '80px',
            background: 'radial-gradient(ellipse, rgba(196,170,106,0.12) 0%, transparent 70%)',
            animation: 'ripple 3.5s ease-in-out infinite',
            zIndex: 1,
          }} />

          {/* Silhueta */}
          <div style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
          }}>
            <svg width="28" height="72" viewBox="0 0 28 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cabeça */}
              <ellipse cx="14" cy="7" rx="5.5" ry="6" fill="#050608"/>
              {/* Corpo */}
              <path d="M8 13 C6 20 5 32 6 44 L10 44 L10 36 L14 38 L18 36 L18 44 L22 44 C23 32 22 20 20 13 Z" fill="#050608"/>
              {/* Pernas */}
              <path d="M10 44 L8 65 L12 65 L14 52 L16 65 L20 65 L18 44 Z" fill="#050608"/>
            </svg>
          </div>

          {/* Partículas */}
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              bottom: `${22 + i * 4}%`,
              left: `${46 + (i % 3) * 3}%`,
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              background: '#c4aa6a',
              opacity: 0,
              '--drift': `${(i % 2 === 0 ? 1 : -1) * (8 + i * 4)}px`,
              animation: `particleRise ${2.5 + i * 0.4}s ease-out ${i * 0.6}s infinite`,
            } as React.CSSProperties} />
          ))}

          {/* Linha do horizonte */}
          <div style={{
            position: 'absolute',
            bottom: '24%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(196,170,106,0.12), transparent)',
          }} />

          {/* Texto hero */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            padding: '0 24px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}>
            <h1
              className="hero-tagline"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(38px, 6vw, 68px)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#e8d9a0',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                marginBottom: '24px',
                animation: visible ? 'taglineFade 1s ease forwards' : 'none',
                animationDelay: '0.2s',
                opacity: 0,
              }}
            >
              Quando você perdeu<br />a si mesmo?
            </h1>

            <p
              className="hero-sub"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 300,
                color: '#e8d9a0',
                lineHeight: 1.7,
                maxWidth: '440px',
                margin: '0 auto 40px',
                animation: visible ? 'subtitleFade 1s ease forwards' : 'none',
                animationDelay: '0.6s',
                opacity: 0,
              }}
            >
              Não é falta de disciplina.<br />É falta de direção interna.
            </p>

            <div style={{
              animation: visible ? 'ctaFade 1s ease forwards' : 'none',
              animationDelay: '1s',
              opacity: 0,
            }}>
              <button
                className="cta-btn"
                onClick={() => router.push('/login')}
              >
                Começar gratuitamente
              </button>
              <p style={{
                marginTop: '16px',
                fontSize: '13px',
                color: 'rgba(232, 217, 160, 0.4)',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.04em',
              }}>
                Sem cartão. Sem compromisso.
              </p>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            opacity: 0.3,
            animation: visible ? 'ctaFade 1s ease forwards' : 'none',
            animationDelay: '1.8s',
          }}>
            <div style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, transparent, #c4aa6a)',
              animation: 'float 2s ease-in-out infinite',
            }} />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEÇÃO 2 — DOR (o espelho)
        ══════════════════════════════════════════ */}
        <section
          ref={section2Ref}
          className="section-fade"
          style={{
            padding: 'clamp(80px, 12vh, 140px) 0',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          <div className="section-inner" style={{ padding: '0 40px' }}>
            <DorFrase delay={0}>
              Você termina o dia sem saber onde as horas foram.
            </DorFrase>
            <DorFrase delay={150}>
              Você sabe o que precisa fazer. E não começa.
            </DorFrase>
            <DorFrase delay={300}>
              Você se distancia de si mesmo sem perceber por quê.
            </DorFrase>
          </div>
        </section>

        {/* Divisor */}
        <div style={{
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, rgba(196,170,106,0.2), transparent)',
          margin: '0 auto',
        }} />

        {/* ══════════════════════════════════════════
            SEÇÃO 3 — O QUE É
        ══════════════════════════════════════════ */}
        <section
          ref={section3Ref}
          className="section-fade"
          style={{
            padding: 'clamp(80px, 12vh, 140px) 0',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div className="section-inner" style={{ padding: '0 40px' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#c4aa6a',
              marginBottom: '32px',
            }}>
              O que é a Travessia
            </p>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#e8d9a0',
              lineHeight: 1.4,
              marginBottom: '24px',
            }}>
              Uma conversa que revela.<br />Não uma ferramenta que resolve.
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '17px',
              fontWeight: 300,
              color: 'rgba(232, 217, 160, 0.6)',
              lineHeight: 1.8,
              maxWidth: '560px',
              margin: '0 auto 60px',
            }}>
              Travessia é autoconhecimento guiado por inteligência artificial.
              Não é terapia. Não é coaching. Não é app de produtividade.
              É outra coisa.
            </p>

            {/* Cards dos modos */}
            <div className="grid-modos" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              textAlign: 'left',
            }}>
              {[
                { icone: '≡', nome: 'Explorar', desc: 'O que está embaixo do que você sente' },
                { icone: '∞', nome: 'Integrar', desc: 'Quem você é de verdade' },
                { icone: '~', nome: 'Origem',   desc: 'Como você aprendeu a ser assim' },
                { icone: '⊙', nome: 'Sentido',  desc: 'Para onde você está indo' },
              ].map((m, i) => (
                <div key={i} className="modo-card">
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    color: '#c4aa6a',
                    marginBottom: '12px',
                  }}>{m.icone}</div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '20px',
                    fontWeight: 400,
                    color: '#e8d9a0',
                    marginBottom: '6px',
                  }}>{m.nome}</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 300,
                    color: 'rgba(232, 217, 160, 0.45)',
                    lineHeight: 1.5,
                  }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divisor */}
        <div style={{
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, rgba(196,170,106,0.2), transparent)',
          margin: '0 auto',
        }} />

        {/* ══════════════════════════════════════════
            SEÇÃO 4 — COMO FUNCIONA
        ══════════════════════════════════════════ */}
        <section
          ref={section4Ref}
          className="section-fade"
          style={{
            padding: 'clamp(80px, 12vh, 140px) 0',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <div className="section-inner" style={{ padding: '0 40px' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#c4aa6a',
              marginBottom: '48px',
              textAlign: 'center',
            }}>
              Como funciona
            </p>

            <div className="grid-steps" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px',
            }}>
              {[
                { n: '01', titulo: 'Você cria uma conta',        desc: 'Em 30 segundos. Só email e nome.' },
                { n: '02', titulo: 'Escolhe por onde começar',    desc: 'Explorar, integrar, buscar origem ou sentido.' },
                { n: '03', titulo: 'A conversa começa',           desc: 'Perguntas que ninguém te fez antes.' },
                { n: '04', titulo: 'Algo se move',                desc: 'Você não sai com uma resposta. Sai diferente.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div className="step-num">{s.n}</div>
                  <div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '18px',
                      color: '#e8d9a0',
                      marginBottom: '6px',
                      fontWeight: 400,
                    }}>{s.titulo}</div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '14px',
                      fontWeight: 300,
                      color: 'rgba(232, 217, 160, 0.45)',
                      lineHeight: 1.6,
                    }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEÇÃO 5 — CTA FINAL
        ══════════════════════════════════════════ */}
        <section
          ref={section5Ref}
          className="section-fade"
          style={{
            padding: 'clamp(100px, 16vh, 180px) 0',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Glow de fundo */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(196,170,106,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#e8d9a0',
              lineHeight: 1.3,
              marginBottom: '20px',
            }}>
              A primeira travessia<br />é gratuita.
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 300,
              color: 'rgba(232, 217, 160, 0.45)',
              marginBottom: '48px',
            }}>
              Sem cartão. Sem compromisso. Sem pressa.
            </p>

            <button
              className="cta-btn"
              onClick={() => router.push('/login')}
            >
              Começar agora
            </button>

            <p style={{
              marginTop: '20px',
              fontSize: '12px',
              color: 'rgba(232, 217, 160, 0.25)',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.04em',
            }}>
              Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer style={{
          borderTop: '1px solid rgba(196, 170, 106, 0.08)',
          padding: '32px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '18px',
            fontStyle: 'italic',
            color: 'rgba(232, 217, 160, 0.3)',
          }}>
            Travessia
          </span>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a
              href="/privacidade"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: 'rgba(232, 217, 160, 0.3)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,217,160,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,217,160,0.3)')}
            >
              Privacidade
            </a>
            <a
              href="/login"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: 'rgba(232, 217, 160, 0.3)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,217,160,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,217,160,0.3)')}
            >
              Entrar
            </a>
          </div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: 'rgba(232, 217, 160, 0.2)',
            letterSpacing: '0.04em',
          }}>
            © 2026 Travessia
          </span>
        </footer>
      </main>
    </>
  )
}

/* ── COMPONENTE AUXILIAR: frase com fade-in por scroll ── */
function DorFrase({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          setTimeout(() => {
            ref.current?.classList.add('frase-visible')
          }, delay)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="dor-frase">
      {children}
    </div>
  )
}