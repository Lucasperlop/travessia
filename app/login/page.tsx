'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modo, setModo] = useState<'entrar' | 'cadastrar' | 'resetar'>('entrar')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    setLoading(true)
    setErro('')
    setMensagem('')
    if (modo === 'resetar') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://www.travessiachat.com.br/nova-senha' })
      if (error) { setErro('Erro ao enviar email. Tente novamente.'); setLoading(false); return }
      setMensagem('Email enviado! Verifique sua caixa de entrada.')
      setLoading(false); return
    }
    if (modo === 'cadastrar') {
      if (!aceitouTermos) { setErro('Você precisa aceitar a Política de Privacidade para criar uma conta.'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({ email, password: senha })
      if (error) { setErro(error.message); setLoading(false); return }
      setMensagem('Conta criada! Agora faça login.')
      setLoading(false); return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      if (error.message.includes('Email not confirmed')) { setErro('Confirme seu email antes de entrar. Verifique sua caixa de entrada.') }
      else { setErro('Email ou senha incorretos.') }
      setLoading(false); return
    }
    router.push('/')
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://www.travessiachat.com.br/' } })
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        <h1 style={{ color: '#e8dcc8', fontSize: '28px', fontWeight: '300', fontStyle: 'italic', textAlign: 'center', marginBottom: '8px' }}>Travessia</h1>
        <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '40px' }}>
          {modo === 'entrar' ? 'Bem-vindo de volta' : modo === 'cadastrar' ? 'Começar a jornada' : 'Recuperar acesso'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type='email' placeholder='Seu email' value={email} onChange={e => setEmail(e.target.value)} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none' }} />
          {modo !== 'resetar' && (<input type='password' placeholder='Senha' value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none' }} />)}
          {modo === 'cadastrar' && (<label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}><input type='checkbox' checked={aceitouTermos} onChange={e => setAceitouTermos(e.target.checked)} style={{ marginTop: '2px', accentColor: '#c4aa6a', width: '15px', height: '15px', flexShrink: 0 }} /><span style={{ color: '#888', fontSize: '12px', lineHeight: '1.5' }}>Li e concordo com a <a href='/privacidade' target='_blank' style={{ color: '#c4aa6a', textDecoration: 'underline' }}>Política de Privacidade</a></span></label>)}
          {erro && <p style={{ color: '#e88', fontSize: '13px', textAlign: 'center' }}>{erro}</p>}
          {mensagem && <p style={{ color: '#8e8', fontSize: '13px', textAlign: 'center' }}>{mensagem}</p>}
          <button onClick={handleSubmit} disabled={loading || (modo === 'cadastrar' && !aceitouTermos)} style={{ background: modo === 'cadastrar' && !aceitouTermos ? '#333' : '#e8dcc8', border: 'none', borderRadius: '8px', padding: '14px', color: modo === 'cadastrar' && !aceitouTermos ? '#666' : '#0f0f0f', fontSize: '14px', fontFamily: 'Georgia, serif', cursor: modo === 'cadastrar' && !aceitouTermos ? 'not-allowed' : 'pointer', marginTop: '8px', transition: 'all 0.2s' }}>{loading ? '...' : modo === 'entrar' ? 'Entrar' : modo === 'cadastrar' ? 'Criar conta' : 'Enviar email de recuperação'}</button>
          {modo === 'entrar' && (<><button onClick={handleGoogle} style={{ background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '14px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span>G</span> Entrar com Google</button><p onClick={() => { setModo('resetar'); setErro(''); setMensagem('') }} style={{ color: '#444', fontSize: '12px', textAlign: 'center', cursor: 'pointer' }}>Esqueci minha senha</p></>)}
          <p onClick={() => { setModo(modo === 'entrar' ? 'cadastrar' : 'entrar'); setErro(''); setMensagem(''); setAceitouTermos(false) }} style={{ color: '#666', fontSize: '13px', textAlign: 'center', cursor: 'pointer', marginTop: '4px' }}>{modo === 'entrar' ? 'Não tem conta? Cadastrar' : modo === 'cadastrar' ? 'Já tem conta? Entrar' : 'Voltar para o login'}</p>
        </div>
      </div>
    </main>
  )
}
