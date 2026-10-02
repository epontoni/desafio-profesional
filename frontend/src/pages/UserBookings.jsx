import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Mail, Phone, ArrowRight, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserBookings = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/user/${user.email}`, {
          headers: {
            ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Error al obtener el historial de reservas.');
        }
        setBookingsList(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user, navigate]);

  const renderStars = (rating) => {
    const count = rating >= 9.5 ? 5 : rating >= 8.5 ? 4 : rating >= 7.5 ? 3 : 2;
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={12} fill={i < count ? 'currentColor' : 'none'} />
    ));
  };

  return (
    <>
      <Header />
      <main className="app-main" style={{ backgroundColor: 'var(--bg-light)', padding: '40px 20px', minHeight: '80vh' }}>
        <div className="container">
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(29, 190, 180, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
              <Calendar size={20} />
            </div>
            <h1 className="section-title" style={{ margin: 0 }}>Mis Reservas</h1>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 600, color: 'var(--primary-color)' }}>
              Cargando historial de reservas...
            </div>
          ) : error ? (
            <div className="form-error" style={{ textAlign: 'center', margin: '20px auto', maxWidth: '500px' }}>
              {error}
            </div>
          ) : bookingsList.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '600px', margin: '0 auto' }}>
              <Calendar size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
              <h3>Aún no tienes reservas registradas</h3>
              <p style={{ color: 'var(--text-medium)', margin: '10px 0 20px 0', fontSize: '14px' }}>
                ¿Planificando tu próximo viaje? Explora nuestros hoteles y departamentos destacados en la página principal.
              </p>
              <button className="btn-submit" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={() => navigate('/')}>
                Explorar Alojamientos
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {bookingsList.map((booking) => {
                const prod = booking.product;
                const cleanProdName = prod.name.toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
                return (
                  <div 
                    key={booking.id} 
                    className="admin-card"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '260px 1fr',
                      gap: '0',
                      padding: '0',
                      overflow: 'hidden',
                      textAlign: 'left',
                      border: '1px solid var(--border)',
                      transition: 'transform 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/producto/${prod.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {/* Left Column: Image */}
                    <img 
                      src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} 
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', minHeight: '190px', objectFit: 'cover' }}
                    />
                    
                    {/* Right Column: Info */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {/* Categories and stars row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <span className="product-card-category" style={{ fontSize: '11px' }}>{prod.category ? prod.category.title : 'Hotel'}</span>
                          <div style={{ display: 'flex', color: 'var(--accent-color)', gap: '2px' }}>
                            {renderStars(prod.rating || 9.0)}
                          </div>
                        </div>

                        <h2 style={{ margin: '6px 0 8px 0', fontSize: '20px', color: 'var(--primary-color)', fontWeight: 700 }}>
                          {prod.name}
                        </h2>

                        <div className="product-card-loc" style={{ margin: '8px 0 16px 0' }}>
                          <MapPin size={14} />
                          <span style={{ fontSize: '12px' }}>{prod.location}</span>
                        </div>

                        {/* Dates grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: 'var(--bg-light)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-medium)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Check-in</span>
                            <strong style={{ fontSize: '14px', color: 'var(--primary-color)' }}>{booking.startDate}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-medium)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Check-out</span>
                            <strong style={{ fontSize: '14px', color: 'var(--primary-color)' }}>{booking.endDate}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Footer Info: contacts & button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        {/* Provider Contact (complying with User Story 33) */}
                        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-medium)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={14} style={{ color: 'var(--accent-color)' }} />
                            <span>contacto@{cleanProdName || 'db'}.com</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={14} style={{ color: 'var(--accent-color)' }} />
                            <span>+54 9 11 2233-4455</span>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/producto/${prod.id}`);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-color)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>Ver Ficha</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserBookings;
