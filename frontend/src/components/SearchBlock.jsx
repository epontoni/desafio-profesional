import React, { useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';

const SearchBlock = () => {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', destination, 'on dates:', dates);
  };

  return (
    <section className="search-block">
      <div className="container">
        <h1 className="search-title">Busca ofertas en hoteles, casas y mucho más</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <MapPin className="search-input-icon" size={20} />
            <input
              type="text"
              placeholder="¿A dónde vamos?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="search-input-wrapper">
            <Calendar className="search-input-icon" size={20} />
            <input
              type="text"
              placeholder="Check in - Check out"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search">Buscar</button>
        </form>
      </div>
    </section>
  );
};

export default SearchBlock;
