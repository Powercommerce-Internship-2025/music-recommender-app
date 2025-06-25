import { Op, Sequelize } from 'sequelize';
import { Album, Like, User, Artist } from '../models/index.js';
import lastfmService from '../services/lastfmService.js';

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map(t => t.name);
  }
  if (typeof tags === 'object' && tags.name) {
    return [tags.name];
  }
  return [];
};

const getAlbums = async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const result = await lastfmService.searchAlbums(query);
      const albumsFromApi = result.results?.albummatches?.album || [];
      
      const albumPromises = albumsFromApi.map(async (albumApi) => {
        if (!albumApi.name || !albumApi.artist) return null;

        const albumInfo = await lastfmService.getAlbumInfo(albumApi.artist, albumApi.name);
        
        let genres = parseTags(albumInfo?.album?.tags?.tag);

        if (genres.length === 0) {
          const artistInfo = await lastfmService.getArtistInfo(albumApi.artist);
          genres = parseTags(artistInfo?.artist?.tags?.tag);
        }

        const description = albumInfo?.album?.wiki?.summary?.replace(/<a.*<\/a>/, '').trim() || null;
        const publishedDate = albumInfo?.album?.wiki?.published;
        const year = publishedDate ? new Date(publishedDate).getFullYear() : null;

        const [albumDb, created] = await Album.findOrCreate({
          where: { name: albumApi.name, artist: albumApi.artist },
          defaults: {
            name: albumApi.name,
            artist: albumApi.artist,
            coverArt: albumApi.image?.find(img => img.size === 'large')?.['#text'] || '',
            genres,
            description,
            year,
          },
        });

        if (!created && (!albumDb.description || albumDb.genres.length === 0)) {
          await albumDb.update({
            description: albumDb.description || description,
            genres: albumDb.genres.length === 0 ? genres : albumDb.genres,
            year: albumDb.year || year,
          });
        }
        
        return albumDb.reload();
      });
      
      const dbAlbums = (await Promise.all(albumPromises)).filter(Boolean);
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

const getArtists = async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const result = await lastfmService.searchArtists(query);
      const artistsFromApi = result.results?.artistmatches?.artist || [];
      
      const dbArtists = await Promise.all(artistsFromApi.map(async (artistApi) => {
        const artistInfo = await lastfmService.getArtistInfo(artistApi.name);
        const genres = parseTags(artistInfo?.artist?.tags?.tag);
        const description = artistInfo?.artist?.bio?.summary?.replace(/<a.*<\/a>/, '').trim() || null;

        const [artistDb, created] = await Artist.findOrCreate({
          where: { name: artistApi.name },
          defaults: {
            name: artistApi.name,
            genres,
            description,
          },
        });

        if (!created && (artistDb.genres.length === 0 || !artistDb.description)) {
            await artistDb.update({
                genres: artistDb.genres.length === 0 ? genres : artistDb.genres,
                description: artistDb.description || description,
            });
        }

        return {
          ...artistApi,
          id: artistDb.id,
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

const addLike = async (req, res) => {
  try {
    const { albumId, artistId, rating } = req.body;
    const userId = req.user.id;

    if (!albumId && !artistId) {
      return res.status(400).json({ error: 'Morate navesti albumId ili artistId' });
    }

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
    
    const whereClause = { userId };
    if (albumId) whereClause.albumId = albumId;
    if (artistId) whereClause.artistId = artistId;
    
    const like = await Like.findOne({ where: whereClause });

    if (like) {
      await like.update({ rating });
       res.status(200).json({ message: 'Like ažuriran', like });
    } else {
      const newLike = await Like.create(likeData);
      res.status(201).json({ message: 'Like dodan', like: newLike });
    }

  } catch (error) {
    console.error('Greška pri dodavanju like-a:', error);
    res.status(500).json({ error: 'Greška pri dodavanju like-a' });
  }
};

/*
  Generisanje preporuka za korisnika
*/
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const RATING_THRESHOLD = 4;
    const RECOMMENDATION_LIMIT = 10;

    const userLikes = await Like.findAll({
      where: {
        userId,
        rating: { [Op.gte]: RATING_THRESHOLD },
      },
    });

    if (userLikes.length === 0) {
      return res.json({
        recommendedAlbums: [],
        recommendedArtists: [],
        message: 'Rate more items with 4 or 5 stars to get recommendations.',
      });
    }

    const likedAlbumIds = userLikes.filter(l => l.albumId).map(l => l.albumId);
    const likedArtistIds = userLikes.filter(l => l.artistId).map(l => l.artistId);

    const likedAlbums = await Album.findAll({ where: { id: { [Op.in]: likedAlbumIds } } });
    const likedArtists = await Artist.findAll({ where: { id: { [Op.in]: likedArtistIds } } });

    const favoriteGenres = new Set([
      ...likedAlbums.flatMap(a => a.genres),
      ...likedArtists.flatMap(a => a.genres),
    ]);
    
    const favoriteGenresArray = [...favoriteGenres];

    if (favoriteGenresArray.length === 0) {
        return res.json({ recommendedAlbums: [], recommendedArtists: [], message: 'We could not determine your favorite genres.' });
    }

    const recommendedAlbums = await Album.findAll({
      where: {
        id: { [Op.notIn]: likedAlbumIds },
        genres: { [Op.overlap]: favoriteGenresArray },
      },
      limit: RECOMMENDATION_LIMIT,
      order: Sequelize.literal('RANDOM()'),
    });

    const recommendedArtists = await Artist.findAll({
      where: {
        id: { [Op.notIn]: likedArtistIds },
        genres: { [Op.overlap]: favoriteGenresArray },
      },
      limit: RECOMMENDATION_LIMIT,
      order: Sequelize.literal('RANDOM()'),
    });

    res.json({ recommendedAlbums, recommendedArtists });

  } catch (error) {
    console.error('Greška pri generisanju preporuka:', error);
    res.status(500).json({ error: 'Greška pri generisanju preporuka' });
  }
};

export default { getAlbums, getArtists, addLike, getRecommendations };