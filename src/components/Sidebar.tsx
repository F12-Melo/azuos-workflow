'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Calendar, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Clock, 
  LogOut, 
  Shield, 
  User,
  Coffee,
  AlertCircle,
  FileSpreadsheet,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  userName: string;
  userEmail: string;
  role: 'collaborator' | 'manager';
  isHr?: boolean;
}

export default function Sidebar({ userName, userEmail, role, isHr = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const colabLinks = [
    { name: 'Minha Agenda', href: '/dashboard/colaborador', icon: Calendar },
    { name: 'Minhas Tarefas', href: '/dashboard/colaborador#tarefas', icon: CheckSquare },
  ];

  const gestorLinks = [
    { name: 'Desempenho Equipe', href: '/dashboard/gestor', icon: BarChart3 },
    { name: 'Painel de Créditos', href: '/dashboard/gestor#creditos', icon: Users },
    { name: 'Moderação de Blocos', href: '/dashboard/gestor#moderacao', icon: Shield },
  ];

  const rhLinks = [
    { name: 'Painel de Auditoria', href: '/dashboard/rh', icon: ClipboardList },
    { name: 'Controle de Atestados', href: '/dashboard/rh#atestados', icon: FileSpreadsheet },
    { name: 'Conformidade LGPD/NR-01', href: '/dashboard/rh#relatorios', icon: ShieldAlert },
  ];

  const links = isHr ? rhLinks : (role === 'manager' ? gestorLinks : colabLinks);

  return (
    <aside className="w-64 bg-[#30728d] border-r border-[#6CBED9]/30 text-[#F8FAF8] flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-[#6CBED9]/20 flex items-center gap-3">
        <div>
          <img src="/logo_notitle.png" alt="Azuos Logo" className="w-20 h-20 object-contain" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg bg-gradient-to-r from-[#6CBED9] to-[#aaffd8] bg-clip-text text-transparent">
            AZUOS
          </h1>
          <p className="text-[10px] text-[#FFFFFF] uppercase tracking-widest font-semibold">
            Workflow Manager
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 text-[10px] font-bold text-[#aaffd8] uppercase tracking-wider mb-2">
          Menu Principal
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (typeof window !== 'undefined' && pathname + window.location.hash === link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#6CBED9]/14 text-[#F8FAF8] border-l-2 border-[#aaffd8]'
                  : 'hover:bg-[#6CBED9]/10 text-[#d6ebef] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Info & Logout */}
      <div className="p-4 border-t border-[#6CBED9]/20 bg-[#245569]/90">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#aaffd8]/20 text-[#102a38] flex items-center justify-center font-semibold border border-[#aaffd8]/30">
            {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold truncate text-slate-200">{userName}</h4>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#102a38] bg-[#aaffd8]/15 hover:bg-[#aaffd8]/25 border border-[#aaffd8]/30 rounded-lg transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
