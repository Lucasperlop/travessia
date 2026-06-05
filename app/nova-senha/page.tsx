'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NovaSenha() {
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  useEffect(() => {}, [])

  async function handleSubmit() {
    setErro('')
    setMensagem('')

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setCarregando(false)

    if (error) {
      setErro('Erro ao atualizar a senha. Tente novamente.')
    } else {
      setMensagem('Senha atualizada com sucesso! Redirecionando...')
      setTimeout(() => router.push('/'), 2000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>

        <h1 style={{
          color: 'var(--foreground)',
          fontSize: '27px',
          fontWeight: '300',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}>
          Nova senha
        </h1>

        <p style={{ color: '#888', fontSize: '17px', textAlign: 'center' }}>
          Digite sua nova senha abaixo.
        </p>

        <input
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px 16px',
            color: 'var(--foreground)',
            fontSize: '17px',
            outline: 'none',
            width: '100%',
          }}
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px 16px',
            color: 'var(--foreground)',
            fontSize: '17px',
            outline: 'none',
            width: '100%',
          }}
        />

        {erro && (
          <p style={{ color: 'var(--error)', fontSize: '17px', textAlign: 'center' }}>
            {erro}
          </p>
        )}

        {mensagem && (
          <p style={{ color: 'var(--foreground)', fontSize: '17px', textAlign: 'center' }}>
            {mensagem}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{
            backgroundColor: 'var(--cta-bg)',
            color: 'var(--cta-text)',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '19px',
            fontWeight: '500',
            cursor: carregando ? 'not-allowed' : 'pointer',
            opacity: carregando ? 0.7 : 1,
          }}
        >
          {carregando ? 'Atualizando...' : 'Atualizar senha'}
        </button>

      </div>
    </div>
  )
}