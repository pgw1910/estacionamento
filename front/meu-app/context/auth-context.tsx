import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://172.19.7.226:8000';

const TOKEN_KEY = 'estaki_token';
const REFRESH_KEY = 'estaki_refresh';

export interface UserProfile {
  username: string;
  full_name: string;
  email: string;
  telefone: string;
  matricula: string;
}

interface AuthContextData {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY)
      .then(async (saved) => {
        if (saved) {
          setToken(saved);
          await fetchMe(saved);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function fetchMe(accessToken: string) {
    try {
      const res = await fetch(`${API_URL}/api/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {
      // silencia
    }
  }

  async function signIn(username: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        data?.detail || data?.non_field_errors?.[0] || 'Credenciais inválidas.'
      );
    }

    const data = await response.json();
    await SecureStore.setItemAsync(TOKEN_KEY, data.access);
    await SecureStore.setItemAsync(REFRESH_KEY, data.refresh);
    setToken(data.access);
    await fetchMe(data.access);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { API_URL };
