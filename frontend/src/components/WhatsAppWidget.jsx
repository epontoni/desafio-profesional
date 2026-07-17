import React, { useState } from 'react';

const WhatsAppWidget = () => {
  const [showToast, setShowToast] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setShowToast(true);

    // Simulated/Real redirect after 1.2s to let toast be read
    setTimeout(() => {
      setShowToast(false);
      const phoneNumber = '5491122334455';
      const text = encodeURIComponent('Hola! Quisiera realizar una consulta sobre las disponibilidades de alojamiento en Digital Booking.');
      window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    }, 1200);
  };

  return (
    <>
      <div 
        className="whatsapp-float-widget"
        onClick={handleClick}
        title="Chatear con soporte"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#25D366',
          color: '#FFF',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: '9999',
          transition: 'all 0.25s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
      >
        {/* Custom SVG WhatsApp Logo */}
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          fill="currentColor"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.37 5.054L2 22l5.077-1.331a9.907 9.907 0 0 0 4.933 1.312h.005c5.505 0 9.988-4.479 9.989-9.985a9.96 9.96 0 0 0-9.992-9.996zM17.47 15.35c-.3.45-1.52.88-2.07.94-.53.06-1.04.28-3.41-.65-2.85-1.12-4.66-4.01-4.8-4.2-.14-.19-1.15-1.53-1.15-2.93 0-1.4.73-2.09.99-2.37.26-.28.56-.35.75-.35h.54c.17 0 .4.06.63.59c.26.62.88 2.14.96 2.3c.08.16.13.35.03.55c-.1.2-.16.33-.33.52c-.17.19-.35.43-.5.58c-.17.17-.35.35-.15.69c.2.34.88 1.45 1.89 2.35c1.3 1.16 2.39 1.52 2.73 1.69c.34.17.54.14.74-.09c.2-.23.86-.99 1.09-1.33c.23-.34.46-.28.78-.16c.32.12 2.05 1.01 2.4 1.18c.35.17.58.26.67.41c.09.15.09.87-.21 1.32z"/>
        </svg>
      </div>

      {/* Floating Notification Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          backgroundColor: 'var(--primary-color)',
          color: 'var(--white)',
          padding: '10px 18px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: 'var(--shadow-md)',
          zIndex: '9999',
          animation: 'fadeIn 0.2s ease'
        }}>
          Redirigiendo a soporte de WhatsApp...
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
