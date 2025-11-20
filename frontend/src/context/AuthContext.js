import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode'; // Token'ı okumak için

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Kullanıcı bilgisi
  const [loading, setLoading] = useState(true); // Yükleniyor mu?

  // Sayfa yenilenince "Daha önce giriş yapmış mıydım?" diye kontrol et
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Token süresi dolmuş mu kontrol et (opsiyonel ama iyi olur)
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
        } else {
          setUser(decoded); // Giriş yapıldı olarak işaretle
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Giriş Yapma Fonksiyonu
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    // Token'ı kaydet
    localStorage.setItem('authToken', res.data.token);
    // Kullanıcı bilgisini state'e at
    const decoded = jwtDecode(res.data.token);
    setUser(decoded);
    return res.data;
  };

  // Kayıt Olma Fonksiyonu
  const register = async (fullName, email, password) => {
    const res = await api.post('/auth/register', { fullName, email, password });
    localStorage.setItem('authToken', res.data.token);
    const decoded = jwtDecode(res.data.token);
    setUser(decoded);
    return res.data;
  };

  // Çıkış Yapma Fonksiyonu
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};