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
      navigate('/');
    } catch (err) {
      setError('Kayıt başarısız.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Aramıza Katıl</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="text" 
            className="auth-input"
            placeholder="Ad Soyad" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            required 
          />
          <input 
            type="email" 
            className="auth-input"
            placeholder="E-posta" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            className="auth-input"
            placeholder="Şifre" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="auth-btn">
            Kayıt Ol
          </button>
        </form>

        <div className="auth-footer">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;