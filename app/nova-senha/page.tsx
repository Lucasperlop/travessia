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
      backgroundColor: '#0d0f1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <h1 style={{
          color: '#e8d9a0',
          fontSize: '24px',
          fontWeight: '300',
          textAlign: 'center',
          letterSpacing: '0.05em'
        }}>
          Nova senha
        </h1>

        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
          Digite sua nova senha abaixo.
        </p>

        <input
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            backgroundColor: '#1a1d2e',
            border: '1px solid #2a2d3e',
            borderRadius: '8px',
            padding: '14px 16px',
            color: '#e8d9a0',
            fontSize: '16px',
            outline: 'none',
            width: '100%'
          }}
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          style={{
            backgroundColor: '#1a1d2e',
            border: '1px solid #2a2d3e',
            borderRadius: '8px',
            padding: '14px 16px',
            color: '#e8d9a0',
            fontSize: '16px',
            outline: 'none',
            width: '100%'
          }}
        />

        {erro && (
          <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center' }}>
            {erro}
          </p>
        )}

        {mensagem && (
          <p style={{ color: '#6bcb77', fontSize: '14px', textAlign: 'center' }}>
            {mensagem}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{
            backgroundColor: '#c4aa6a',
            color: '#0d0f1a',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: carregando ? 'not-allowed' : 'pointer',
            opacity: carregando ? 0.7 : 1
          }}
        >
          {carregando ? 'Atualizando...' : 'Atualizar senha'}
        </button>
      </div>
    </div>
  )
}