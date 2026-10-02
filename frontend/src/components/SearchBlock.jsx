import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Search, X } from 'lucide-react';
import DoubleCalendar from './DoubleCalendar';

const SearchBlock = ({ onSearch }) => {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Date states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const containerRef = useRef(null);

  // Fetch unique locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          
          // Extract unique locations
          const locs = [...new Set(data.map(p => p.location))].filter(Boolean);
          setLocations(locs);
        }
      } catch (err) {
        console.error('Error fetching locations for search:', err);
      }
    };
    fetchLocations();
  }, []);

  // Handle location input change (Autocomplete suggestion trigger)
  const handleLocationChange = (val) => {
    setLocationInput(val);
    if (val.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter locations containing string (case insensitive)
    const filtered = locations.filter(loc => 
      loc.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (loc) => {
    setLocationInput(loc);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close popup dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      // Auto close calendar once complete range is chosen
      setShowCalendar(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(locationInput, startDate, endDate);
    }
  };

  const formatDisplayDates = () => {
    if (!startDate) return '';
    if (!endDate) return `${startDate} (Check-out pendiente)`;
    return `${startDate}   |   ${endDate}`;
  };

  return (
    <div className="search-block" ref={containerRef}>
      <div className="container search-container">
        <h1 className="search-title">Busca ofertas en hoteles, casas y mucho más</h1>
        <p className="search-subtitle">
          Descubre el lugar ideal reservando en base a tu destino y fechas disponibles
        </p>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          {/* Location field with Autocomplete Suggestions */}
          <div className={`search-box ${locationInput ? 'has-value' : ''}`}>
            <div className="search-box-icon">
              <MapPin size={20} />
            </div>
            <div className="search-box-content">
              <span className="search-box-label">Destino</span>
              <input 
                type="text" 
                className="search-field"
                placeholder="¿A dónde vamos?" 
                value={locationInput}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => {
                  if (locationInput.trim() !== '') setShowSuggestions(true);
                }}
              />
            </div>
            {locationInput && (
              <button 
                type="button" 
                className="search-box-clear"
                onClick={() => {
                  setLocationInput('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                aria-label="Limpiar destino"
              >
                <X size={15} />
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-dropdown-menu">
                <div className="search-dropdown-header">Destinos populares</div>
                <ul className="search-suggestions-list">
                  {suggestions.map((loc, idx) => (
                    <li 
                      key={idx} 
                      className="search-suggestion-item"
                      onClick={() => handleSelectSuggestion(loc)}
                    >
                      <div className="suggestion-icon-wrap">
                        <MapPin size={16} />
                      </div>
                      <div className="suggestion-info">
                        <span className="suggestion-title">{loc}</span>
                        <span className="suggestion-subtitle">Argentina</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Date range picker selector */}
          <div 
            className={`search-box search-box-clickable ${startDate ? 'has-value' : ''}`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div className="search-box-icon">
              <Calendar size={20} />
            </div>
            <div className="search-box-content">
              <span className="search-box-label">Fechas</span>
              <div className="search-date-display">
                {startDate ? (
                  <span className="date-selected-text">
                    {startDate} {endDate ? `— ${endDate}` : '(Check-out pendiente)'}
                  </span>
                ) : (
                  <span className="date-placeholder-text">Check in — Check out</span>
                )}
              </div>
            </div>
            
            {(startDate || endDate) && (
              <button 
                type="button" 
                className="search-box-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setStartDate(null);
                  setEndDate(null);
                }}
                aria-label="Limpiar fechas"
              >
                <X size={15} />
              </button>
            )}

            {/* Double Calendar Popup Overlay */}
            {showCalendar && (
              <div className="search-calendar-popup" onClick={(e) => e.stopPropagation()}>
                <div className="calendar-popup-header">
                  <div className="calendar-popup-title">
                    <h4>Selecciona tus fechas</h4>
                    <p>Consulta tarifas y disponibilidad en tiempo real</p>
                  </div>
                  <button 
                    type="button" 
                    className="calendar-popup-close"
                    onClick={() => setShowCalendar(false)}
                    aria-label="Cerrar calendario"
                  >
                    <X size={18} />
                  </button>
                </div>
                <DoubleCalendar 
                  selectedStart={startDate}
                  selectedEnd={endDate}
                  onRangeSelect={handleRangeSelect}
                  readOnly={false}
                />
                <div className="calendar-popup-footer">
                  <div className="calendar-status-legend">
                    <span className="legend-item"><span className="legend-dot available"></span> Disponible</span>
                    <span className="legend-item"><span className="legend-dot occupied"></span> Ocupado</span>
                    <span className="legend-item"><span className="legend-dot selected"></span> Seleccionado</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-apply-dates"
                    onClick={() => setShowCalendar(false)}
                  >
                    Listo
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn-search">
            <Search size={20} />
            <span>Buscar</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBlock;
