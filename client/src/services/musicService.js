import axios from 'axios';

const apiClient = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api/music`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor za dodavanje tokena
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
};

export default musicService;