import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Wifi, Waves, X, ChevronLeft, ChevronRight, Car, Tv, Wind, Dumbbell } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal Lightbox state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
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

    fetchProductDetails();
  }, [id]);

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
            <button className="detail-back-btn" onClick={() => navigate('/')} title="Volver atrás">
              <ArrowLeft size={32} />
            </button>
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
                <span className="product-rating-text" style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>{product.ratingText || 'Excelente'}</span>
                <div className="detail-rating-stars">
                  {renderStars(product.rating || 9.0)}
                </div>
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

          {/* Dynamic Characteristics Section (complying with User Story 18) */}
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
        </div>
      </main>
      <Footer />

      {/* Lightbox Slideshow Modal */}
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
    </>
  );
};

export default ProductDetail;
