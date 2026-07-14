'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: number;
  name: string;
  email: string;
  role: 'collaborator' | 'manager';
  flex_eligible: boolean;
  is_hr: boolean;
  manager_id: number;
  auth_uid?: string;
  manager_name?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Verificar a sessão atual na inicialização
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Erro ao verificar sessão do Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 2. Escutar mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_uid', uid)
        .single();

      if (error) {
        console.error('Perfil correspondente não encontrado no banco de dados para o auth_uid:', uid);
        setProfile(null);
      } else if (data) {
        // Buscar nome do gestor se houver manager_id
        let managerName = '';
        if (data.manager_id && data.manager_id !== data.id) {
          const { data: mgrData } = await supabase
            .from('users')
            .select('name')
            .eq('id', data.manager_id)
            .single();
          if (mgrData) managerName = mgrData.name;
        }
        setProfile({
          ...data,
          manager_name: managerName || 'N/A'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);
    try {
      // Autenticação real no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email || '');
      }
      return { error: null };
    } catch (err: any) {
      setLoading(false);
      return { error: err.message || 'Erro inesperado ao realizar login.' };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Erro ao deslogar do Supabase:', e);
    }
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
