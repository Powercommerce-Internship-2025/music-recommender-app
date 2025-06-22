import axios from 'axios';
import md5 from 'md5';

const API_KEY = 'a5babe878f8b1dca720296a59db314bb';
const SHARED_SECRET = '2f44ce8f0bfcee046de866874b3341f1';
const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

/*
  Servis za integraciju s Last.fm API-jem
*/

const lastfmService = {
  /**
   * Dohvatanje informacija o albumu
   * @param {string} artist
   * @param {string} album
   * @returns {Promise} Podaci o albumu
   */
  getAlbumInfo: async (artist, album) => {
    try {
      const params = {
        method: 'album.getInfo',
        api_key: API_KEY,
        artist,
        album,
        format: 'json',
      };

      const response = await axios.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju albuma:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Dohvatanje informacija o izvođaču
   * @param {string} artist
   * @returns {Promise} Podaci o izvođaču
   */
  getArtistInfo: async (artist) => {
    try {
      const params = {
        method: 'artist.getInfo',
        api_key: API_KEY,
        artist,
        format: 'json',
      };

      const response = await axios.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju izvođača:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Pretraga albuma
   * @param {string} query
   * @returns {Promise} Lista albuma
   */
  searchAlbums: async (query) => {
    try {
      const params = {
        method: 'album.search',
        api_key: API_KEY,
        album: query,
        format: 'json',
      };

      const response = await axios.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Greška pri pretrazi albuma:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Pretraga izvođača
   * @param {string} query
   * @returns {Promise} Lista izvođača
   */
  searchArtists: async (query) => {
    try {
      const params = {
        method: 'artist.search',
        api_key: API_KEY,
        artist: query,
        format: 'json',
      };

      const response = await axios.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Greška pri pretrazi izvođača:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default lastfmService;