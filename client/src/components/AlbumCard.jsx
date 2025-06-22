import { FaStar } from 'react-icons/fa';
import RatingStars from './RatingStars';

/**
 * Kartica za album s animacijama
 * @param {Object} props
 * @returns {JSX.Element}
 */
function AlbumCard({ album, onLike }) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <img
        src={album.coverArt || '/src/assets/default-avatar.jpg'}
        alt={album.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{album.name}</h3>
        <p className="text-sm text-gray-400">Genres: {album.genres?.join(', ') || 'N/A'}</p>
        <p className="text-sm text-gray-400">Year: {album.year || 'N/A'}</p>
        <RatingStars rating={album.rating} onRate={(rating) => onLike(album.id, rating)} />
      </div>
    </div>
  );
}

export default AlbumCard;