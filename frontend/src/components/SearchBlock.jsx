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
        <p className="search-subtitle" style={{ color: 'var(--white)', opacity: 0.9, marginTop: '-12px', marginBottom: '20px', fontWeight: 500 }}>
          Descubre el lugar ideal reservando en base a tu destino y fechas disponibles
        </p>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          {/* Location field with Autocomplete Suggestions */}
          <div className="search-input-group" style={{ position: 'relative' }}>
            <MapPin className="search-icon" />
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
            {locationInput && (
              <button 
                type="button" 
                onClick={() => {
                  setLocationInput('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'absolute', right: '14px', top: '16px', color: 'var(--text-light)' }}
              >
                <X size={16} />
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions-dropdown">
                {suggestions.map((loc, idx) => (
                  <li 
                    key={idx} 
                    className="search-suggestion-item"
                    onClick={() => handleSelectSuggestion(loc)}
                  >
                    <MapPin size={16} style={{ color: 'var(--accent-color)', marginRight: '8px' }} />
                    <span style={{ fontWeight: 600 }}>{loc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date range picker selector */}
          <div className="search-input-group" style={{ position: 'relative' }}>
            <Calendar className="search-icon" />
            <input 
              type="text" 
              className="search-field"
              placeholder="Check in - Check out" 
              readOnly
              value={formatDisplayDates()}
              onClick={() => setShowCalendar(!showCalendar)}
              style={{ cursor: 'pointer' }}
            />
            
            {(startDate || endDate) && (
              <button 
                type="button" 
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'absolute', right: '14px', top: '16px', color: 'var(--text-light)' }}
              >
                <X size={16} />
              </button>
            )}

            {/* Double Calendar Popup Overlay */}
            {showCalendar && (
              <div className="search-calendar-popup">
                <DoubleCalendar 
                  selectedStart={startDate}
                  selectedEnd={endDate}
                  onRangeSelect={handleRangeSelect}
                  readOnly={false}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-search">
            <Search size={18} />
            <span>Buscar</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBlock;
