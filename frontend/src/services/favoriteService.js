const API_BASE_URL = 'http://localhost:8080/api';

export const favoriteService = {
  async getFavorites(token) {
    if (!token) return [];
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Error al cargar favoritos');
    }
    return await response.json();
  },

  async addFavorite(productId, token) {
    const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Error al agregar a favoritos');
    }
    return await response.json();
  },

  async removeFavorite(productId, token) {
    const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Error al eliminar de favoritos');
    }
  },

  async isFavorite(productId, token) {
    if (!token) return false;
    const response = await fetch(`${API_BASE_URL}/favorites/check/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) return false;
    const data = await response.json();
    return !!data.isFavorite;
  }
};
