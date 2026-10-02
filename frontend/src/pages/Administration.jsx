import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, List, Trash2, MonitorOff, ArrowLeft, Users, Layers, 
  Settings, ShieldAlert, X, Calendar, Search, Building2, 
  User as UserIcon, Clock, Filter, Eye, AlertCircle, MapPin,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Administration = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Responsiveness blocker state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Sidebar collapsible state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Active view: 'list', 'bookings', 'add_product', 'categories', 'characteristics', 'users'
  const [activeSection, setActiveSection] = useState('list');

  // Shared Loaded Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Bookings State ---
  const [bookingsList, setBookingsList] = useState([]);
  const [bookingHotelFilter, setBookingHotelFilter] = useState('ALL');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);


  // --- Product Form State ---
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodLocation, setProdLocation] = useState('');
  const [prodSelectedChars, setProdSelectedChars] = useState([]); // array of characteristic IDs
  const [prodImages, setProdImages] = useState(['']);
  const [prodError, setProdError] = useState(null);
  const [prodSuccess, setProdSuccess] = useState(null);

  // --- Category Form State ---
  const [catTitle, setCatTitle] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImgUrl, setCatImgUrl] = useState('');
  const [catError, setCatError] = useState(null);
  const [catSuccess, setCatSuccess] = useState(null);

  // --- Characteristic Form State ---
  const [charName, setCharName] = useState('');
  const [charIcon, setCharIcon] = useState('wifi');
  const [charError, setCharError] = useState(null);
  const [charSuccess, setCharSuccess] = useState(null);

  // --- Product Deletion Modal State ---
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // --- Category Deletion Modal State ---
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteCategoryTitle, setDeleteCategoryTitle] = useState('');
  const [isConfirmDeleteCatOpen, setIsConfirmDeleteCatOpen] = useState(false);

  // Screen resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Category List
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !prodCategoryId) {
          setProdCategoryId(data[0].id.toString());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Characteristic List
  const fetchCharacteristics = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/characteristics');
      if (res.ok) {
        const data = await res.json();
        setCharacteristics(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Products List
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/api/products');
      if (!res.ok) throw new Error('Error al conectar con la API.');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users List
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/api/users', {
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      if (!res.ok) throw new Error('Error al conectar con la API.');
      const data = await res.json();
      setUsersList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Bookings List
  const fetchBookings = async (productId = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = (productId && productId !== 'ALL')
        ? `http://localhost:8080/api/bookings?productId=${productId}`
        : 'http://localhost:8080/api/bookings';
      const res = await fetch(url, {
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      if (!res.ok) throw new Error('Error al consultar las reservas.');
      const data = await res.json();
      setBookingsList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Booking helper calculations
  const getBookingStatus = (startDate, endDate) => {
    const today = new Date().toISOString().split('T')[0];
    if (endDate < today) {
      return { key: 'COMPLETED', label: 'Finalizada', color: '#495057', bg: '#e9ecef' };
    } else if (startDate <= today && endDate >= today) {
      return { key: 'ACTIVE', label: 'En curso', color: '#0d6efd', bg: '#e7f1ff' };
    } else {
      return { key: 'UPCOMING', label: 'Próxima', color: '#198754', bg: '#d1e7dd' };
    }
  };

  const calculateNights = (start, end) => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Load section-specific resources
  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') return;

    if (activeSection === 'list') {
      fetchProducts();
    } else if (activeSection === 'bookings') {
      fetchBookings();
      if (products.length === 0) {
        fetchProducts();
      }
    } else if (activeSection === 'add_product') {
      fetchCategories();
      fetchCharacteristics();
      setProdError(null);
      setProdSuccess(null);
    } else if (activeSection === 'categories') {
      fetchCategories();
      setCatError(null);
      setCatSuccess(null);
    } else if (activeSection === 'characteristics') {
      fetchCharacteristics();
      setCharError(null);
      setCharSuccess(null);
    } else if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection, user]);

  // Handle Add Product Submit (complying with User Story 3, 12, 17)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProdError(null);
    setProdSuccess(null);

    if (!prodName.trim()) return setProdError('El nombre del alojamiento es obligatorio.');
    if (!prodCategoryId) return setProdError('Debe seleccionar una categoría.');
    if (!prodLocation.trim()) return setProdError('La ubicación es obligatoria.');
    if (!prodDesc.trim()) return setProdError('La descripción es obligatoria.');

    const validUrls = prodImages.filter(url => url.trim() !== '');
    if (validUrls.length === 0) {
      return setProdError('Debe añadir al menos una URL de imagen válida.');
    }

    // Build Category and Characteristic relations objects
    const selectedCategoryObj = categories.find(cat => cat.id.toString() === prodCategoryId);
    const selectedCharsObjs = characteristics.filter(char => prodSelectedChars.includes(char.id));

    const payload = {
      name: prodName,
      description: prodDesc,
      categoryId: parseInt(prodCategoryId),
      category: selectedCategoryObj,
      location: prodLocation,
      rating: 9.0, // Default premium value
      ratingText: 'Excelente', // Default text
      characteristics: selectedCharsObjs,
      images: validUrls
    };

    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        return setProdError(data.message || data.error || 'Error al guardar el producto.');
      }

      setProdSuccess('¡El alojamiento ha sido registrado de forma exitosa en el catálogo!');
      setProdName('');
      setProdDesc('');
      setProdLocation('');
      setProdSelectedChars([]);
      setProdImages(['']);
    } catch (err) {
      console.error(err);
      setProdError('Error de red al registrar el producto.');
    }
  };

  const handleProductImageChange = (idx, val) => {
    const updated = [...prodImages];
    updated[idx] = val;
    setProdImages(updated);
  };

  const addProductImageField = () => setProdImages([...prodImages, '']);
  const removeProductImageField = (idx) => {
    if (prodImages.length > 1) {
      setProdImages(prodImages.filter((_, i) => i !== idx));
    }
  };

  const handleProductCharToggle = (id) => {
    if (prodSelectedChars.includes(id)) {
      setProdSelectedChars(prodSelectedChars.filter(item => item !== id));
    } else {
      setProdSelectedChars([...prodSelectedChars, id]);
    }
  };

  // Handle Add Category Submit (complying with User Story 21)
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCatError(null);
    setCatSuccess(null);

    if (!catTitle.trim()) return setCatError('El título es obligatorio.');
    if (!catDesc.trim()) return setCatError('La descripción es obligatoria.');
    if (!catImgUrl.trim()) return setCatError('La URL de imagen es obligatoria.');

    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({ title: catTitle, description: catDesc, imageUrl: catImgUrl })
      });
      const data = await response.json();

      if (!response.ok) {
        return setCatError(data.message || data.error || 'Error al guardar la categoría.');
      }

      setCatSuccess('Categoría registrada exitosamente.');
      setCatTitle('');
      setCatDesc('');
      setCatImgUrl('');
      fetchCategories(); // Re-fetch
    } catch (err) {
      console.error(err);
      setCatError('Error de red al registrar la categoría.');
    }
  };

  const triggerCategoryDelete = (id, title) => {
    setDeleteCategoryId(id);
    setDeleteCategoryTitle(title);
    setIsConfirmDeleteCatOpen(true);
  };

  const handleCategoryDeleteConfirm = async () => {
    if (!deleteCategoryId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/categories/${deleteCategoryId}`, {
        method: 'DELETE',
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      if (res.ok) {
        fetchCategories();
      } else {
        throw new Error();
      }
    } catch (err) {
      alert('No se pudo eliminar la categoría. Verifique que no esté vinculada a alojamientos.');
    } finally {
      setIsConfirmDeleteCatOpen(false);
      setDeleteCategoryId(null);
      setDeleteCategoryTitle('');
    }
  };

  // Handle Add Characteristic Submit (complying with User Story 17)
  const handleCharacteristicSubmit = async (e) => {
    e.preventDefault();
    setCharError(null);
    setCharSuccess(null);

    if (!charName.trim()) return setCharError('El nombre es obligatorio.');

    try {
      const response = await fetch('http://localhost:8080/api/characteristics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({ name: charName, icon: charIcon })
      });
      const data = await response.json();

      if (!response.ok) {
        return setCharError(data.message || data.error || 'Error al guardar la característica.');
      }

      setCharSuccess('Característica registrada exitosamente.');
      setCharName('');
      setCharIcon('wifi');
      fetchCharacteristics();
    } catch (err) {
      console.error(err);
      setCharError('Error de red al registrar la característica.');
    }
  };

  const handleDeleteCharacteristic = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta característica?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/characteristics/${id}`, {
        method: 'DELETE',
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      if (res.ok) fetchCharacteristics();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle user permissions (complying with User Story 16)
  const toggleUserRole = async (targetUser) => {
    // Avoid self-demotion
    if (targetUser.email === user.email) {
      alert('No puedes quitarte los permisos de administrador a ti mismo.');
      return;
    }

    const newRole = targetUser.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    const msg = `¿Deseas cambiar el rol del usuario ${targetUser.email} a ${newRole === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario Común'}?`;
    if (!window.confirm(msg)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${targetUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) throw new Error('Error al actualizar rol.');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error de red al cambiar los permisos del usuario.');
    }
  };

  // Product Deletion Dialog triggers
  const triggerProductDelete = (id, name) => {
    setDeleteProductId(id);
    setDeleteProductName(name);
    setIsConfirmDeleteOpen(true);
  };

  const handleProductDeleteConfirm = async () => {
    if (!deleteProductId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/products/${deleteProductId}`, {
        method: 'DELETE',
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      if (res.ok) {
        fetchProducts();
      } else {
        throw new Error();
      }
    } catch (err) {
      alert('No se pudo eliminar el alojamiento.');
    } finally {
      setIsConfirmDeleteOpen(false);
      setDeleteProductId(null);
      setDeleteProductName('');
    }
  };

  // Mobile View Blocker
  if (isMobile) {
    return (
      <div className="admin-mobile-blocker active">
        <MonitorOff size={64} style={{ color: 'var(--accent-color)' }} />
        <h1 className="admin-blocker-title">Acceso Restringido</h1>
        <p className="admin-blocker-text">
          El panel de administración de **Digital Booking** está optimizado únicamente para pantallas de escritorio.
          Por favor, inicia sesión desde una PC o portátil.
        </p>
        <button className="admin-blocker-btn" onClick={() => navigate('/')}>
          Volver al Home
        </button>
      </div>
    );
  }

  // Admin Role Guard View (complying with Security criteria)
  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <>
        <Header />
        <main className="app-main container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px', backgroundColor: 'var(--white)', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <ShieldAlert size={64} style={{ color: 'var(--error-color)' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-color)' }}>Acceso Denegado</h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '15px', lineHeight: 1.5 }}>
              Esta sección es de uso exclusivo para Administradores de la plataforma. Si cuentas con credenciales de administrador, por favor inicia sesión.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button className="btn-outline" onClick={() => navigate('/login')}>Iniciar Sesión</button>
              <button className="btn-outline" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }} onClick={() => navigate('/')}>Volver al Home</button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="app-main admin-page">
        {/* Sidebar Nav */}
        <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="admin-sidebar-header">
            {!isSidebarCollapsed && <div className="admin-sidebar-title">Administración</div>}
            <button
              type="button"
              className="admin-sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expandir menú" : "Contraer menú"}
              aria-label={isSidebarCollapsed ? "Expandir menú" : "Contraer menú"}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <div className="admin-sidebar-nav">
            <div 
              className={`admin-nav-item ${activeSection === 'list' ? 'active' : ''}`} 
              onClick={() => setActiveSection('list')}
              title={isSidebarCollapsed ? "Lista de productos" : undefined}
            >
              <List size={20} className="admin-nav-icon" />
              {!isSidebarCollapsed && <span>Lista de productos</span>}
            </div>
            <div 
              className={`admin-nav-item ${activeSection === 'bookings' ? 'active' : ''}`} 
              onClick={() => setActiveSection('bookings')}
              title={isSidebarCollapsed ? "Reservas de Hoteles" : undefined}
            >
              <Calendar size={20} className="admin-nav-icon" />
              {!isSidebarCollapsed && <span>Reservas de Hoteles</span>}
            </div>
            <div 
              className={`admin-nav-item ${activeSection === 'add_product' ? 'active' : ''}`} 
              onClick={() => setActiveSection('add_product')}
              title={isSidebarCollapsed ? "Agregar producto" : undefined}
            >
              <Plus size={20} className="admin-nav-icon" />
              {!isSidebarCollapsed && <span>Agregar producto</span>}
            </div>
            <div 
              className={`admin-nav-item ${activeSection === 'categories' ? 'active' : ''}`} 
              onClick={() => setActiveSection('categories')}
              title={isSidebarCollapsed ? "Categorías" : undefined}
            >
              <Layers size={20} className="admin-nav-icon" />
              {!isSidebarCollapsed && <span>Categorías</span>}
            </div>
            <div 
              className={`admin-nav-item ${activeSection === 'characteristics' ? 'active' : ''}`} 
              onClick={() => setActiveSection('characteristics')}
              title={isSidebarCollapsed ? "Características" : undefined}
            >
              <Settings size={20} className="admin-nav-icon" />
              {!isSidebarCollapsed && <span>Características</span>}
            </div>
            <div 
              className={`admin-nav-item ${activeSection === 'users' ? 'active' : ''}`} 
              onClick={() => setActiveSection('users')}
              title={isSidebarCollapsed ? "Roles de Usuarios" : undefined}
            >
              <Users size={20} className="admin-nav-icon" />
              {!isSidebarCollapsed && <span>Roles de Usuarios</span>}
            </div>
          </div>

          <div 
            className="admin-nav-item admin-nav-exit" 
            onClick={() => navigate('/')}
            title={isSidebarCollapsed ? "Volver al Home" : undefined}
          >
            <ArrowLeft size={20} className="admin-nav-icon" />
            {!isSidebarCollapsed && <span>Volver al Home</span>}
          </div>
        </aside>

        {/* Content Area */}
        <section className="admin-content">
          {/* View 1: List Products */}
          {activeSection === 'list' && (
            <div>
              <h1 className="admin-section-title">Catálogo de Alojamientos</h1>
              {loading ? <p>Cargando listado...</p> : error ? <div className="form-error">{error}</div> : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Ubicación</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id}>
                          <td>{prod.id}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{prod.name}</td>
                          <td>{prod.category ? prod.category.title : 'Sin categoría'}</td>
                          <td>{prod.location}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn-delete" onClick={() => triggerProductDelete(prod.id, prod.name)}>
                              <Trash2 size={14} />
                              <span>Eliminar</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* View: Hotel Bookings Management View */}
          {activeSection === 'bookings' && (() => {
            const totalBookings = bookingsList.length;
            const upcomingCount = bookingsList.filter(b => getBookingStatus(b.startDate, b.endDate).key === 'UPCOMING').length;
            const activeCount = bookingsList.filter(b => getBookingStatus(b.startDate, b.endDate).key === 'ACTIVE').length;
            const completedCount = bookingsList.filter(b => getBookingStatus(b.startDate, b.endDate).key === 'COMPLETED').length;

            const filteredBookings = bookingsList.filter((b) => {
              if (bookingHotelFilter !== 'ALL' && b.product?.id?.toString() !== bookingHotelFilter) {
                return false;
              }
              const status = getBookingStatus(b.startDate, b.endDate);
              if (bookingStatusFilter !== 'ALL' && status.key !== bookingStatusFilter) {
                return false;
              }
              if (bookingSearchQuery.trim()) {
                const q = bookingSearchQuery.toLowerCase().trim();
                const fullName = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
                const email = (b.user?.email || '').toLowerCase();
                const hotelName = (b.product?.name || '').toLowerCase();
                const hotelLoc = (b.product?.location || '').toLowerCase();
                const bookingId = b.id?.toString() || '';
                return (
                  fullName.includes(q) ||
                  email.includes(q) ||
                  hotelName.includes(q) ||
                  hotelLoc.includes(q) ||
                  bookingId.includes(q)
                );
              }
              return true;
            });

            return (
              <div>
                <div className="admin-bookings-header">
                  <div>
                    <h1 className="admin-section-title" style={{ marginBottom: '4px' }}>Reservas de Hoteles</h1>
                    <p style={{ color: 'var(--text-medium)', fontSize: '14px' }}>
                      Visualiza, filtra y gestiona todas las reservas registradas en los alojamientos de la plataforma.
                    </p>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="bookings-stats-grid">
                    <div className="booking-stat-card">
                      <div className="booking-stat-icon">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <div className="booking-stat-val">{totalBookings}</div>
                        <div className="booking-stat-lbl">Total de Reservas</div>
                      </div>
                    </div>
                    <div className="booking-stat-card stat-upcoming">
                      <div className="booking-stat-icon">
                        <Clock size={22} />
                      </div>
                      <div>
                        <div className="booking-stat-val">{upcomingCount}</div>
                        <div className="booking-stat-lbl">Próximas</div>
                      </div>
                    </div>
                    <div className="booking-stat-card stat-active">
                      <div className="booking-stat-icon">
                        <Building2 size={22} />
                      </div>
                      <div>
                        <div className="booking-stat-val">{activeCount}</div>
                        <div className="booking-stat-lbl">En Curso</div>
                      </div>
                    </div>
                    <div className="booking-stat-card stat-completed">
                      <div className="booking-stat-icon">
                        <List size={22} />
                      </div>
                      <div>
                        <div className="booking-stat-val">{completedCount}</div>
                        <div className="booking-stat-lbl">Finalizadas</div>
                      </div>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="bookings-toolbar">
                    <div className="bookings-search-input">
                      <Search size={18} />
                      <input 
                        type="text" 
                        placeholder="Buscar por cliente, email, hotel o ID..." 
                        value={bookingSearchQuery}
                        onChange={(e) => setBookingSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="bookings-filter-group">
                      <select 
                        className="bookings-hotel-select"
                        value={bookingHotelFilter}
                        onChange={(e) => setBookingHotelFilter(e.target.value)}
                      >
                        <option value="ALL">🏨 Todos los Alojamientos</option>
                        {products.map(prod => (
                          <option key={prod.id} value={prod.id.toString()}>
                            {prod.name} ({prod.location})
                          </option>
                        ))}
                      </select>

                      <div style={{ display: 'flex', gap: '6px', background: '#F1F3F5', padding: '4px', borderRadius: '8px' }}>
                        {[
                          { key: 'ALL', label: 'Todas' },
                          { key: 'UPCOMING', label: 'Próximas' },
                          { key: 'ACTIVE', label: 'En curso' },
                          { key: 'COMPLETED', label: 'Finalizadas' }
                        ].map(tab => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setBookingStatusFilter(tab.key)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: bookingStatusFilter === tab.key ? 'var(--primary-color)' : 'transparent',
                              color: bookingStatusFilter === tab.key ? '#fff' : 'var(--text-medium)',
                              transition: 'all 0.2s'
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <p style={{ padding: '20px', color: 'var(--text-medium)' }}>Cargando reservas...</p>
                ) : error ? (
                  <div className="form-error">{error}</div>
                ) : filteredBookings.length === 0 ? (
                  <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <Calendar size={48} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '18px', color: 'var(--text-dark)' }}>No se encontraron reservas</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '14px', marginTop: '6px' }}>
                      {bookingSearchQuery || bookingHotelFilter !== 'ALL' || bookingStatusFilter !== 'ALL'
                        ? 'No hay reservas que coincidan con los filtros aplicados.'
                        : 'Aún no se han registrado reservas en el sistema.'}
                    </p>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Alojamiento</th>
                          <th>Huésped</th>
                          <th>Estadía</th>
                          <th>Horario Llegada</th>
                          <th>Estado</th>
                          <th style={{ textAlign: 'right' }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => {
                          const status = getBookingStatus(b.startDate, b.endDate);
                          const nights = calculateNights(b.startDate, b.endDate);
                          const hotelThumb = b.product?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200';

                          return (
                            <tr key={b.id}>
                              <td style={{ fontWeight: 700, color: 'var(--text-medium)' }}>#{b.id}</td>
                              <td>
                                <div className="booking-hotel-info">
                                  <img src={hotelThumb} alt={b.product?.name || 'Hotel'} className="booking-thumb" />
                                  <div>
                                    <div className="booking-hotel-name">{b.product?.name || 'Alojamiento no disponible'}</div>
                                    <div className="booking-hotel-meta">
                                      <MapPin size={12} />
                                      <span>{b.product?.location || 'Ubicación no disponible'}</span>
                                      {b.product?.category?.title && (
                                        <span>• {b.product.category.title}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="booking-user-cell">
                                  <div className="booking-user-name">
                                    {b.user ? `${b.user.firstName} ${b.user.lastName}` : 'Usuario anónimo'}
                                  </div>
                                  <div className="booking-user-email">
                                    {b.user?.email || '-'}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="booking-dates-cell">
                                  <div className="booking-date-range">
                                    {formatDate(b.startDate)} → {formatDate(b.endDate)}
                                  </div>
                                  <span className="booking-nights-badge">
                                    {nights} {nights === 1 ? 'noche' : 'noches'}
                                  </span>
                                </div>
                              </td>
                              <td style={{ fontSize: '13px', color: 'var(--text-medium)' }}>
                                {b.estimatedArrivalTime ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Clock size={13} style={{ color: 'var(--primary-color)' }} />
                                    <span>{b.estimatedArrivalTime}</span>
                                  </div>
                                ) : (
                                  <span style={{ color: '#adb5bd', fontStyle: 'italic' }}>No indicada</span>
                                )}
                              </td>
                              <td>
                                <span 
                                  className="booking-pill"
                                  style={{ backgroundColor: status.bg, color: status.color }}
                                >
                                  {status.label}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  className="btn-outline"
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                  onClick={() => setSelectedBookingDetails(b)}
                                >
                                  <Eye size={14} />
                                  <span>Detalles</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* View 2: Add Product Form (complying with User Story 3, 12, 17) */}
          {activeSection === 'add_product' && (
            <div>
              <h1 className="admin-section-title">Registrar Alojamiento</h1>
              <div className="admin-card">
                {prodError && <div className="form-error">{prodError}</div>}
                {prodSuccess && <div className="form-success">{prodSuccess}</div>}
                <form onSubmit={handleProductSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nombre del alojamiento</label>
                      <input type="text" className="form-control" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="Ej. Hermitage Hotel" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Categoría</label>
                      <select className="form-control" value={prodCategoryId} onChange={(e) => setProdCategoryId(e.target.value)}>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ubicación</label>
                    <input type="text" className="form-control" value={prodLocation} onChange={(e) => setProdLocation(e.target.value)} placeholder="Ej. Bariloche, Argentina" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" rows="4" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} placeholder="Escribe detalles..." />
                  </div>

                  {/* Characteristics checkboxes (loaded dynamically from database) */}
                  <div className="form-group">
                    <label className="form-label">Características / Amenities</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '8px' }}>
                      {characteristics.map(char => (
                        <label key={char.id} className="form-checkbox-item" style={{ fontSize: '13px' }}>
                          <input 
                            type="checkbox" 
                            checked={prodSelectedChars.includes(char.id)} 
                            onChange={() => handleProductCharToggle(char.id)} 
                          />
                          <span>{char.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Multiple image URLs inputs list */}
                  <div className="form-group">
                    <label className="form-label">Imágenes (URLs)</label>
                    <div className="image-inputs-list">
                      {prodImages.map((url, idx) => (
                        <div key={idx} className="image-input-row">
                          <input type="text" className="form-control" value={url} onChange={(e) => handleProductImageChange(idx, e.target.value)} placeholder="https://unsplash.com/..." />
                          {prodImages.length > 1 && (
                            <button type="button" className="btn-delete" onClick={() => removeProductImageField(idx)} style={{ padding: '12px' }}>
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn-add-img" onClick={addProductImageField}>+ Agregar otra imagen</button>
                  </div>

                  <button type="submit" className="btn-submit">Registrar Alojamiento</button>
                </form>
              </div>
            </div>
          )}

          {/* View 3: Category Management View (complying with User Story 21) */}
          {activeSection === 'categories' && (
            <div>
              <h1 className="admin-section-title">Administrar Categorías</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
                <div className="admin-card" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Agregar Categoría</h3>
                  {catError && <div className="form-error">{catError}</div>}
                  {catSuccess && <div className="form-success">{catSuccess}</div>}
                  <form onSubmit={handleCategorySubmit}>
                    <div className="form-group">
                      <label className="form-label">Título</label>
                      <input type="text" className="form-control" value={catTitle} onChange={(e) => setCatTitle(e.target.value)} placeholder="Ej. Cabañas" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" rows="3" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Ej. Rodeados de naturaleza..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">URL de Imagen</label>
                      <input type="text" className="form-control" value={catImgUrl} onChange={(e) => setCatImgUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <button type="submit" className="btn-submit" style={{ marginTop: '10px' }}>Añadir</button>
                  </form>
                </div>

                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Isotipo</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id}>
                          <td>
                            <img src={cat.imageUrl} alt={cat.title} style={{ width: '44px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                          </td>
                          <td style={{ fontWeight: 700 }}>{cat.title}</td>
                          <td style={{ fontSize: '12px', color: 'var(--text-medium)' }}>{cat.description}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn-delete" onClick={() => triggerCategoryDelete(cat.id, cat.title)}>
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* View 4: Characteristics Management View (complying with User Story 17) */}
          {activeSection === 'characteristics' && (
            <div>
              <h1 className="admin-section-title">Administrar Características</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
                <div className="admin-card" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Añadir Nueva</h3>
                  {charError && <div className="form-error">{charError}</div>}
                  {charSuccess && <div className="form-success">{charSuccess}</div>}
                  <form onSubmit={handleCharacteristicSubmit}>
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="Ej. Estacionamiento" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ícono Asociado</label>
                      <select className="form-control" value={charIcon} onChange={(e) => setCharIcon(e.target.value)}>
                        <option value="wifi">Wifi (Inalámbrico)</option>
                        <option value="waves">Waves (Piscina)</option>
                        <option value="car">Car (Estacionamiento)</option>
                        <option value="tv">Tv (Televisión)</option>
                        <option value="wind">Wind (Aire Acondicionado)</option>
                        <option value="dumbbell">Dumbbell (Gimnasio)</option>
                      </select>
                    </div>
                    <button type="submit" className="btn-submit" style={{ marginTop: '10px' }}>Guardar</button>
                  </form>
                </div>

                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Ícono</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {characteristics.map(char => (
                        <tr key={char.id}>
                          <td>{char.id}</td>
                          <td style={{ fontWeight: 700 }}>{char.name}</td>
                          <td style={{ fontFamily: 'monospace' }}>{char.icon}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn-delete" onClick={() => handleDeleteCharacteristic(char.id)}>
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* View 5: User Management list (complying with User Story 16) */}
          {activeSection === 'users' && (
            <div>
              <h1 className="admin-section-title">Roles de Usuarios Registrados</h1>
              {loading ? <p>Cargando usuarios...</p> : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Permisos</th>
                        <th style={{ textAlign: 'right' }}>Modificar Permisos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((targetUser) => (
                        <tr key={targetUser.id}>
                          <td>{targetUser.id}</td>
                          <td style={{ fontWeight: 700 }}>{targetUser.firstName} {targetUser.lastName}</td>
                          <td>{targetUser.email}</td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', 
                              backgroundColor: targetUser.role === 'ROLE_ADMIN' ? 'rgba(29, 190, 180, 0.15)' : '#E2E2E6',
                              color: targetUser.role === 'ROLE_ADMIN' ? 'var(--accent-color)' : 'var(--text-medium)',
                              fontWeight: 700,
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>
                              {targetUser.role === 'ROLE_ADMIN' ? 'ADMINISTRADOR' : 'USUARIO'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-outline"
                              style={{ 
                                padding: '4px 10px', 
                                fontSize: '11px',
                                borderColor: targetUser.role === 'ROLE_ADMIN' ? 'var(--error-color)' : 'var(--accent-color)',
                                color: targetUser.role === 'ROLE_ADMIN' ? 'var(--error-color)' : 'var(--accent-color)'
                              }}
                              disabled={targetUser.email === user.email}
                              onClick={() => toggleUserRole(targetUser)}
                            >
                              {targetUser.role === 'ROLE_ADMIN' ? 'Quitar Admin' : 'Hacer Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Product Delete Confirmation Dialog Modal */}
      {isConfirmDeleteOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box">
            <h3 className="confirm-modal-title">¿Eliminar Alojamiento?</h3>
            <p className="confirm-modal-text">
              ¿Estás seguro de que deseas eliminar permanentemente el producto **"{deleteProductName}"**?
              Esta acción no se puede deshacer y el producto desaparecerá del home.
            </p>
            <div className="confirm-modal-actions">
              <button className="btn-confirm-yes" onClick={handleProductDeleteConfirm}>Confirmar</button>
              <button className="btn-confirm-no" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Delete Confirmation Dialog Modal (complying with User Story 29) */}
      {isConfirmDeleteCatOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box">
            <h3 className="confirm-modal-title">¿Eliminar Categoría?</h3>
            <p className="confirm-modal-text">
              ¿Estás seguro de que deseas eliminar la categoría **"{deleteCategoryTitle}"**?
              Si hay alojamientos asociados a esta categoría, la eliminación podría desvincularlos o fallar si existen dependencias.
            </p>
            <div className="confirm-modal-actions">
              <button className="btn-confirm-yes" onClick={handleCategoryDeleteConfirm}>Confirmar</button>
              <button className="btn-confirm-no" onClick={() => setIsConfirmDeleteCatOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="confirm-modal-overlay" onClick={() => setSelectedBookingDetails(null)}>
          <div 
            className="confirm-modal-box" 
            style={{ maxWidth: '580px', width: '90%', textAlign: 'left', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e9ecef', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>
                  Reserva #{selectedBookingDetails.id}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                  Detalle completo de la reserva
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedBookingDetails(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-medium)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Hotel Info Card */}
            <div style={{ display: 'flex', gap: '16px', background: '#F8F9FA', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <img 
                src={selectedBookingDetails.product?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'} 
                alt={selectedBookingDetails.product?.name || 'Hotel'} 
                style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 700 }}>
                  {selectedBookingDetails.product?.category?.title || 'Alojamiento'}
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', margin: '4px 0' }}>
                  {selectedBookingDetails.product?.name}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-medium)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {selectedBookingDetails.product?.location}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-medium)', fontWeight: 600 }}>Huésped:</span>
                <p style={{ margin: '4px 0 0', fontWeight: 700, color: 'var(--text-dark)', fontSize: '14px' }}>
                  {selectedBookingDetails.user ? `${selectedBookingDetails.user.firstName} ${selectedBookingDetails.user.lastName}` : 'No disponible'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-medium)' }}>
                  {selectedBookingDetails.user?.email || '-'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-medium)', fontWeight: 600 }}>Estado:</span>
                <div style={{ marginTop: '4px' }}>
                  {(() => {
                    const status = getBookingStatus(selectedBookingDetails.startDate, selectedBookingDetails.endDate);
                    return (
                      <span className="booking-pill" style={{ backgroundColor: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-medium)', fontWeight: 600 }}>Fechas de Estadía:</span>
                <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--text-dark)', fontSize: '13px' }}>
                  Check-in: {formatDate(selectedBookingDetails.startDate)}
                </p>
                <p style={{ margin: '2px 0 0', fontWeight: 600, color: 'var(--text-dark)', fontSize: '13px' }}>
                  Check-out: {formatDate(selectedBookingDetails.endDate)}
                </p>
                <span className="booking-nights-badge" style={{ marginTop: '6px' }}>
                  {calculateNights(selectedBookingDetails.startDate, selectedBookingDetails.endDate)} {calculateNights(selectedBookingDetails.startDate, selectedBookingDetails.endDate) === 1 ? 'noche' : 'noches'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-medium)', fontWeight: 600 }}>Horario de Llegada:</span>
                <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--text-dark)', fontSize: '13px' }}>
                  {selectedBookingDetails.estimatedArrivalTime || 'No indicado por el cliente'}
                </p>
              </div>
            </div>

            {/* Notes if available */}
            {selectedBookingDetails.notes && (
              <div style={{ background: '#FFF8E1', borderLeft: '4px solid #FFB300', padding: '12px 14px', borderRadius: '4px', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#F57F17' }}>Observaciones del Huésped:</span>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#5D4037' }}>
                  {selectedBookingDetails.notes}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="button" 
                className="btn-confirm-no"
                onClick={() => setSelectedBookingDetails(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Administration;
