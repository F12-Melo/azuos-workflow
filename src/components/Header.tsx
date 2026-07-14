'use client';

import React from 'react';
import { 
  Bell, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { UserRole } from '@/lib/mockData';

interface HeaderProps {
  title: string;
  userName: string;
  role: UserRole;
  balanceHours?: number;
  isEligible?: boolean;
}

export default function Header({ title, userName, role, balanceHours, isEligible = true }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-bold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500">
          Olá, <span className="text-slate-300 font-semibold">{userName}</span>. Bem-vindo ao Azuos.
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Indicador de Créditos (Visível apenas para Colaborador) */}
        {role === 'colaborador' && typeof balanceHours === 'number' && (
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-500 font-medium">Saldo Semanal: </span>
              <span className="text-slate-200 font-bold">{balanceHours.toFixed(1)}h</span>
              <span className="text-slate-500"> / 8.0h</span>
            </div>
            {/* Barra de Progresso Circular ou Linha Simplificada */}
            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(balanceHours / 8) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Badge de Elegibilidade (LGPD/NR-01) */}
        {role === 'colaborador' && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
            isEligible 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isEligible ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Elegível à Flexibilização
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3" />
                Acesso Suspenso (RN05)
              </>
            )}
          </div>
        )}

        {role === 'gestor' && (
          <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3" />
            Painel do Gestor
          </div>
        )}

        {/* Notificações e Ajuda */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
          <button className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
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
