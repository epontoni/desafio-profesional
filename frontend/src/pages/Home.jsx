import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBlock from '../components/SearchBlock';
import CategoriesBlock from '../components/CategoriesBlock';
import RecommendationsBlock from '../components/RecommendationsBlock';
import Footer from '../components/Footer';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (categoryTitle) => {
    setSelectedCategory(categoryTitle);
    
    // Scroll down to recommendations list on category selection
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
        <SearchBlock />
        <CategoriesBlock 
          onSelectCategory={handleSelectCategory} 
          selectedCategory={selectedCategory} 
        />
        <RecommendationsBlock 
          selectedCategory={selectedCategory} 
          onClearFilter={() => setSelectedCategory(null)} 
        />
      </main>
      <Footer />
    </>
  );
};

export default Home;
