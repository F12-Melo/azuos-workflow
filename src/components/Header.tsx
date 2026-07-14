'use client';

import React from 'react';
import { 
  Bell, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  title: string;
  userName: string;
  role: 'collaborator' | 'manager';
  isHr?: boolean;
  balanceHours?: number;
  isEligible?: boolean;
}

export default function Header({ title, userName, role, isHr = false, balanceHours, isEligible = true }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-bold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500">
          Olá, <span className="text-[#6CBED9] font-semibold">{userName}</span>. Bem-vindo ao Azuos.
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Indicador de Créditos (Visível apenas para Colaborador) */}
        {role === 'collaborator' && !isHr && typeof balanceHours === 'number' && (
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-850">
            <Clock className="w-4 h-4 text-[#aaffd8]" />
            <div className="text-xs">
              <span className="text-slate-500 font-medium">Saldo Semanal: </span>
              <span className="text-slate-200 font-bold">{balanceHours.toFixed(1)}h</span>
              <span className="text-slate-500"> / 8.0h</span>
            </div>
            {/* Barra de Progresso Circular ou Linha Simplificada */}
            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#6CBED9] to-[#aaffd8] h-full transition-all duration-300"
                style={{ width: `${(balanceHours / 8) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Badge de Elegibilidade (LGPD/NR-01) */}
        {role === 'collaborator' && !isHr && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
            isEligible 
              ? 'bg-[#aaffd8]/10 text-[#aaffd8] border border-[#aaffd8]/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isEligible ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-[#aaffd8]" />
                Elegível à Flexibilização
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                Acesso Suspenso (RN05)
              </>
            )}
          </div>
        )}

        {/* Badge de RH */}
        {isHr && (
          <div className="bg-[#6CBED9]/10 text-[#6CBED9] border border-[#6CBED9]/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Painel do RH
          </div>
        )}

        {/* Badge de Gestor (se não for RH) */}
        {role === 'manager' && !isHr && (
          <div className="bg-[#30728d]/20 text-[#6CBED9] border border-[#30728d]/40 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-[#6CBED9]" />
            Painel do Gestor
          </div>
        )}

        {/* Notificações e Ajuda */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
          <button className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#aaffd8] rounded-full ring-2 ring-slate-900" />
          </button>
          <button 
            className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
            title="Conformidade NR-01 & LGPD"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

