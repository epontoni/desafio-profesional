import React, { useState, useEffect } from 'react';

const CategoriesBlock = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories');
        if (!response.ok) {
          throw new Error('Error al conectar con la API.');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCardClick = (title) => {
    if (selectedCategory === title) {
      onSelectCategory(null); // Toggle off if clicked again
    } else {
      onSelectCategory(title); // Set active filter
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '20px 0', textAlign: 'center', fontWeight: 600, color: 'var(--primary-color)' }}>
        Cargando categorías...
      </div>
    );
  }

  if (error) {
    return null; // Fail silently or log error; don't disrupt home layout
  }

  return (
    <section className="categories-block container">
      <h2 className="section-title">Buscar por tipo de alojamiento</h2>
      <div className="categories-grid">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.title;
          return (
            <div 
              key={cat.id} 
              className="category-card"
              onClick={() => handleCardClick(cat.title)}
              style={{
                borderColor: isSelected ? 'var(--accent-color)' : 'transparent',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transform: isSelected ? 'scale(1.02)' : 'none',
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              <img src={cat.imageUrl} alt={cat.title} className="category-img" />
              <div className="category-info">
                <h3 className="category-name">{cat.title}</h3>
                <p className="category-count" style={{ fontSize: '13px', color: 'var(--text-medium)', fontWeight: 500, marginTop: '4px' }}>
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesBlock;
