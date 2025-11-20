import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Context'ten login fonksiyonunu çektik
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // Başarılıysa anasayfaya (Takvime) git
    } catch (err) {
      setError('Giriş başarısız. Bilgileri kontrol et.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Giriş Yap</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="E-posta" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Şifre" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
          Giriş Yap
        </button>
      </form>
      <p>Hesabın yok mu? <Link to="/register">Kayıt Ol</Link></p>
    </div>
  );
};

export default Login;