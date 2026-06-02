'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Perfil() {
  const [aba, setAba] = useState<'perfil' | 'conta'>('perfil')
  const [nomeChamado, setNomeChamado] = useState('')
  const [profissao, setProfissao] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [assinante, setAssinante] = useState(false)
  const [loading, setLoading] = useState(false)
  const [salvou, setSalvou] = useState(false)
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false)
  const router = useRouter()

  useEffect(() => { carregarPerfil() }, [])

  async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setEmail(user.email || '')
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile) {
      setNomeChamado(profile.nome_chamado || '')
      setProfissao(profile.profissao || '')
      setNascimento(profile.data_nascimento || '')
      setAssinante(profile.assinante || false)
      if (!profile.nome_chamado) setPrimeiroAcesso(true)
    }
  }

  async function salvarPerfil() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    await supabase.from('profiles').upsert({ id: user.id, nome_chamado: nomeChamado, profissao, data_nascimento: nascimento })
    setLoading(false)
    setSalvou(true)
    setTimeout(() => setSalvou(false), 2500)
    if (primeiroAcesso) router.push('/')
  }

  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const inputStyle = { width: '100%', background: '#141414', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '12px 16px', color: '#ccc', fontSize: '14px', fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { color: '#3a3a3a', fontSize: '11px', marginBottom: '6px', display: 'block' as const, letterSpacing: '0.04em' }

  if (primeiroAcesso && !nomeChamado) {
    return (
      <main style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
        <div style={{ width: '100%', maxWidth: '380px', padding: '48px 32px' }}>
          <h1 style={{ color: '#e8dcc8', fontSize: '28px', fontWeight: '300', fontStyle: 'italic', textAlign: 'center', marginBottom: '8px' }}>Travessia</h1>
          <p style={{ color: '#3a3a3a', fontSize: '10px', textAlign: 'center', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '40px' }}>Antes de começar</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Como gostaria de ser chamado?</label>
              <input type="text" placeholder="Seu nome ou apelido" value={nomeChamado} onChange={e => setNomeChamado(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Qual é a sua profissão?</label>
              <input type="text" placeholder="Ex: estudante, designer, médico..." value={profissao} onChange={e => setProfissao(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data de nascimento</label>
              <input type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={salvarPerfil} disabled={loading || !nomeChamado} style={{ background: !nomeChamado ? '#1a1a1a' : '#e8dcc8', border: 'none', borderRadius: '8px', padding: '14px', color: !nomeChamado ? '#333' : '#0f0f0f', fontSize: '13px', fontFamily: 'Georgia, serif', cursor: !nomeChamado ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
              {loading ? '...' : 'Começar minha Travessia'}
            </button>
          </div>
          <p style={{ color: '#1e1e1e', fontSize: '9px', textAlign: 'center', marginTop: '32px', letterSpacing: '0.05em' }}>Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.</p>
        </div>
        <style>{`input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus { -webkit-box-shadow: 0 0 0px 1000px #141414 inset !important; -webkit-text-fill-color: #ccc !important; border: 1px solid #1e1e1e !important; }`}</style>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <span onClick={() => router.push('/')} style={{ color: '#3a3a3a', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.04em' }}>← voltar</span>
          <h1 style={{ color: '#e8dcc8', fontSize: '20px', fontWeight: '300', fontStyle: 'italic', margin: 0 }}>Travessia</h1>
          <span style={{ width: '48px' }} />
        </div>

        <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '1px solid #1a1a1a' }}>
          {(['perfil', 'conta'] as const).map(a => (
            <button key={a} onClick={() => setAba(a)} style={{ background: 'none', border: 'none', borderBottom: aba === a ? '1px solid #c4aa6a' : '1px solid transparent', marginBottom: '-1px', padding: '10px 20px', color: aba === a ? '#e8dcc8' : '#3a3a3a', fontSize: '12px', fontFamily: 'Georgia, serif', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {a === 'perfil' ? 'Perfil' : 'Conta'}
            </button>
          ))}
        </div>

        {aba === 'perfil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Como gostaria de ser chamado?</label>
              <input type="text" placeholder="Seu nome ou apelido" value={nomeChamado} onChange={e => setNomeChamado(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Profissão</label>
              <input type="text" placeholder="Ex: estudante, designer, médico..." value={profissao} onChange={e => setProfissao(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data de nascimento</label>
              <input type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="text" value={email} disabled style={{ ...inputStyle, color: '#2e2e2e', cursor: 'not-allowed' }} />
            </div>
            <button onClick={salvarPerfil} disabled={loading || !nomeChamado} style={{ background: '#e8dcc8', border: 'none', borderRadius: '8px', padding: '13px', color: '#0f0f0f', fontSize: '13px', fontFamily: 'Georgia, serif', cursor: 'pointer', marginTop: '8px' }}>
              {loading ? '...' : salvou ? 'Salvo!' : 'Salvar alterações'}
            </button>
          </div>
        )}

        {aba === 'conta' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '20px' }}>
              <p style={{ color: '#3a3a3a', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Plano atual</p>
              <p style={{ color: '#e8dcc8', fontSize: '18px', fontStyle: 'italic', marginBottom: '4px' }}>{assinante ? 'Assinante' : 'Gratuito'}</p>
              <p style={{ color: '#3a3a3a', fontSize: '12px' }}>{assinante ? 'R$ 37/mês · acesso completo' : '10 mensagens gratuitas por conversa'}</p>
              {!assinante && (
                <button onClick={() => router.push('/assinar')} style={{ marginTop: '16px', background: '#e8dcc8', border: 'none', borderRadius: '8px', padding: '11px 20px', color: '#0f0f0f', fontSize: '12px', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
                  Assinar — R$ 37/mês
                </button>
              )}
            </div>

            {assinante && (
              <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '20px' }}>
                <p style={{ color: '#3a3a3a', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Cancelar assinatura</p>
                <p style={{ color: '#3a3a3a', fontSize: '12px', lineHeight: '1.6', marginBottom: '16px' }}>Para cancelar sua assinatura, envie um email para <span style={{ color: '#c4aa6a' }}>travessia.chat@gmail.com</span> com o assunto "Cancelar assinatura". Processamos em até 24h.</p>
              </div>
            )}

            <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '20px' }}>
              <p style={{ color: '#3a3a3a', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Excluir conta</p>
              <p style={{ color: '#3a3a3a', fontSize: '12px', lineHeight: '1.6', marginBottom: '16px' }}>Para excluir sua conta e todos os seus dados, envie um email para <span style={{ color: '#c4aa6a' }}>travessia.chat@gmail.com</span> com o assunto "Excluir minha conta". Processamos em até 30 dias conforme nossa Política de Privacidade.</p>
            </div>

            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px' }}>
              <button onClick={sair} style={{ background: 'none', border: 'none', color: '#3a3a3a', fontSize: '12px', fontFamily: 'Georgia, serif', cursor: 'pointer', padding: '0' }}>
                Sair da conta
              </button>
            </div>
          </div>
        )}

        <p style={{ color: '#1a1a1a', fontSize: '9px', textAlign: 'center', marginTop: '48px', letterSpacing: '0.05em' }}>
          Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.
        </p>
      </div>
      <style>{`input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus { -webkit-box-shadow: 0 0 0px 1000px #141414 inset !important; -webkit-text-fill-color: #ccc !important; border: 1px solid #1e1e1e !important; }`}</style>
    </main>
  )
}
