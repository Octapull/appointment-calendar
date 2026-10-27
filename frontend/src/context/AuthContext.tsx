import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode'; // Token'ı okumak için

export interface AuthUser {
  id: number;
  fullName: string;
  email?: string;
  exp: number;
  iat?: number;
}

interface AuthResponse {
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (fullName: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null); // Kullanıcı bilgisi
  const [loading, setLoading] = useState(true); // Yükleniyor mu?

  // Çıkış Yapma Fonksiyonu
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Sayfa yenilenince "Daha önce giriş yapmış mıydım?" diye kontrol et
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<AuthUser>(token);
        // Token süresi dolmuş mu kontrol et (opsiyonel ama iyi olur)
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
        } else {
          setUser(decoded); // Giriş yapıldı olarak işaretle
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Giriş Yapma Fonksiyonu
  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    // Token'ı kaydet
    localStorage.setItem('authToken', res.data.token);
    // Kullanıcı bilgisini state'e at
    const decoded = jwtDecode<AuthUser>(res.data.token);
    setUser(decoded);
    return res.data;
  };

  // Kayıt Olma Fonksiyonu
  const register = async (fullName: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/register', { fullName, email, password });
    localStorage.setItem('authToken', res.data.token);
    const decoded = jwtDecode<AuthUser>(res.data.token);
    setUser(decoded);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
