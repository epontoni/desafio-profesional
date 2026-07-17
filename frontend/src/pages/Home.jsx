import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBlock from '../components/SearchBlock';
import CategoriesBlock from '../components/CategoriesBlock';
import RecommendationsBlock from '../components/RecommendationsBlock';
import Footer from '../components/Footer';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  const handleSelectCategory = (categoryTitle) => {
    setSelectedCategory(categoryTitle);
    setSearchParams(null); // Clear search params if category clicked
    
    // Scroll down to recommendations list on category selection
    setTimeout(() => {
      const element = document.getElementById('recommendations-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSearch = (location, startDate, endDate) => {
    setSearchParams({ location, startDate, endDate });
    setSelectedCategory(null); // Clear category filter if search triggered
    
    // Scroll down to recommendations list on search trigger
    setTimeout(() => {
      const element = document.getElementById('recommendations-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <Header />
      <main className="app-main">
        <SearchBlock onSearch={handleSearch} />
        <CategoriesBlock 
          onSelectCategory={handleSelectCategory} 
          selectedCategory={selectedCategory} 
        />
        <RecommendationsBlock 
          selectedCategory={selectedCategory} 
          onClearFilter={() => setSelectedCategory(null)}
          searchParams={searchParams}
          onClearSearch={() => setSearchParams(null)}
        />
      </main>
      <Footer />
    </>
  );
};

export default Home;
