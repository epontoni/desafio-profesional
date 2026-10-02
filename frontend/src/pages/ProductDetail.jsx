import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Wifi, Waves, X, ChevronLeft, ChevronRight, Car, Tv, Wind, Dumbbell, Heart, Share2, Send } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DoubleCalendar from '../components/DoubleCalendar';
import { AuthContext } from '../context/AuthContext';
import { favoriteService } from '../services/favoriteService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Write Review form state
  const [userStars, setUserStars] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Modal Lightbox state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Favorite state
  const [isFav, setIsFav] = useState(false);

  // Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareNetwork, setShareNetwork] = useState('twitter');
  const [shareMessage, setShareMessage] = useState('¡Miren este increíble lugar que encontré en Digital Booking!');
  const [shareSuccess, setShareSuccess] = useState(false);

  // Fetch Product Main Details
  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('El producto no existe.');
        }
        throw new Error('Error al obtener los detalles del producto.');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings for this product (complying with User Story 23)
  const fetchProductBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/product/${id}`, {
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      if (!response.ok) {
        throw new Error('No se pudo obtener la información de disponibilidad en este momento.');
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setBookingsError('No se puede obtener la información de disponibilidad en este momento.');
    } finally {
      setBookingsLoading(false);
    }
  };

  // Fetch reviews for this product (complying with User Story 28)
  const fetchProductReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Sync details and states
  useEffect(() => {
    fetchProductDetails();
    fetchProductBookings();
    fetchProductReviews();
  }, [id]);

  // Sync Favorite state
  useEffect(() => {
    let isMounted = true;
    const checkFav = async () => {
      if (user && user.email) {
        if (user.token) {
          try {
            const fav = await favoriteService.isFavorite(id, user.token);
            if (isMounted) setIsFav(fav);
            return;
          } catch (e) {
            console.error('Error checking favorite status:', e);
          }
        }
        const stored = localStorage.getItem(`favs_${user.email}`);
        const favIds = stored ? JSON.parse(stored) : [];
        if (isMounted) setIsFav(favIds.includes(parseInt(id)));
      } else {
        if (isMounted) setIsFav(false);
      }
    };

    checkFav();

    const handleSync = () => {
      checkFav();
    };
    window.addEventListener('favoritesChanged', handleSync);
    return () => {
      isMounted = false;
      window.removeEventListener('favoritesChanged', handleSync);
    };
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user) {
      alert('Debes iniciar sesión para marcar este producto como favorito.');
      navigate('/login');
      return;
    }

    const prodIdNum = parseInt(id);
    const newFavState = !isFav;
    setIsFav(newFavState);

    const stored = localStorage.getItem(`favs_${user.email}`);
    let favIds = stored ? JSON.parse(stored) : [];
    if (newFavState) {
      if (!favIds.includes(prodIdNum)) favIds.push(prodIdNum);
    } else {
      favIds = favIds.filter(fId => fId !== prodIdNum);
    }
    localStorage.setItem(`favs_${user.email}`, JSON.stringify(favIds));

    try {
      if (user.token) {
        if (newFavState) {
          await favoriteService.addFavorite(prodIdNum, user.token);
        } else {
          await favoriteService.removeFavorite(prodIdNum, user.token);
        }
      }
      window.dispatchEvent(new Event('favoritesChanged')); // notify favorites page
    } catch (e) {
      console.error('Error toggling favorite on backend:', e);
    }
  };

  const handleStartBookingClick = () => {
    if (!user) {
      navigate('/login', { state: { fromBooking: true, productId: id } });
    } else {
      navigate(`/producto/${id}/reserva`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    if (!user) {
      setReviewError('Debes iniciar sesión para calificar este alojamiento.');
      return;
    }
    if (!userComment.trim()) {
      setReviewError('Por favor escribe un comentario para tu reseña.');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          stars: userStars,
          comment: userComment,
          userName: `${user.firstName} ${user.lastName}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Ocurrió un error al enviar tu valoración.');
      }

      setReviewSuccess('¡Tu reseña ha sido publicada exitosamente!');
      setUserComment('');
      setUserStars(5);
      
      // Re-fetch reviews list and main product details to refresh average scores in real time
      fetchProductReviews();
      fetchProductDetails();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const openModal = (index = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const renderStars = (rating) => {
    const count = rating >= 9.5 ? 5 : rating >= 8.5 ? 4 : rating >= 7.5 ? 3 : 2;
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} fill={i < count ? 'currentColor' : 'none'} />
    ));
  };

  const renderAmenityIcon = (iconName) => {
    const norm = iconName ? iconName.toLowerCase().trim() : '';
    switch(norm) {
      case 'wifi': return <Wifi size={22} />;
      case 'waves': return <Waves size={22} />;
      case 'car': return <Car size={22} />;
      case 'tv': return <Tv size={22} />;
      case 'wind': return <Wind size={22} />;
      case 'dumbbell': return <Dumbbell size={22} />;
      default: return <Star size={22} />;
    }
  };

  // Mock social media share trigger (complying with User Story 27)
  const handleShareSubmit = () => {
    setShareSuccess(true);
    setTimeout(() => {
      setIsShareModalOpen(false);
      setShareSuccess(false);
      
      // Open standard sharing window according to chosen network
      const shareUrl = window.location.href;
      const text = `${shareMessage} - ${product.name}`;
      if (shareNetwork === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      } else if (shareNetwork === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      } else {
        alert('Simulación de compartir en Instagram completa.');
      }
    }, 1500);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <h3>Cargando detalles del producto...</h3>
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

  // Ensure there are at least 5 images for display
  const galleryImages = [...(product.images || [])];
  while (galleryImages.length < 5) {
    galleryImages.push('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800');
  }

  return (
    <>
      <Header />
      <main className="app-main">
        {/* Product Detail Top Header */}
        <div className="detail-header-block">
          <div className="container detail-header-container">
            <div className="detail-title-block">
              <span className="detail-category">{product.category ? product.category.title : 'Hotel'}</span>
              <h1 className="detail-name">{product.name}</h1>
            </div>
            
            {/* Action buttons (Share & Favorite) & Back arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                className="detail-action-icon-btn" 
                onClick={() => setIsShareModalOpen(true)}
                title="Compartir en redes"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <Share2 size={24} />
              </button>
              <button 
                className="detail-action-icon-btn" 
                onClick={toggleFavorite}
                title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isFav ? 'var(--error-color)' : 'var(--primary-color)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <Heart size={24} fill={isFav ? "currentColor" : "none"} />
              </button>
              <button className="detail-back-btn" onClick={() => navigate('/')} title="Volver atrás">
                <ArrowLeft size={32} />
              </button>
            </div>
          </div>
        </div>

        {/* Location & Rating Bar */}
        <div className="detail-location-bar">
          <div className="container detail-loc-container">
            <div className="detail-loc-info">
              <MapPin size={18} style={{ color: 'var(--text-medium)' }} />
              <span>{product.location || 'Argentina'}</span>
            </div>
            <div className="detail-rating-block">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="product-rating-text" style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>
                  {product.ratingText || 'Excelente'}
                </span>
                <div className="detail-rating-stars">
                  {renderStars(product.rating || 9.0)}
                </div>
                {/* Total reviews count (complying with User Story 28) */}
                <span style={{ fontSize: '11px', color: 'var(--text-medium)', fontWeight: 600, marginTop: '2px' }}>
                  ({reviews.length} valoraciones)
                </span>
              </div>
              <span className="product-rating-num" style={{ fontSize: '20px', padding: '6px 12px' }}>
                {product.rating ? product.rating.toFixed(1) : '9.0'}
              </span>
            </div>
          </div>
        </div>

        {/* Body Container */}
        <div className="container detail-body-container">
          {/* Gallery Block */}
          <div className="gallery-section">
            <div className="gallery-grid">
              <div className="gallery-item gallery-main" onClick={() => openModal(0)}>
                <img src={galleryImages[0]} alt={`${product.name} 1`} />
              </div>
              <div className="gallery-item gallery-grid-right-1" onClick={() => openModal(1)}>
                <img src={galleryImages[1]} alt={`${product.name} 2`} />
              </div>
              <div className="gallery-item gallery-grid-right-2" onClick={() => openModal(2)}>
                <img src={galleryImages[2]} alt={`${product.name} 3`} />
              </div>
              <div className="gallery-item gallery-grid-right-3" onClick={() => openModal(3)}>
                <img src={galleryImages[3]} alt={`${product.name} 4`} />
              </div>
              <div className="gallery-item gallery-grid-right-4" onClick={() => openModal(4)}>
                <img src={galleryImages[4]} alt={`${product.name} 5`} />
              </div>
              
              <button className="gallery-more-btn" onClick={() => openModal(0)}>
                Ver más
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-description-section">
            <h2 className="detail-desc-title">Acerca de este lugar</h2>
            <p className="detail-desc-text">{product.description}</p>
          </div>

          {/* Dynamic Characteristics Section */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px', textAlign: 'left' }}>
            <h2 className="detail-desc-title" style={{ fontSize: '22px', marginBottom: '20px' }}>Características</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '15px'
            }}>
              {product.characteristics && product.characteristics.length > 0 ? (
                product.characteristics.map((char) => (
                  <div 
                    key={char.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '12px 16px',
                      backgroundColor: 'var(--white)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {renderAmenityIcon(char.icon)}
                    <span>{char.name}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-medium)', fontStyle: 'italic' }}>Este alojamiento no tiene características especificadas.</p>
              )}
            </div>
          </div>

          {/* Availability / Calendar Section (complying with User Story 23) */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px', textAlign: 'left' }}>
            <h2 className="detail-desc-title" style={{ fontSize: '22px', marginBottom: '10px' }}>Fechas disponibles</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-medium)', marginBottom: '20px', fontWeight: 500 }}>
              Consulta las fechas ocupadas en el calendario y planifica tu estadía ideal.
            </p>
            
            {bookingsLoading ? (
              <p>Cargando disponibilidad del alojamiento...</p>
            ) : bookingsError ? (
              <div className="form-error" style={{ maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{bookingsError}</span>
                <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'var(--error-color)', color: 'var(--error-color)' }} onClick={fetchProductBookings}>
                  Reintentar
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <DoubleCalendar 
                    occupiedRanges={bookings} 
                    readOnly={true}
                  />
                </div>

                {/* Reserve redirection control panel (complying with User Story 30) */}
                <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '24px', flexWrap: 'wrap', gap: '16px', border: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '16px', fontWeight: 700 }}>¿Listo para reservar este alojamiento?</h4>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-medium)', fontSize: '13px', fontWeight: 500 }}>Selecciona tus fechas ideales de check-in y check-out ingresando al formulario de reserva.</p>
                  </div>
                  <button 
                    className="btn-submit" 
                    style={{ maxWidth: '200px', margin: 0 }}
                    onClick={handleStartBookingClick}
                  >
                    Iniciar reserva
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Policies Block (complying with User Story 26) */}
          <div style={{ width: '100%', marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '24px', textDecoration: 'underline', color: 'var(--primary-color)', fontWeight: 700 }}>
              Políticas del producto
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              marginTop: '15px'
            }}>
              {/* Column 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '6px' }}>Normas de la casa</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Check-in: a partir de las 14:00 hs.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Check-out: antes de las 10:00 hs.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• No se permiten mascotas en los espacios comunes.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Prohibido fumar dentro del establecimiento.</span>
              </div>
              {/* Column 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '6px' }}>Salud y seguridad</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Protocolo de limpieza reforzado implementado.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Sensores de humo y monóxido de carbono operativos.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Botiquín de primeros auxilios disponible en recepción.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Salidas de emergencia señalizadas.</span>
              </div>
              {/* Column 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '6px' }}>Política de cancelación</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Cancelación gratuita hasta 48 hs antes del check-in.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• Devolución del 50% de la seña si se cancela hasta 24 hs antes.</span>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>• No reembolsable por cancelaciones con menos de 24 hs de aviso.</span>
              </div>
            </div>
          </div>

          {/* Ratings & Reviews Section (complying with User Story 28) */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px', textAlign: 'left' }}>
            <h2 className="detail-desc-title" style={{ fontSize: '22px', marginBottom: '20px' }}>Valoraciones y Comentarios</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
              {/* Left Column: Reviews List */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '16px' }}>Reseñas de huéspedes</h3>
                {reviewsLoading ? (
                  <p>Cargando comentarios...</p>
                ) : reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-medium)', fontStyle: 'italic' }}>Este alojamiento aún no tiene reseñas escritas. ¡Sé el primero!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '450px', overflowY: 'auto', paddingRight: '8px' }}>
                    {reviews.map((rev) => (
                      <div 
                        key={rev.id} 
                        style={{ 
                          backgroundColor: 'var(--white)', 
                          padding: '16px', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border)',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '14px' }}>{rev.userName}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-medium)' }}>{rev.date}</span>
                        </div>
                        <div style={{ display: 'flex', color: 'var(--accent-color)', gap: '2px', marginBottom: '8px' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} fill={i < rev.stars ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-medium)', margin: 0, lineHeight: 1.4 }}>
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Write a Review Form */}
              <div className="admin-card" style={{ padding: '24px', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>Deja tu opinión</h3>
                
                {!user ? (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-medium)', marginBottom: '14px' }}>
                      Debes iniciar sesión para poder puntuar este alojamiento.
                    </p>
                    <button className="btn-outline" onClick={() => navigate('/login')} style={{ fontSize: '13px', padding: '8px 16px' }}>
                      Iniciar sesión
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    {reviewError && <div className="form-error" style={{ fontSize: '13px' }}>{reviewError}</div>}
                    {reviewSuccess && <div className="form-success" style={{ fontSize: '13px' }}>{reviewSuccess}</div>}

                    {/* Stars Selector */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Puntuación</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', color: 'var(--accent-color)' }}>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starNum = i + 1;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setUserStars(starNum)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              title={`${starNum} estrellas`}
                            >
                              <Star size={28} fill={starNum <= userStars ? 'currentColor' : 'none'} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Comentario</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Comparte tu experiencia en este lugar..."
                        disabled={submittingReview}
                      />
                    </div>

                    <button type="submit" className="btn-submit" disabled={submittingReview} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Send size={16} />
                      <span>{submittingReview ? 'Enviando...' : 'Publicar Reseña'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Image Lightbox Slideshow Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal} title="Cerrar">
              <X size={32} />
            </button>
            
            <div className="modal-slider">
              <button className="modal-nav-btn" onClick={prevImage} title="Anterior">
                <ChevronLeft size={24} />
              </button>
              
              <div className="modal-img-wrapper">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : galleryImages[currentImageIndex]} 
                  alt={`${product.name} slide`} 
                  className="modal-img"
                />
              </div>
              
              <button className="modal-nav-btn" onClick={nextImage} title="Siguiente">
                <ChevronRight size={24} />
              </button>
            </div>
            
            <span className="modal-counter">
              {currentImageIndex + 1} / {product.images && product.images.length > 0 ? product.images.length : 5}
            </span>
          </div>
        </div>
      )}

      {/* Social Sharing Dialog Modal (complying with User Story 27) */}
      {isShareModalOpen && (
        <div className="modal-overlay" onClick={() => setIsShareModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '24px' }}>
            <button className="modal-close-btn" onClick={() => setIsShareModalOpen(false)} title="Cerrar">
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '20px', color: 'var(--primary-color)', fontWeight: 700, marginBottom: '16px' }}>Recomendar Alojamiento</h2>
            
            {shareSuccess ? (
              <div className="form-success" style={{ textAlign: 'center', padding: '20px 0' }}>
                ¡Enlace de recomendación enviado con éxito a {shareNetwork.toUpperCase()}! Redirigiendo...
              </div>
            ) : (
              <div>
                {/* Network Options */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>Elige una red social</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['facebook', 'twitter', 'instagram'].map((net) => (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setShareNetwork(net)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid',
                          borderColor: shareNetwork === net ? 'var(--accent-color)' : 'var(--border)',
                          backgroundColor: shareNetwork === net ? 'rgba(29, 190, 180, 0.1)' : 'var(--white)',
                          color: shareNetwork === net ? 'var(--accent-color)' : 'var(--text-medium)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {net}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message Field */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Mensaje personalizado</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    placeholder="Escribe tu recomendación..."
                  />
                </div>

                {/* Preview Card Mockup */}
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  backgroundColor: 'var(--bg-light)'
                }}>
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : galleryImages[0]} 
                    alt="Preview" 
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '12px', textAlign: 'left' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '15px', fontWeight: 700 }}>{product.name}</h4>
                    <p style={{ margin: '4px 0', fontSize: '11px', color: 'var(--text-medium)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                    <span style={{ fontSize: '10px', color: 'var(--accent-color)', wordBreak: 'break-all', fontWeight: 600 }}>
                      {window.location.href}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleShareSubmit} 
                  className="btn-submit"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Share2 size={16} />
                  <span>Compartir en {shareNetwork}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
