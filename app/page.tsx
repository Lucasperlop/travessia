'use client'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState(0)
  const chatEndRef = useRef(null)

  const phases = ['Abertura', 'Infância', 'Dobras', 'Presente', 'Reencontro']

  useEffect(() => {
    startConversation()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startConversation() {
    setLoading(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Inicie a conversa com acolhimento breve e gentil, termine perguntando como a pessoa está chegando hoje.' }]
      })
    })
    const data = await res.json()
    setMessages([{ role: 'assistant', content: data.message }])
    setLoading(false)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    if (newMessages.length % 6 === 0 && phase < 4) setPhase(p => p + 1)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    })
    const data = await res.json()
    setMessages([...newMessages, { role: 'assistant', content: data.message }])
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', height: '90vh' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#e8dcc8', fontSize: '28px', fontWeight: '300', letterSpacing: '0.15em', fontStyle: 'italic', margin: 0 }}>Travessia</h1>
          <p style={{ color: '#666', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '8px' }}>
            {phases[phase]}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
            {phases.map((_, i) => (
              <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === phase ? '#e8dcc8' : i < phase ? '#666' : '#333' }} />
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '8px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%',
                padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                background: msg.role === 'user' ? '#1a1a1a' : 'transparent',
                border: msg.role === 'user' ? '1px solid #333' : 'none',
                color: msg.role === 'user' ? '#ccc' : '#e8dcc8',
                fontSize: '15px',
                lineHeight: '1.7',
                fontStyle: msg.role === 'assistant' ? 'italic' : 'normal'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '6px', padding: '14px 4px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#666', animation: `pulse 1.2s ease infinite ${i * 0.2}s` }} />
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Escreva aqui com liberdade..."
            rows={2}
            style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', resize: 'none', outline: 'none' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#e8dcc8', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ↑
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#444', marginTop: '12px', letterSpacing: '0.05em' }}>
          Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.
        </p>
      </div>
    </main>
  )
}