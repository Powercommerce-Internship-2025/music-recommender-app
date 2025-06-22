// server/services/lastfmService.js

import axios from 'axios';
import md5 from 'md5';
import NodeCache from 'node-cache';

const API_KEY = 'a5babe878f8b1dca720296a59db314bb';
const SHARED_SECRET = '2f44ce8f0bfcee046de866874b3341f1';
const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

const apiCache = new NodeCache({ stdTTL: 3600 });

/*
  Servis za integraciju s Last.fm API-jem
*/

const lastfmService = {
  /**
   * Funkcija za pozivanje API-ja sa keširanjem
   * @param {Object} params
   * @returns {Promise}
   */
  callApi: async (params) => {
    const cacheKey = JSON.stringify(params);

    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Vraćanje podataka iz keša za ključ: ${cacheKey}`);
      return cachedData;
    }

    console.log(`Podaci nisu u kešu, pozivanje API-ja za ključ: ${cacheKey}`);
    const response = await axios.get(BASE_URL, { params });

    apiCache.set(cacheKey, response.data);

    return response.data;
  },

  /**
   * Pretraga albuma
   * @param {string} query
   * @returns {Promise}
   */
  searchAlbums: async (query) => {
    if (!query) return [];
    try {
      const params = {
        method: 'album.search',
        api_key: API_KEY,
        album: query,
        format: 'json',
      };
      return await lastfmService.callApi(params);
    } catch (error) {
      console.error('Greška pri pretrazi albuma:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Pretraga izvođača
   * @param {string} query
   * @returns {Promise}
   */
  searchArtists: async (query) => {
    if (!query) return [];
    try {
      const params = {
        method: 'artist.search',
        api_key: API_KEY,
        artist: query,
        format: 'json',
      };
      return await lastfmService.callApi(params);
    } catch (error) {
      console.error('Greška pri pretrazi izvođača:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default lastfmService;