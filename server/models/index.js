import Album from './Album.js';
import Like from './Like.js';
import User from './User.js';
import Artist from './Artist.js';

Album.hasMany(Like, { foreignKey: 'albumId' });
Like.belongsTo(Album, { foreignKey: 'albumId' });

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

Artist.hasMany(Like, { foreignKey: 'artistId' });
Like.belongsTo(Artist, { foreignKey: 'artistId' });

export { Album, Like, User, Artist };
