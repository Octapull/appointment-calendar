import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(fullName, email, password);
      navigate('/'); // Kayıt olunca direkt içeri al
    } catch (err) {
      setError('Kayıt başarısız. E-posta kullanılıyor olabilir.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Kayıt Ol</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Ad Soyad" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)}
          required 
          style={{ padding: '10px' }}
        />
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
        <button type="submit" style={{ padding: '10px', background: 'green', color: 'white', border: 'none' }}>
          Kayıt Ol
        </button>
      </form>
      <p>Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link></p>
    </div>
  );
};

export default Register;