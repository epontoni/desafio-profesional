import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DoubleCalendar from '../components/DoubleCalendar';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Availability / Occupied ranges
  const [occupiedRanges, setOccupiedRanges] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Reservation states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [arrivalTime, setArrivalTime] = useState('');
  const [notes, setNotes] = useState('');

  // Submit / Success states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { fromBooking: true, productId: id } });
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error('El alojamiento especificado no existe.');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/product/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOccupiedRanges(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchDetails();
    fetchBookings();
  }, [id, user, navigate]);

  const handleRangeSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!startDate || !endDate) {
      setSubmitError('Debe seleccionar un rango de fechas válido para su reserva.');
      return;
    }
    if (!arrivalTime) {
      setSubmitError('Por favor seleccione su horario estimado de llegada.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        startDate,
        endDate,
        estimatedArrivalTime: arrivalTime,
        notes: notes,
        product: { id: parseInt(id) },
        user: { id: user.id }
      };

      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar su reserva.');
      }

      // Success
      setShowSuccessOverlay(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const count = rating >= 9.5 ? 5 : rating >= 8.5 ? 4 : rating >= 7.5 ? 3 : 2;
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} fill={i < count ? 'currentColor' : 'none'} />
    ));
  };

  if (loading || bookingsLoading) {
    return (
      <>
        <Header />
        <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <h3>Cargando información de reserva...</h3>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="app-main container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="form-error" style={{ display: 'inline-block', margin: '0 auto' }}>
            {error || 'El producto no pudo ser cargado.'}
          </div>
          <div style={{ marginTop: '20px' }}>
            <button className="btn-outline" onClick={() => navigate('/')}>Volver al Home</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="app-main" style={{ backgroundColor: 'var(--bg-light)', padding: '30px 20px' }}>
        <div className="container">
          
          {/* Header row with title & back button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-medium)', fontWeight: 600, textTransform: 'uppercase' }}>Ficha de Reserva</span>
              <h1 className="section-title" style={{ margin: '4px 0 0 0' }}>Completa tu Reserva</h1>
            </div>
            <button 
              onClick={() => navigate(`/producto/${id}`)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              <ArrowLeft size={20} />
              <span>Volver a detalles</span>
            </button>
          </div>

          {submitError && <div className="form-error" style={{ marginBottom: '20px' }}>{submitError}</div>}

          {/* Core Booking Grid Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '30px',
            alignItems: 'start'
          }}>
            
            {/* Left Column: Forms and Calendars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Block 1: User Data (read only) */}
              <div className="admin-card" style={{ padding: '24px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--primary-color)', marginBottom: '18px', fontWeight: 700 }}>Tus datos personales</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={user.firstName} disabled style={{ backgroundColor: '#E9ECEF', cursor: 'not-allowed' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input type="text" className="form-control" value={user.lastName} disabled style={{ backgroundColor: '#E9ECEF', cursor: 'not-allowed' }} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" className="form-control" value={user.email} disabled style={{ backgroundColor: '#E9ECEF', cursor: 'not-allowed' }} />
                </div>
              </div>

              {/* Block 2: Interactive Double Calendar (complying with User Story 30) */}
              <div className="admin-card" style={{ padding: '24px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: 700 }}>Selecciona tus fechas de estadía</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-medium)', marginBottom: '20px', fontWeight: 500 }}>
                  Haz clic en el día de check-in y luego en el día de check-out. No se permiten rangos que abarquen fechas ya reservadas.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <DoubleCalendar 
                    occupiedRanges={occupiedRanges}
                    selectedStart={startDate}
                    selectedEnd={endDate}
                    onRangeSelect={handleRangeSelect}
                    readOnly={false}
                  />
                </div>
              </div>

              {/* Block 3: Arrival Time & Additional Details (complying with User Story 32) */}
              <div className="admin-card" style={{ padding: '24px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--primary-color)', marginBottom: '18px', fontWeight: 700 }}>Horario de llegada y detalles adicionales</h3>
                
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">¿A qué hora estimas llegar al alojamiento?</label>
                  <select 
                    className="form-control" 
                    value={arrivalTime} 
                    onChange={(e) => setArrivalTime(e.target.value)}
                    style={{ maxWidth: '300px' }}
                  >
                    <option value="">Selecciona una hora</option>
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                    <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                    <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                    <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Comentarios o requerimientos especiales (Opcional)</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Ej. Viajo con un bebé y requiero cuna, o tengo preferencia por piso alto..."
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Product Detail Card Sidebar (complying with User Story 31) */}
            <div className="admin-card" style={{ padding: '0', overflow: 'hidden', textAlign: 'left', position: 'sticky', top: '90px' }}>
              <img 
                src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} 
                alt={product.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '24px' }}>
                <span className="product-card-category" style={{ fontSize: '12px' }}>{product.category ? product.category.title : 'Hotel'}</span>
                <h2 style={{ margin: '4px 0 8px 0', fontSize: '20px', color: 'var(--primary-color)', fontWeight: 700 }}>{product.name}</h2>
                
                <div style={{ display: 'flex', color: 'var(--accent-color)', gap: '2px', marginBottom: '12px' }}>
                  {renderStars(product.rating || 9.0)}
                </div>

                <div className="product-card-loc" style={{ margin: '12px 0', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <MapPin size={16} />
                  <span style={{ fontSize: '13px', color: 'var(--text-medium)' }}>{product.location}</span>
                </div>

                {/* Date Summary boxes */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--primary-color)' }}>Tu Estadía</h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-medium)' }}>Check-in:</span>
                    <strong style={{ color: 'var(--primary-color)' }}>{startDate || 'No seleccionado'}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-medium)' }}>Check-out:</span>
                    <strong style={{ color: 'var(--primary-color)' }}>{endDate || 'No seleccionado'}</strong>
                  </div>

                  {startDate && endDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px dashed var(--border)', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-medium)' }}>Total noches:</span>
                      <strong style={{ color: 'var(--accent-color)', fontSize: '15px' }}>{calculateDays()} noches</strong>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleConfirmBooking}
                  className="btn-submit"
                  disabled={submitting || !startDate || !endDate}
                  style={{ width: '100%', margin: '10px 0 0 0' }}
                >
                  {submitting ? 'Confirmando Reserva...' : 'Confirmar Reserva'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />

      {/* Success Modal Overlay Dialog (complying with User Story 32) */}
      {showSuccessOverlay && (
        <div className="modal-overlay" style={{ zIndex: '10000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-card" style={{ maxWidth: '500px', width: '90%', padding: '40px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CheckCircle2 size={72} style={{ color: 'var(--accent-color)', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '26px', color: 'var(--primary-color)', fontWeight: 700, marginBottom: '12px' }}>¡Reserva Exitosa!</h2>
            
            <p style={{ color: 'var(--text-medium)', fontSize: '14px', lineHeight: 1.6, marginBottom: '30px' }}>
              Muchas gracias por elegirnos. Tu reserva para **"{product.name}"** ha sido registrada de forma segura en nuestro sistema.
              Hemos enviado un correo de confirmación con las instrucciones y el contacto del proveedor a tu correo **{user.email}**.
            </p>

            <div style={{ display: 'flex', gap: '14px', width: '100%' }}>
              <button 
                onClick={() => {
                  setShowSuccessOverlay(false);
                  navigate('/mis-reservas');
                }}
                className="btn-submit"
                style={{ flex: 1, margin: 0 }}
              >
                Ver mis reservas
              </button>
              <button 
                onClick={() => {
                  setShowSuccessOverlay(false);
                  navigate('/');
                }}
                className="btn-outline"
                style={{ flex: 1, borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
              >
                Volver al Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;
