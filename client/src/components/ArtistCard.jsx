import { FaStar } from 'react-icons/fa';
import RatingStars from './RatingStars';

/**
 * Kartica za izvođača s animacijama
 * @param {Object} props
 * @returns {JSX.Element}
 */
function ArtistCard({ artist, onLike }) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <img
        src={artist.image || '/src/assets/default-avatar.jpg'}
        alt={artist.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{artist.name}</h3>
        <p className="text-sm text-gray-400">Genres: {artist.genres?.join(', ') || 'N/A'}</p>
        <RatingStars rating={artist.rating} onRate={(rating) => onLike(artist.id, rating)} />
      </div>
    </div>
  );
}

export default ArtistCard;