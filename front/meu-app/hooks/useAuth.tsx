import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  nome: string;
  email: string;
  telefone: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user — replace with real auth when backend supports it
const MOCK_USER: User = {
  nome: 'José Carvalho',
  email: 'Josebrabo@gmail.com',
  telefone: '(24) 98855-8590',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // TODO: replace with real authentication endpoint
    if (email.trim().length > 0) {
      setUser({ ...MOCK_USER, email });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
