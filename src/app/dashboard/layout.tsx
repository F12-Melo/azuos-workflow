'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Coffee } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading, signOut } = useAuth();
  const [balanceHours, setBalanceHours] = useState<number>(8.0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Redirecionamento de segurança
  useEffect(() => {
    if (!loading) {
      if (!profile) {
        router.push('/');
        return;
      }

      // Validação de acesso por papéis
      if (pathname.includes('/dashboard/gestor') && profile.role !== 'manager') {
        router.push(profile.is_hr ? '/dashboard/rh' : '/dashboard/colaborador');
      } else if (pathname.includes('/dashboard/colaborador') && profile.role !== 'collaborator') {
        router.push(profile.is_hr ? '/dashboard/rh' : '/dashboard/gestor');
      } else if (pathname.includes('/dashboard/rh') && !profile.is_hr) {
        router.push(profile.role === 'manager' ? '/dashboard/gestor' : '/dashboard/colaborador');
      }
    }
  }, [profile, loading, pathname, router]);

  // Carregar saldo de créditos real para colaboradores
  useEffect(() => {
    if (profile && profile.role === 'collaborator') {
      const fetchCredits = async () => {
        setLoadingBalance(true);
        try {
          const { data, error } = await supabase
            .from('credit_balances')
            .select('hours_available')
            .eq('user_id', profile.id)
            .maybeSingle();

          if (data) {
            setBalanceHours(data.hours_available ?? 8.0);
          } else {
            // Caso não tenha saldo criado, usar o padrão de 8 horas
            setBalanceHours(8.0);
          }
        } catch (e) {
          console.error('Erro ao buscar saldo de créditos:', e);
        } finally {
          setLoadingBalance(false);
        }
      };

      fetchCredits();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="bg-[#30728d]/10 text-[#6CBED9] p-4 rounded-2xl border border-[#30728d]/20 flex items-center justify-center animate-bounce mb-4">
          <Coffee className="w-8 h-8" />
        </div>
        <div className="w-16 bg-slate-900 h-1 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-gradient-to-r from-[#6CBED9] to-[#aaffd8] h-full w-2/3 rounded-full animate-pulse" />
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-4">Carregando Azuos...</p>
      </div>
    );
  }

  if (!profile) return null;

  const title = profile.is_hr 
    ? 'Painel de Recursos Humanos' 
    : profile.role === 'manager' 
      ? 'Visão Geral do Gestor' 
      : 'Meu Painel de Produtividade';

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 flex">
      {/* Sidebar Fixa Lateral */}
      <Sidebar 
        userName={profile.name} 
        userEmail={profile.email} 
        role={profile.role}
        isHr={profile.is_hr}
      />

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Header Superior Fixo */}
        <Header 
          title={title} 
          userName={profile.name} 
          role={profile.role} 
          isHr={profile.is_hr}
          balanceHours={profile.role === 'collaborator' ? balanceHours : undefined}
          isEligible={profile.flex_eligible}
        />

        {/* Corpo da Página */}
        <main className="flex-1 p-8 bg-[#F8FAF8] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

