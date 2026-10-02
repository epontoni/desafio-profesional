import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { favoriteService } from '../services/favoriteService';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavoritesDetails = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (user.token) {
        const backendFavs = await favoriteService.getFavorites(user.token);
        const products = backendFavs.map(fav => fav.product).filter(Boolean);
        setFavoritesList(products);
        // Sync local cache
        const ids = products.map(p => p.id);
        localStorage.setItem(`favs_${user.email}`, JSON.stringify(ids));
      } else {
        const stored = localStorage.getItem(`favs_${user.email}`);
        const favIds = stored ? JSON.parse(stored) : [];
        if (favIds.length === 0) {
          setFavoritesList([]);
          setLoading(false);
          return;
        }
        const fetchPromises = favIds.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:8080/api/products/${id}`);
            if (res.ok) return await res.json();
            return null;
          } catch (e) {
            return null;
          }
        });
        const results = await Promise.all(fetchPromises);
        setFavoritesList(results.filter(p => p !== null));
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al cargar tus alojamientos favoritos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadFavoritesDetails();

    const handleSync = () => {
      loadFavoritesDetails();
    };

    window.addEventListener('favoritesChanged', handleSync);
    return () => window.removeEventListener('favoritesChanged', handleSync);
  }, [user, navigate]);

  const removeFavorite = async (productId) => {
    if (!user) return;
    try {
      if (user.token) {
        await favoriteService.removeFavorite(productId, user.token);
      }
      const stored = localStorage.getItem(`favs_${user.email}`);
      const favIds = stored ? JSON.parse(stored) : [];
      const updated = favIds.filter(id => id !== productId);
      localStorage.setItem(`favs_${user.email}`, JSON.stringify(updated));

      setFavoritesList(prev => prev.filter(p => p.id !== productId));
      window.dispatchEvent(new Event('favoritesChanged'));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const renderStars = (rating) => {
    const count = rating >= 9.5 ? 5 : rating >= 8.5 ? 4 : rating >= 7.5 ? 3 : 2;
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} fill={i < count ? 'currentColor' : 'none'} />
    ));
  };

  return (
    <>
      <Header />
      <main className="app-main" style={{ backgroundColor: 'var(--bg-light)', padding: '40px 20px', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(29, 190, 180, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
              <Heart size={20} fill="currentColor" />
            </div>
            <h1 className="section-title" style={{ margin: 0 }}>Mis Favoritos</h1>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 600, color: 'var(--primary-color)' }}>
              Cargando tu lista de favoritos...
            </div>
          ) : error ? (
            <div className="form-error" style={{ textAlign: 'center', margin: '20px auto', maxWidth: '500px' }}>
              {error}
            </div>
          ) : favoritesList.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '600px', margin: '0 auto' }}>
              <Heart size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
              <h3>Aún no tienes alojamientos guardados</h3>
              <p style={{ color: 'var(--text-medium)', margin: '10px 0 20px 0', fontSize: '14px' }}>
                Explora nuestro catálogo en la página de inicio y haz clic en el corazón de cualquier producto para guardarlo aquí.
              </p>
              <button className="btn-submit" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={() => navigate('/')}>
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="recommendations-grid">
              {favoritesList.map((prod) => (
                <div key={prod.id} className="product-card" onClick={() => navigate(`/producto/${prod.id}`)}>
                  <div className="product-card-img-wrapper">
                    <img 
                      src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} 
                      alt={prod.name} 
                      className="product-card-img" 
                    />
                    <button 
                      className="product-card-fav" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(prod.id);
                      }}
                      title="Quitar de favoritos"
                      style={{
                        backgroundColor: 'var(--white)',
                        color: 'var(--error-color)',
                        borderColor: 'var(--error-color)',
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="product-card-info">
                    <div>
                      <div className="product-header-row">
                        <div className="product-category-stars">
                          <span className="product-card-category">{prod.category ? prod.category.title : 'Hotel'}</span>
                          <div className="product-stars">
                            {renderStars(prod.rating || 8.0)}
                          </div>
                        </div>
                        <div className="product-rating-box">
                          <span className="product-rating-num">{prod.rating ? prod.rating.toFixed(1) : '8.0'}</span>
                          <span className="product-rating-text">{prod.ratingText || 'Bueno'}</span>
                        </div>
                      </div>
                      
                      <h3 className="product-card-name">{prod.name}</h3>
                      
                      <div className="product-card-loc">
                        <MapPin size={14} />
                        <span>{prod.location || 'Argentina'}</span>
                      </div>
                    </div>

                    <p className="product-card-desc">{prod.description}</p>
                    
                    <button 
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/producto/${prod.id}`);
                      }}
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Favorites;
