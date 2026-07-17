import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = () => {
    if (!user) return '';
    const first = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const last = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return first + last;
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="container header-container">
        <Link to="/" className="logo-block" onClick={() => setShowDropdown(false)}>
          <div className="logo-icon">Db</div>
          <span className="logo-slogan">Sentite como en tu hogar</span>
        </Link>
        
        <div className="header-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textOrigin: 'right' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-color)' }}>
                  Hola, {user.firstName}!
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 600 }}>
                  {user.role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              
              {/* Initials Avatar Icon */}
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'var(--white)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: '16px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {getInitials()}
              </div>

              {/* Avatar Options Dropdown (complying with Acceptance Criteria: debajo del avatar la opcion Cerrar Sesion) */}
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '52px',
                  right: '0',
                  backgroundColor: 'var(--white)',
                  boxShadow: 'var(--shadow-md)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  padding: '8px 0',
                  width: '160px',
                  zIndex: '1001',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {user.role === 'ROLE_ADMIN' && (
                    <Link 
                      to="/administracion" 
                      style={{
                        padding: '10px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--primary-color)',
                        textAlign: 'left'
                      }}
                      onClick={() => setShowDropdown(false)}
                    >
                      Administración
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    style={{
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--error-color)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {location.pathname !== '/registro' && (
                <Link to="/registro" className="btn-outline">Crear cuenta</Link>
              )}
              {location.pathname !== '/login' && (
                <Link to="/login" className="btn-outline">Iniciar sesión</Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
