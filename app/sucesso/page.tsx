'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Sucesso() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push('/'), 5000);
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Bem-vindo à sua Travessia
      </h1>
      <p style={{ color: '#aaa' }}>
        Assinatura confirmada. Redirecionando em 5 segundos...
      </p>
    </div>
  );
}