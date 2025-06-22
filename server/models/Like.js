// models/Like.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


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
    allowNull: true,
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
    allowNull: true,
    references: {
      model: 'albums',
      key: 'id',
    },
  },
  artistId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
      fields: ['userId', 'albumId', 'artistId'],
    },
  ],
});

export default Like;