import axios from 'axios';

const apiClient = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api/music`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Servis za muzičke operacije
 */
const musicService = {
  /**
   * Dohvatanje albuma
   * @param {string} query
   * @returns {Promise}
   */
  getAlbums: async (query = '') => {
    try {
      const response = await apiClient.get('/albums', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju albuma:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Dohvatanje izvođača
   * @param {string} query
   * @returns {Promise}
   */
  getArtists: async (query = '') => {
    try {
      const response = await apiClient.get('/artists', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju izvođača:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Dodavanje like-a ili ratinga
   * @param {Object} data
   * @returns {Promise}
   */
  addLike: async (data) => {
    try {
      const response = await apiClient.post('/like', data);
      return response.data;
    } catch (error) {
      console.error('Greška pri dodavanju like-a:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Dohvatanje ID-a albuma ili izvođača iz baze
   * @param {string} type
   * @param {string} name
   * @param {string} artist
   * @returns {Promise}
   */
  getItemId: async (type, name, artist = '') => {
    try {
      const response = await apiClient.get(`/${type}s`, { params: { query: name } });
      const items = Array.isArray(response.data) 
        ? response.data 
        : response.data.results?.[`${type}matches`]?.[type] || [];
      const item = items.find(i => i.name === name && (!artist || i.artist === artist));
      if (!item) throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} nije pronađen u bazi`);
      return item;
    } catch (error) {
      console.error(`Greška pri dohvatanju ID-a za ${type}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Dohvatanje preporuka
   * @returns {Promise}
   */
  getRecommendations: async () => {
    try {
      const response = await apiClient.get('/recommendations');
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju preporuka:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default musicService;