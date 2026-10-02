import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Waves, MapPin, Star, Heart, Car, Tv, Wind, Dumbbell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { favoriteService } from '../services/favoriteService';

const RecommendationsBlock = ({ selectedCategory, onClearFilter, searchParams, onClearSearch }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tabs: 'random' or 'catalog'
  const [activeTab, setActiveTab] = useState('random');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Overall database count
  const [grandTotalProducts, setGrandTotalProducts] = useState(0);
  
  // Local state for favorites list
  const [favorites, setFavorites] = useState([]);

  const limit = 10;

  // Icon mapper for characteristics
  const renderAmenityIcon = (iconName, name) => {
    const norm = iconName ? iconName.toLowerCase().trim() : '';
    switch(norm) {
      case 'wifi': return <Wifi size={16} title={name} />;
      case 'waves': return <Waves size={16} title={name} />;
      case 'car': return <Car size={16} title={name} />;
      case 'tv': return <Tv size={16} title={name} />;
      case 'wind': return <Wind size={16} title={name} />;
      case 'dumbbell': return <Dumbbell size={16} title={name} />;
      default: return <span style={{ fontSize: '11px', fontWeight: 700 }} title={name}>⭐</span>;
    }
  };

  // Fetch grand total of products in database
  const fetchGrandTotal = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      if (response.ok) {
        const data = await response.json();
        setGrandTotalProducts(data.length);
      }
    } catch (err) {
      console.error('Failed to get grand total:', err);
    }
  };

  // Load favorites from backend (or fallback to cache)
  const loadFavorites = async () => {
    if (user && user.email) {
      if (user.token) {
        try {
          const backendFavs = await favoriteService.getFavorites(user.token);
          const favIds = backendFavs.map(f => f.product?.id).filter(Boolean);
          setFavorites(favIds);
          localStorage.setItem(`favs_${user.email}`, JSON.stringify(favIds));
          return;
        } catch (e) {
          console.error('Error fetching favorites from backend:', e);
        }
      }
      const stored = localStorage.getItem(`favs_${user.email}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchGrandTotal();
  }, []);

  // Reload favorites whenever user logs in or out
  useEffect(() => {
    loadFavorites();

    const handleSync = () => {
      loadFavorites();
    };
    window.addEventListener('favoritesChanged', handleSync);
    return () => window.removeEventListener('favoritesChanged', handleSync);
  }, [user]);

  // Handle marking as favorite (persisted to backend)
  const toggleFavorite = async (productId, e) => {
    e.stopPropagation(); // prevent card click details trigger
    if (!user) {
      alert('Debes iniciar sesión para marcar este producto como favorito.');
      navigate('/login');
      return;
    }

    const isFav = favorites.includes(productId);
    let updated;
    if (isFav) {
      updated = favorites.filter(id => id !== productId);
    } else {
      updated = [...favorites, productId];
    }
    setFavorites(updated);
    localStorage.setItem(`favs_${user.email}`, JSON.stringify(updated));

    try {
      if (user.token) {
        if (isFav) {
          await favoriteService.removeFavorite(productId, user.token);
        } else {
          await favoriteService.addFavorite(productId, user.token);
        }
      }
      window.dispatchEvent(new Event('favoritesChanged'));
    } catch (err) {
      console.error('Error persisting favorite:', err);
    }
  };

  const fetchRandomProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/products/random');
      if (!response.ok) {
        throw new Error('Error al conectar con la API');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor de la API.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaginatedProducts = async (page, categoryFilter, searchObj) => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (searchObj) {
        // Advanced Search URL
        url = `http://localhost:8080/api/products/search/page?page=${page}&size=${limit}`;
        if (searchObj.location) {
          url += `&location=${encodeURIComponent(searchObj.location)}`;
        }
        if (searchObj.startDate) {
          url += `&startDate=${searchObj.startDate}`;
        }
        if (searchObj.endDate) {
          url += `&endDate=${searchObj.endDate}`;
        }
      } else {
        // Standard or category filter
        url = `http://localhost:8080/api/products/page?page=${page}&size=${limit}`;
        if (categoryFilter) {
          url += `&categoryTitle=${encodeURIComponent(categoryFilter)}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al conectar con la API');
      }
      const data = await response.json();
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor de la API.');
    } finally {
      setLoading(false);
    }
  };

  // Sync category or search filter changes with view
  useEffect(() => {
    if (searchParams) {
      setActiveTab('catalog');
      setCurrentPage(0);
      fetchPaginatedProducts(0, null, searchParams);
    } else if (selectedCategory) {
      setActiveTab('catalog');
      setCurrentPage(0);
      fetchPaginatedProducts(0, selectedCategory, null);
    } else {
      if (activeTab === 'random') {
        fetchRandomProducts();
      } else {
        fetchPaginatedProducts(currentPage, null, null);
      }
    }
  }, [selectedCategory, searchParams, activeTab, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
  };

  const renderStars = (rating) => {
    const count = rating >= 9.5 ? 5 : rating >= 8.5 ? 4 : rating >= 7.5 ? 3 : 2;
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} fill={i < count ? 'currentColor' : 'none'} />
    ));
  };

  return (
    <section className="recommendations-block container" id="recommendations-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ textAlign: 'left' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Recomendaciones</h2>
          
          {/* Display search and filter counts (complying with User Story 20 & 22) */}
          <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--text-medium)', fontWeight: 600 }}>
            {searchParams ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Búsqueda: <strong style={{ color: 'var(--accent-color)' }}>
                  {searchParams.location || 'Cualquier destino'} 
                  {searchParams.startDate ? ` (${searchParams.startDate} a ${searchParams.endDate})` : ''}
                </strong>
                <span>({products.length} de {totalElements} encontrados, sobre {grandTotalProducts} totales)</span>
                <button 
                  onClick={onClearSearch}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--error-color)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Limpiar búsqueda
                </button>
              </span>
            ) : selectedCategory ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Filtrado por: <strong style={{ color: 'var(--accent-color)' }}>{selectedCategory}</strong>
                <span>({products.length} de {totalElements} cumpliendo el filtro, sobre {grandTotalProducts} totales)</span>
                <button 
                  onClick={onClearFilter}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--error-color)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Quitar filtro
                </button>
              </span>
            ) : (
              <span>Mostrando {products.length} alojamientos destacados (Total de catálogo: {grandTotalProducts})</span>
            )}
          </div>
        </div>
        
        {/* Toggle tabs (disabled if filters are active since catalog is enforced) */}
        {!selectedCategory && !searchParams && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn-outline ${activeTab === 'random' ? 'active' : ''}`}
              style={{ 
                backgroundColor: activeTab === 'random' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'random' ? 'var(--white)' : 'var(--accent-color)'
              }}
              onClick={() => handleTabChange('random')}
            >
              Recomendaciones Aleatorias
            </button>
            <button 
              className={`btn-outline ${activeTab === 'catalog' ? 'active' : ''}`}
              style={{ 
                backgroundColor: activeTab === 'catalog' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'catalog' ? 'var(--white)' : 'var(--accent-color)'
              }}
              onClick={() => handleTabChange('catalog')}
            >
              Catálogo Completo
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '18px', fontWeight: 600, color: 'var(--primary-color)' }}>
          Cargando productos...
        </div>
      ) : error ? (
        <div className="form-error" style={{ textAlign: 'center', margin: '20px auto', maxWidth: '600px' }}>
          {error}
          <div style={{ marginTop: '10px' }}>
            <button className="btn-outline" onClick={() => activeTab === 'random' ? fetchRandomProducts() : fetchPaginatedProducts(currentPage, selectedCategory, searchParams)}>
              Reintentar
            </button>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-medium)', fontWeight: 600 }}>
          No se encontraron alojamientos bajo los criterios ingresados.
        </div>
      ) : (
        <>
          <div className="recommendations-grid">
            {products.map((prod) => {
              const isFav = favorites.includes(prod.id);
              return (
                <div key={prod.id} className="product-card" onClick={() => navigate(`/producto/${prod.id}`)}>
                  <div className="product-card-img-wrapper">
                    <img 
                      src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} 
                      alt={prod.name} 
                      className="product-card-img" 
                    />
                    {/* Favorite click action (complying with User Story 24) */}
                    <button 
                      className="product-card-fav" 
                      onClick={(e) => toggleFavorite(prod.id, e)}
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      style={{
                        backgroundColor: isFav ? 'var(--white)' : 'rgba(255, 255, 255, 0.7)',
                        color: isFav ? 'var(--error-color)' : 'var(--primary-color)',
                        borderColor: isFav ? 'var(--error-color)' : 'transparent',
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                    >
                      <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
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
                        <span className="product-loc-link">Mostrar en el mapa</span>
                      </div>

                      {/* Dynamic Amenities Render */}
                      <div className="product-card-amenities" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '10px 0' }}>
                        {prod.characteristics && prod.characteristics.map(char => (
                          <span key={char.id} style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--primary-color)' }}>
                            {renderAmenityIcon(char.icon, char.name)}
                          </span>
                        ))}
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
              );
            })}
          </div>

          {/* Render Pagination */}
          {((activeTab === 'catalog' || selectedCategory || searchParams) && totalPages > 1) && (
            <div className="pagination-container">
              <button 
                className="pagination-btn" 
                onClick={handleFirstPage} 
                disabled={currentPage === 0}
                title="Ir al inicio"
              >
                Inicio
              </button>
              <button 
                className="pagination-btn" 
                onClick={handlePrevPage} 
                disabled={currentPage === 0}
                title="Página Anterior"
              >
                Anterior
              </button>
              <span className="pagination-info">
                Página {currentPage + 1} de {totalPages}
              </span>
              <button 
                className="pagination-btn" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages - 1}
                title="Página Siguiente"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default RecommendationsBlock;
