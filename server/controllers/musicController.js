import Op from 'sequelize';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import Like from '../models/Like.js';
import lastfmService from '../services/lastfmService.js';

/*
  Dohvatanje svih albuma iz baze ili Last.fm
*/
const getAlbums = async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const result = await lastfmService.searchAlbums(query);
      res.json(result);
    } else {
      const albums = await Album.findAll();
      res.json(albums);
    }
  } catch (error) {
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
      res.json(result);
    } else {
      const artists = await Artist.findAll();
      res.json(artists);
    }
  } catch (error) {
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

    const likeData = { userId, rating };
    if (albumId) likeData.albumId = albumId;
    if (artistId) likeData.artistId = artistId;

    const [like, created] = await Like.findOrCreate({
      where: { userId, albumId: albumId || null, artistId: artistId || null },
      defaults: likeData,
    });

    if (!created) {
      await like.update({ rating });
    }

    res.status(201).json({ message: 'Like dodan', like });
  } catch (error) {
    res.status(500).json({ error: 'Greška pri dodavanju like-a' });
  }
};

export default { getAlbums, getArtists, addLike, };