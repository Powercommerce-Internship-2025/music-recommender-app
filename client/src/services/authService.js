import axios from 'axios';

// Kreiramo axios instancu s baznim URL-om
const apiClient = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_API_PORT || 3000}/api/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor za dodavanje tokena u zaglavlja
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Servis za autentikaciju korisnika
 */
const authService = {
  /**
   * Registracija novog korisnika
   * @param {Object} userData - Podaci korisnika (username, email, password)
   * @returns {Promise} Promise s podacima o korisniku
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Greška pri registraciji:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Prijava korisnika
   * @param {Object} userData - Podaci za prijavu (email, password)
   * @returns {Promise} Promise s podacima o korisniku i tokenom
   */
  login: async (userData) => {
    try {
      const response = await apiClient.post('/login', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Greška pri prijavi:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Odjava korisnika
   * @returns {Promise} Promise koji se razrješava nakon odjave
   */
  logout: async () => {
    try {
      await apiClient.post('/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Greška pri odjavi:', error.response?.data || error.message);
      // Svejedno uklanjamo token iz lokalnog spremišta
      localStorage.removeItem('token');
      throw error;
    }
  },

  /**
   * Provjera je li korisnik prijavljen
   * @returns {Boolean} True ako je korisnik prijavljen
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
export const { register, login, logout } = authService;