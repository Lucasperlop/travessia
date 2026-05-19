'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Perfil() {
  const [nomeChamado, setNomeChamado] = useState('')
  const [profissao, setProfissao] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function salvarPerfil() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase.from('profiles').upsert({
      id: user.id,
      nome_chamado: nomeChamado,
      profissao: profissao,
      data_nascimento: nascimento
    })

    router.push('/')
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        <h1 style={{ color: '#e8dcc8', fontSize: '24px', fontWeight: '300', fontStyle: 'italic', textAlign: 'center', marginBottom: '8px' }}>Travessia</h1>
        <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '40px' }}>Antes de começar</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }}>Como gostaria de ser chamado?</p>
            <input
              type="text"
              placeholder="Seu nome ou apelido"
              value={nomeChamado}
              onChange={e => setNomeChamado(e.target.value)}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }}>Qual é a sua profissão?</p>
            <input
              type="text"
              placeholder="Ex: estudante, designer, professor..."
              value={profissao}
              onChange={e => setProfissao(e.target.value)}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }}>Data de nascimento</p>
            <input
              type="date"
              value={nascimento}
              onChange={e => setNascimento(e.target.value)}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={salvarPerfil}
            disabled={loading || !nomeChamado}
            style={{ background: '#e8dcc8', border: 'none', borderRadius: '8px', padding: '14px', color: '#0f0f0f', fontSize: '14px', fontFamily: 'Georgia, serif', cursor: 'pointer', marginTop: '8px' }}>
            {loading ? '...' : 'Começar minha Travessia'}
          </button>
        </div>

        <p style={{ color: '#444', fontSize: '10px', textAlign: 'center', marginTop: '24px', letterSpacing: '0.05em' }}>
          Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.
        </p>
      </div>
    </main>
  )
}