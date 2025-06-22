// server/controllers/musicController.js
import { Op } from 'sequelize';
import { Album, Like, User, Artist } from '../models/index.js';
import lastfmService from '../services/lastfmService.js';

/*
  Dohvatanje svih albuma iz baze ili Last.fm
*/
const getAlbums = async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const result = await lastfmService.searchAlbums(query);
      const albumsFromApi = Array.isArray(result) ? result : result.results?.albummatches?.album || [];
      
      const dbAlbums = await Promise.all(albumsFromApi.map(async (albumApi) => {
        const [albumDb] = await Album.findOrCreate({
          where: { name: albumApi.name, artist: albumApi.artist },
          defaults: {
            name: albumApi.name,
            artist: albumApi.artist,
            coverArt: albumApi.image?.find(img => img.size === 'large')?.['#text'] || '',
            // Ostala polja će biti default ili null
            genres: [],
          },
        });
        
        // Vraćamo kombinaciju podataka iz baze (ID) i sa API-ja (slike, itd.)
        return {
          ...albumApi, // Zadržavamo originalne podatke sa API-ja
          id: albumDb.id, // Dodajemo ID iz naše baze
          coverArt: albumDb.coverArt,
          genres: albumDb.genres,
          year: albumDb.year,
          description: albumDb.description,
        };
      }));
      
      res.json(dbAlbums);
    } else {
      const albums = await Album.findAll();
      res.json(albums);
    }
  } catch (error) {
    console.error('Greška pri dohvatanju albuma:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju albuma' });
  }
};

/*
  Dohvatanje svih izvođača iz baze ili Last.fm
*/
const getArtists = async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const result = await lastfmService.searchArtists(query);
      const artistsFromApi = Array.isArray(result) ? result : result.results?.artistmatches?.artist || [];
      
      const dbArtists = await Promise.all(artistsFromApi.map(async (artistApi) => {
        const [artistDb] = await Artist.findOrCreate({
          where: { name: artistApi.name },
          defaults: {
            name: artistApi.name,
            genres: [],
          },
        });
        
        return {
          ...artistApi,
          id: artistDb.id, // Dodajemo ID iz naše baze
          image: artistApi.image?.find(img => img.size === 'large')?.['#text'] || '',
          genres: artistDb.genres,
          description: artistDb.description,
        };
      }));

      res.json(dbArtists);
    } else {
      const artists = await Artist.findAll();
      res.json(artists);
    }
  } catch (error) {
    console.error('Greška pri dohvatanju izvođača:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju izvođača' });
  }
};

/*
  Lajkanje ili ocjenjivanje albuma/izvođača
*/
const addLike = async (req, res) => {
  try {
    const { albumId, artistId, rating } = req.body;
    const userId = req.user.id;

    if (!albumId && !artistId) {
      return res.status(400).json({ error: 'Morate navesti albumId ili artistId' });
    }

    // Provjeri da li album ili izvođač postoje u bazi
    if (albumId) {
      const album = await Album.findOne({ where: { id: albumId } });
      if (!album) return res.status(404).json({ error: 'Album nije pronađen' });
    }
    if (artistId) {
      const artist = await Artist.findOne({ where: { id: artistId } });
      if (!artist) return res.status(404).json({ error: 'Izvođač nije pronađen' });
    }

    const likeData = { userId, rating };
    if (albumId) likeData.albumId = albumId;
    if (artistId) likeData.artistId = artistId;
    
    // Ispravka za unique constraint
    const whereClause = { userId };
    if (albumId) whereClause.albumId = albumId;
    if (artistId) whereClause.artistId = artistId;
    
    const like = await Like.findOne({ where: whereClause });

    if (like) {
      // Ako like postoji, ažuriraj rating
      await like.update({ rating });
       res.status(200).json({ message: 'Like ažuriran', like });
    } else {
      // Ako ne postoji, kreiraj novi
      const newLike = await Like.create(likeData);
      res.status(201).json({ message: 'Like dodan', like: newLike });
    }

  } catch (error) {
    console.error('Greška pri dodavanju like-a:', error);
    res.status(500).json({ error: 'Greška pri dodavanju like-a' });
  }
};

export default { getAlbums, getArtists, addLike };