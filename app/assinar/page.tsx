'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Assinar() {
  const [loading, setLoading] = useState(false);

  async function handleAssinar() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        email: user?.email,
      }),
    });

    const { url } = await response.json();
    window.location.href = url;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Sua jornada está apenas começando
      </h1>
      <p style={{ color: '#aaa', marginBottom: '2rem', maxWidth: '400px' }}>
        Você completou sua sessão gratuita. Continue sua Travessia por R$ 37/mês.
      </p>
      <button
        onClick={handleAssinar}
        disabled={loading}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1rem',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Redirecionando...' : 'Assinar por R$ 37/mês'}
      </button>
      <p style={{ color: '#555', marginTop: '1rem', fontSize: '0.8rem' }}>
        Este não é um serviço de saúde mental. É uma ferramenta de autoconhecimento.
      </p>
    </div>
  );
}