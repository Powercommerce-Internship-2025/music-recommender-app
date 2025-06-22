import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Album from './Album.js';
import Artist from './Artist.js';

/*
  Definisanje modela za preference (like/rating)
*/

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true, // Ocjena od 1 do 5, null ako je samo "like"
    validate: {
      min: 1,
      max: 5,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  albumId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Može biti null ako je like za izvođača
    references: {
      model: 'albums',
      key: 'id',
    },
  },
  artistId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Može biti null ako je like za album
    references: {
      model: 'artists',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'likes',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'albumId'], // Osigurava da korisnik može lajkati album samo jednom
    },
    {
      unique: true,
      fields: ['userId', 'artistId'], // Osigurava da korisnik može lajkati izvođača samo jednom
    },
  ],
});

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Album, { foreignKey: 'albumId' });
Like.belongsTo(Artist, { foreignKey: 'artistId' });
User.hasMany(Like, { foreignKey: 'userId' });
Album.hasMany(Like, { foreignKey: 'albumId' });
Artist.hasMany(Like, { foreignKey: 'artistId' });

export default Like;