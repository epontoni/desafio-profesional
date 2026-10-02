import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import { ShieldAlert } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: 'var(--primary-color)',
        fontWeight: 600
      }}>
        Verificando permisos de administración...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'ROLE_ADMIN') {
    return (
      <>
        <Header />
        <main className="app-main container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
          <div style={{
            maxWidth: '540px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <ShieldAlert size={56} style={{ color: '#E74C3C', marginBottom: '16px' }} />
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>Acceso Denegado</h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              No tienes permisos suficientes para acceder al módulo de administración. Solo los usuarios con rol de Administrador pueden gestionar los recursos de Digital Booking.
            </p>
            <a href="/" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 28px' }}>
              Volver al Inicio
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return children;
};

export default AdminRoute;
