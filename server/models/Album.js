// models/Album.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/*
  Definisanje modela za albume
*/
const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genres: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  coverArt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'albums',
  indexes: [
    {
      unique: true,
      fields: ['name', 'artist'],
    },
  ],
});

export default Album;