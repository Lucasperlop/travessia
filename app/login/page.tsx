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
    setLoading(true); setErro(''); setMensagem('')
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
      setMensagem('Conta criada! Verifique seu email para confirmar.'); setLoading(false); return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      if (error.message.includes('Email not confirmed')) { setErro('Confirme seu email antes de entrar. Verifique sua caixa de entrada.') }
      else { setErro('Email ou senha incorretos.') }
      setLoading(false); return
    }
    router.push('/'); setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://www.travessiachat.com.br/' } })
  }

  const ctaBloqueado = modo === 'cadastrar' && !aceitouTermos

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-surface)',
    borderRadius: '8px',
    padding: '13px 16px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontFamily: 'Georgia, serif',
    outline: 'none',
    boxSizing: 'border-box' as const,
    WebkitAppearance: 'none' as const,
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '48px 32px' }}>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ color: 'var(--foreground)', fontSize: '32px', fontWeight: '300', fontStyle: 'italic', marginBottom: '8px' }}>
            Travessia
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {modo === 'entrar' ? 'Bem-vindo de volta' : modo === 'cadastrar' ? 'Começar a jornada' : 'Recuperar acesso'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <input type='email' placeholder='Seu email' value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

          {modo !== 'resetar' && (
            <input type='password' placeholder='Senha' value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
          )}

          {/* Checkbox LGPD */}
          {modo === 'cadastrar' && (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', paddingTop: '4px' }}>
              <input
                type='checkbox'
                checked={aceitouTermos}
                onChange={e => setAceitouTermos(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--accent)', width: '14px', height: '14px', flexShrink: 0 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.6' }}>
                Li e concordo com a{' '}
                <a href='/privacidade' target='_blank' style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                  Política de Privacidade
                </a>
              </span>
            </label>
          )}

          {/* Feedback */}
          {erro     && <p style={{ color: 'var(--error)',    fontSize: '12px', textAlign: 'center', margin: '0' }}>{erro}</p>}
          {mensagem && <p style={{ color: 'var(--foreground)', fontSize: '12px', textAlign: 'center', margin: '0' }}>{mensagem}</p>}

          {/* Botão principal */}
          <button
            onClick={handleSubmit}
            disabled={loading || ctaBloqueado}
            style={{
              background:  ctaBloqueado ? 'var(--bg-hover)'   : 'var(--cta-bg)',
              color:       ctaBloqueado ? 'var(--text-muted)'  : 'var(--cta-text)',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '13px',
              fontFamily: 'Georgia, serif',
              cursor: ctaBloqueado ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              letterSpacing: '0.04em',
            }}
          >
            {loading ? '...' : modo === 'entrar' ? 'Entrar' : modo === 'cadastrar' ? 'Criar conta' : 'Enviar email de recuperação'}
          </button>

          {/* Entrar com Google + esqueci senha */}
          {modo === 'entrar' && (
            <>
              <button
                onClick={handleGoogle}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-surface)',
                  borderRadius: '8px',
                  padding: '13px',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  fontFamily: 'Georgia, serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>G</span>
                Entrar com Google
              </button>
              <p
                onClick={() => { setModo('resetar'); setErro(''); setMensagem('') }}
                style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', cursor: 'pointer', marginTop: '4px' }}
              >
                Esqueci minha senha
              </p>
            </>
          )}

          {/* Alternar modo */}
          <p
            onClick={() => { setModo(modo === 'entrar' ? 'cadastrar' : 'entrar'); setErro(''); setMensagem(''); setAceitouTermos(false) }}
            style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', cursor: 'pointer', marginTop: '8px' }}
          >
            {modo === 'entrar' ? 'Não tem conta? Cadastrar' : modo === 'cadastrar' ? 'Já tem conta? Entrar' : 'Voltar para o login'}
          </p>

        </div>

        {/* Disclaimer */}
        <p style={{ color: 'var(--border-surface)', fontSize: '9px', textAlign: 'center', marginTop: '40px', letterSpacing: '0.05em' }}>
          Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.
        </p>

      </div>

      {/* Autofill override — usa variáveis CSS */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--bg-surface) inset !important;
          -webkit-text-fill-color: var(--text-secondary) !important;
          border: 1px solid var(--border-surface) !important;
        }
      `}</style>
    </main>
  )
}