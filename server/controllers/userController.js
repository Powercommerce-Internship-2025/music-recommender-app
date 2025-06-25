import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Album, Like, User, Artist } from '../models/index.js';
import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';

dotenv.config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User created', user: { id: user.id, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'The user does not exist' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Odjavljen' });
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const likes = await Like.findAll({
      where: { userId },
      include: [
        { model: Album, attributes: ['id', 'name', 'artist', 'coverArt', 'year'] },
        { model: Artist, attributes: ['id', 'name', 'genres'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ user, likes });
  } catch (error) {
    console.error('Greška pri dohvatanju profila:', error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email or username already exists.' });
    }
    console.error('Greška pri ažuriranju profila:', error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'The current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password successfully changed.' });
  } catch (error) {
    console.error('Greška pri promjeni lozinke:', error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

/**
 * Dohvata sve podatke potrebne za personalizovani dashboard.
 */
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const RATING_THRESHOLD = 4;

    const user = await User.findByPk(userId, { attributes: ['username'] });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userLikes = await Like.findAll({ where: { userId } });
    const likedAlbumIds = userLikes.filter(l => l.albumId).map(l => l.albumId);
    const likedArtistIds = userLikes.filter(l => l.artistId).map(l => l.artistId);

    const stats = {
      ratedAlbums: likedAlbumIds.length,
      ratedArtists: likedArtistIds.length,
    };

    const highRatedLikes = userLikes.filter(l => l.rating >= RATING_THRESHOLD);
    let recommendedAlbums = [];
    let recommendedArtists = [];

    if (highRatedLikes.length > 0) {
      const favoriteGenres = new Set();
      const highRatedAlbumIds = highRatedLikes.filter(l => l.albumId).map(l => l.albumId);
      const highRatedArtistIds = highRatedLikes.filter(l => l.artistId).map(l => l.artistId);

      const likedAlbums = await Album.findAll({ where: { id: { [Op.in]: highRatedAlbumIds } } });
      const likedArtists = await Artist.findAll({ where: { id: { [Op.in]: highRatedArtistIds } } });
      
      likedAlbums.forEach(a => a.genres.forEach(g => favoriteGenres.add(g)));
      likedArtists.forEach(a => a.genres.forEach(g => favoriteGenres.add(g)));

      if (favoriteGenres.size > 0) {
        recommendedAlbums = await Album.findAll({
          where: { id: { [Op.notIn]: likedAlbumIds }, genres: { [Op.overlap]: [...favoriteGenres] } },
          limit: 4,
          order: Sequelize.literal('RANDOM()'),
        });
        recommendedArtists = await Artist.findAll({
          where: { id: { [Op.notIn]: likedArtistIds }, genres: { [Op.overlap]: [...favoriteGenres] } },
          limit: 4,
          order: Sequelize.literal('RANDOM()'),
        });
      }
    }

    const forYouToRate = await Album.findAll({
      where: { id: { [Op.notIn]: likedAlbumIds } },
      limit: 4,
      order: Sequelize.literal('RANDOM()'),
    });

    res.json({
      username: user.username,
      stats,
      recommendations: {
        albums: recommendedAlbums,
        artists: recommendedArtists,
      },
      forYouToRate,
    });

  } catch (error) {
    console.error('Greška pri dohvatanju dashboard podataka:', error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export { register, login, logout, getProfile, updateProfile, updatePassword, getDashboardData };