'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Assinar() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAssinar() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id, email: user?.email }),
    })
    const data = await response.json()
    if (data.url) { window.location.href = data.url }
    else { console.error('Erro checkout:', data); setLoading(false) }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>

        <h1 style={{ color: '#e8dcc8', fontSize: '28px', fontWeight: '300', fontStyle: 'italic', marginBottom: '8px' }}>Travessia</h1>
        <p style={{ color: '#3a3a3a', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '56px' }}>Acesso completo</p>

        <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '36px 32px', marginBottom: '24px' }}>

          <p style={{ color: '#3a3a3a', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>O que você recebe</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              'Conversas ilimitadas',
              '4 modos de autoconhecimento desbloqueados',
              '12 Camadas da Personalidade',
              '8 Mapas de Perfil',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#c4aa6a', fontSize: '12px', marginTop: '1px', flexShrink: 0 }}>·</span>
                <span style={{ color: '#555', fontSize: '13px', lineHeight: '1.5' }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '24px', marginBottom: '24px' }}>
            <p style={{ color: '#e8dcc8', fontSize: '32px', fontWeight: '300', fontStyle: 'italic', marginBottom: '4px' }}>R$ 37</p>
            <p style={{ color: '#3a3a3a', fontSize: '11px', letterSpacing: '0.06em' }}>por mês</p>
          </div>

          <button onClick={handleAssinar} disabled={loading} style={{ width: '100%', background: '#e8dcc8', border: 'none', borderRadius: '8px', padding: '15px', color: '#0f0f0f', fontSize: '13px', fontFamily: 'Georgia, serif', cursor: loading ? 'wait' : 'pointer', letterSpacing: '0.04em' }}>
            {loading ? 'Redirecionando...' : 'Começar assinatura'}
          </button>
        </div>

        <span onClick={() => router.push('/')} style={{ color: '#2a2a2a', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.04em' }}>
          ← voltar
        </span>

        <p style={{ color: '#1a1a1a', fontSize: '9px', marginTop: '40px', letterSpacing: '0.05em' }}>
          Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.
        </p>
      </div>
    </main>
  )
}
