import axios from 'axios';

const apiClient = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api/users`,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
 * Servis za operacije vezane za korisnika
 */
const userService = {
  /**
   * Dohvatanje profila trenutnog korisnika
   * @returns {Promise}
   */
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  /**
   * Ažuriranje profila korisnika
   * @param {Object} profileData
   * @returns {Promise}
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/profile', profileData);
    return response.data;
  },

  /**
   * Ažuriranje lozinke korisnika
   * @param {Object} passwordData
   * @returns {Promise}
   */
  updatePassword: async (passwordData) => {
    const response = await apiClient.put('/password', passwordData);
    return response.data;
  },

  getDashboardData: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },
};

export default userService;