import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El correo electrónico no tiene un formato válido.');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Success, redirect to Home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error de red: No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="app-main" style={{ backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div className="admin-card" style={{ width: '100%', maxWidth: '450px', margin: '0 auto' }}>
          <h2 className="admin-section-title" style={{ textAlign: 'center', marginBottom: '24px' }}>Iniciar sesión</h2>
          
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-medium)', fontWeight: 500 }}>
            ¿Aún no tienes una cuenta? <Link to="/registro" style={{ color: 'var(--accent-color)', fontWeight: 700 }}>Registrate</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
