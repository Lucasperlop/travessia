'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState(0)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [nomeChamado, setNomeChamado] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [assinante, setAssinante] = useState(false)
  const [modo, setModo] = useState('mode_freud')
  const [menuAberto, setMenuAberto] = useState(false)
  const [ouvindo, setOuvindo] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  const phases = ['Abertura', 'Infância', 'Dobras', 'Presente', 'Reencontro']

  const modos = [
    { id: 'mode_freud',     nome: 'Explorar',   descricao: 'O que está embaixo',              icone: '≡' },
    { id: 'mode_jung',      nome: 'Integrar',   descricao: 'Quem você é de verdade',          icone: '∞' },
    { id: 'mode_winnicott', nome: 'Origem',     descricao: 'Como você aprendeu a ser',        icone: '~' },
    { id: 'mode_frankl',    nome: 'Sentido',    descricao: 'Para onde você está indo',        icone: '⊙' },
    { id: 'mode_12camadas', nome: '12 Camadas', descricao: 'Sua personalidade fundo a fundo', icone: '◈', locked: true },
  ]

  const mapas = [
    { id: 'map_apego',     nome: 'Como você se conecta',      descricao: 'Estilo de vínculo',          icone: '♡' },
    { id: 'map_tracos',    nome: 'Como você é',               descricao: 'Seus traços mais profundos', icone: '◯' },
    { id: 'map_cognitivo', nome: 'Como você pensa',           descricao: 'Seu modo de ver o mundo',    icone: '◎' },
    { id: 'map_pressao',   nome: 'Como você age sob pressão', descricao: 'Seu padrão de reação',       icone: '△' },
    { id: 'map_forcas',    nome: 'Suas forças naturais',      descricao: 'O que te move sem esforço',  icone: '✦' },
    { id: 'map_valores',   nome: 'O que te move',             descricao: 'Seus valores vividos',       icone: '◇' },
    { id: 'map_ambiente',  nome: 'Onde você floresce',        descricao: 'Seu ambiente ideal',         icone: '⌂' },
    { id: 'map_vinculo',   nome: 'Como você recebe',          descricao: 'Como percebe afeto',         icone: '❋' },
  ]

  useEffect(() => { checkAuthAndLoad() }, [])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)
    const { data: profile } = await supabase.from('profiles').select('nome_chamado, assinante').eq('id', user.id).single()
    if (profile?.nome_chamado) setNomeChamado(profile.nome_chamado)
    if (profile?.assinante) setAssinante(profile.assinante)
    const { data: conv } = await supabase.from('conversations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single()
    if (conv && conv.messages && conv.messages.length > 0) {
      setMessages(conv.messages); setPhase(conv.phase || 0); setConversationId(conv.id)
      if (conv.modo) setModo(conv.modo)
    } else { startConversation(user.id) }
  }

  async function startConversation(uid: string) {
    setLoading(true)
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: uid, modo, messages: [{ role: 'user', content: 'Inicie a conversa com acolhimento breve e gentil, termine perguntando como a pessoa está chegando hoje.' }] }) })
    const data = await res.json()
    if (data.paywall) { router.push('/assinar'); return }
    const firstMsg = [{ role: 'assistant', content: data.content }]
    setMessages(firstMsg)
    const { data: conv } = await supabase.from('conversations').insert({ user_id: uid, messages: firstMsg, phase: 0, modo }).select().single()
    if (conv) setConversationId(conv.id)
    setLoading(false)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages); setInput(''); setLoading(true)
    const newPhase = newMessages.length % 6 === 0 && phase < 4 ? phase + 1 : phase
    if (newPhase !== phase) setPhase(newPhase)
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, userId, modo }) })
    const data = await res.json()
    if (data.paywall) { router.push('/assinar'); return }
    const updatedMessages = [...newMessages, { role: 'assistant', content: data.content }]
    setMessages(updatedMessages)
    if (conversationId) { await supabase.from('conversations').update({ messages: updatedMessages, phase: newPhase, modo, updated_at: new Date().toISOString() }).eq('id', conversationId) }
    setLoading(false)
  }

  function toggleMicrofone() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.')
      return
    }

    if (ouvindo) {
      recognitionRef.current?.stop()
      setOuvindo(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const texto = event.results[0][0].transcript
      setInput(prev => prev ? prev + ' ' + texto : texto)
      setOuvindo(false)
    }

    recognition.onerror = () => setOuvindo(false)
    recognition.onend = () => setOuvindo(false)

    recognitionRef.current = recognition
    recognition.start()
    setOuvindo(true)
  }

  function selecionarModo(m: typeof modos[0]) {
    if (m.locked && !assinante) { router.push('/assinar'); return }
    setModo(m.id); setMenuAberto(false)
  }

  async function sair() { await supabase.auth.signOut(); router.push('/login') }

  const iniciais = nomeChamado ? nomeChamado.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  const modoAtivo = modos.find(m => m.id === modo)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', fontFamily: 'Georgia, serif' }}>

      {menuAberto && (
        <div onClick={() => setMenuAberto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10 }} />
      )}

      {/* ── SIDEBAR ── */}
      <div
        className={`sidebar ${menuAberto ? 'sidebar-open' : ''}`}
        style={{
          width: '210px', minWidth: '210px',
          background: '#0d0d0d',
          borderRight: '1px solid var(--border-surface)',
          display: 'flex', flexDirection: 'column',
          position: 'sticky', top: 0,
          height: '100vh',
          overflow: 'hidden',
          zIndex: 20,
        }}
      >
        {/* Topo */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border-surface)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--accent)', fontWeight: '600', flexShrink: 0 }}>
            {iniciais}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nome-usuario" style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nomeChamado || 'Você'}
            </div>
            <div className="status-plano" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {assinante ? 'Assinante' : 'Plano gratuito'}
            </div>
          </div>
          <span onClick={() => router.push('/perfil')} style={{ fontSize: '15px', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>⚙</span>
        </div>

        {/* Meio — scrola */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

          <div style={{ padding: '16px 14px 8px' }}>
            <div className="label-secao" style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>Conversa</div>
            <div style={{ fontSize: '9px', color: '#2a2a2a', marginBottom: '10px' }}>Escolha como quer se mover</div>
            {modos.map(m => (
              <button
                key={m.id}
                onClick={() => selecionarModo(m)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '9px',
                  width: '100%', background: 'none', border: 'none',
                  borderLeft: modo === m.id ? '2px solid var(--accent)' : '2px solid transparent',
                  padding: '7px 0 7px 10px', cursor: 'pointer', textAlign: 'left', marginBottom: '1px',
                }}
              >
                <span style={{ fontSize: '12px', color: modo === m.id ? 'var(--accent)' : '#2e2e2e', flexShrink: 0, marginTop: '1px', fontFamily: 'monospace' }}>
                  {m.icone}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nome-modo" style={{ fontSize: '11px', color: modo === m.id ? 'var(--foreground)' : '#444', fontWeight: modo === m.id ? '600' : '400', fontFamily: 'Georgia, serif' }}>
                    {m.nome}
                  </div>
                  <div className="desc-modo" style={{ fontSize: '9px', color: '#2a2a2a', marginTop: '1px' }}>{m.descricao}</div>
                </div>
                {m.locked && !assinante && <span style={{ fontSize: '10px', color: 'var(--accent)', flexShrink: 0 }}>🔒</span>}
              </button>
            ))}
          </div>

          <div style={{ height: '1px', background: 'var(--border-surface)', margin: '4px 0' }} />

          <div style={{ padding: '12px 14px 8px' }}>
            <div className="label-secao" style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>Você se conhece?</div>
            <div style={{ fontSize: '9px', color: '#2a2a2a', marginBottom: '10px' }}>Cada mapa revela uma camada diferente</div>
            {mapas.map(m => (
              <button
                key={m.id}
                onClick={() => { if (!assinante) router.push('/assinar') }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', width: '100%', background: 'none', border: 'none', padding: '6px 0 6px 10px', cursor: 'pointer', textAlign: 'left', marginBottom: '1px' }}
              >
                <span style={{ fontSize: '11px', color: '#2a2a2a', flexShrink: 0, marginTop: '1px' }}>{m.icone}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '10px', color: '#3a3a3a', fontFamily: 'Georgia, serif' }}>{m.nome}</div>
                  <div style={{ fontSize: '8px', color: '#252525', marginTop: '1px' }}>{m.descricao}</div>
                </div>
                {!assinante && <span style={{ fontSize: '10px', color: 'var(--accent)', flexShrink: 0 }}>🔒</span>}
              </button>
            ))}
          </div>

        </div>

        {/* Rodapé */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-surface)', flexShrink: 0 }}>
          <button onClick={sair} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '10px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
            Sair
          </button>
        </div>
      </div>

      {/* ── ÁREA PRINCIPAL ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-surface)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span onClick={() => setMenuAberto(!menuAberto)} className="menu-hamburguer" style={{ fontSize: '18px', color: '#444', cursor: 'pointer', display: 'none', marginRight: '4px' }}>☰</span>
          <span style={{ fontSize: '15px', color: 'var(--foreground)', fontStyle: 'italic', flex: 1 }}>Conversa</span>
          <span style={{ fontSize: '10px', color: 'var(--background)', background: 'var(--foreground)', padding: '3px 10px', borderRadius: '20px', fontFamily: 'Georgia, serif' }}>
            {modoAtivo?.nome}
          </span>
          <span style={{ color: '#2a2a2a', fontSize: '14px', cursor: 'pointer' }}>✎</span>
          <span style={{ color: '#2a2a2a', fontSize: '14px', cursor: 'pointer' }}>◷</span>
        </div>

        {/* Fase */}
        <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {phases[phase]}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
          {phases.map((_, i) => (
            <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: i === phase ? 'var(--dot-active)' : i < phase ? 'var(--dot-done)' : 'var(--dot-inactive)' }} />
          ))}
        </div>

        {/* Mensagens */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <span style={{ fontSize: '8px', color: '#2e2e2e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {msg.role === 'user' ? (nomeChamado || 'Você').toUpperCase() : 'TRAVESSIA'}
              </span>
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                background: msg.role === 'user' ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                border: '1px solid var(--border-surface)',
                color: msg.role === 'user' ? 'var(--text-secondary)' : 'var(--foreground)',
                fontSize: '14px', lineHeight: '1.65',
                fontStyle: msg.role === 'assistant' ? 'italic' : 'normal',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '5px', padding: '10px 4px' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--border)' }} />)}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '0 20px 18px' }}>
          <p style={{ textAlign: 'center', fontSize: '9px', color: '#222', marginBottom: '8px', letterSpacing: '0.04em' }}>
            O Travessia revela, não aconselha · Em crise, ligue 188
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', background: 'var(--bg-surface)', border: '1px solid var(--border-surface)', borderRadius: '12px', padding: '10px 12px' }}>
            <textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={ouvindo ? 'Ouvindo...' : 'Escreva aqui com liberdade...'}
              rows={2}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'Georgia, serif', resize: 'none', outline: 'none', lineHeight: '1.5' }}
            />
            {/* Botão microfone */}
            <button
              onClick={toggleMicrofone}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: ouvindo ? 'var(--accent)' : 'transparent',
                border: `1px solid ${ouvindo ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              🎙️
            </button>
            {/* Botão enviar */}
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--cta-bg)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'var(--cta-text)', flexShrink: 0 }}
            >↑</button>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar { transition: transform 0.3s ease; }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 0; left: 0;
            width: 100vw !important;
            min-width: 100vw !important;
            height: 100vh;
            transform: translateX(-100%);
          }
          .sidebar.sidebar-open { transform: translateX(0); }
          .menu-hamburguer { display: block !important; }

          /* Textos maiores no mobile */
          .sidebar .nome-usuario  { font-size: 15px !important; }
          .sidebar .status-plano  { font-size: 12px !important; }
          .sidebar .label-secao   { font-size: 11px !important; }
          .sidebar .nome-modo     { font-size: 15px !important; }
          .sidebar .desc-modo     { font-size: 12px !important; color: #555 !important; }
        }

        @keyframes pulsar {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .mic-ativo { animation: pulsar 1s ease-in-out infinite; }
      `}</style>
    </main>
  )
}