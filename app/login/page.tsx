'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  async function handleSubmit() {
    setLoading(true)
    setErro('')
    if (modo === 'cadastrar') {
      const { error } = await supabase.auth.signUp({ email, password: senha })
      if (error) { setErro(error.message); setLoading(false); return }
      router.push('/perfil')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) { setErro('Email ou senha incorretos'); setLoading(false); return }
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        <h1 style={{ color: '#e8dcc8', fontSize: '28px', fontWeight: '300', fontStyle: 'italic', textAlign: 'center', marginBottom: '8px' }}>Travessia</h1>
        <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '40px' }}>
          {modo === 'entrar' ? 'Bem-vindo de volta' : 'Começar a jornada'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none' }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none' }}
          />

          {erro && <p style={{ color: '#e88', fontSize: '13px', textAlign: 'center' }}>{erro}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: '#e8dcc8', border: 'none', borderRadius: '8px', padding: '14px', color: '#0f0f0f', fontSize: '14px', fontFamily: 'Georgia, serif', cursor: 'pointer', marginTop: '8px' }}>
            {loading ? '...' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>

          <p
            onClick={() => setModo(modo === 'entrar' ? 'cadastrar' : 'entrar')}
            style={{ color: '#666', fontSize: '13px', textAlign: 'center', cursor: 'pointer', marginTop: '8px' }}>
            {modo === 'entrar' ? 'Não tem conta? Cadastrar' : 'Já tem conta? Entrar'}
          </p>
        </div>
      </div>
    </main>
  )
}