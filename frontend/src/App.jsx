import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Administration from './pages/Administration';
import Register from './pages/Register';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import BookingForm from './pages/BookingForm';
import UserBookings from './pages/UserBookings';
import WhatsAppWidget from './components/WhatsAppWidget';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/administracion" element={<Administration />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/producto/:id/reserva" element={<BookingForm />} />
        <Route path="/mis-reservas" element={<UserBookings />} />
      </Routes>
      <WhatsAppWidget />
    </BrowserRouter>
  );
}

export default App;
