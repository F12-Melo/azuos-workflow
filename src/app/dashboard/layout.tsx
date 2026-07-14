'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { mockCollaborator, mockManager, mockCredits } from '@/lib/mockData';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Identifica o perfil mockado com base na URL
  const isGestor = pathname.includes('/dashboard/gestor');
  const user = isGestor ? mockManager : mockCollaborator;
  
  const title = isGestor ? 'Visão Geral do Gestor' : 'Meu Painel de Produtividade';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Fixa Lateral */}
      <Sidebar 
        userName={user.name} 
        userEmail={user.email} 
        role={user.role} 
      />

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Header Superior Fixo */}
        <Header 
          title={title} 
          userName={user.name} 
          role={user.role} 
          balanceHours={user.role === 'colaborador' ? mockCredits.balanceHours : undefined}
          isEligible={user.isEligible}
        />

        {/* Corpo da Página */}
        <main className="flex-1 p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
