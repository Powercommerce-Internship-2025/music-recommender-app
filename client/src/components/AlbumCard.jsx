import { useState } from 'react';
import RatingStars from './RatingStars';

function AlbumCard({ album, onLike }) {
  const [isJustRated, setIsJustRated] = useState(false);

  const handleRate = (rating) => {
    onLike(rating);
    setIsJustRated(true);
    setTimeout(() => {
      setIsJustRated(false);
    }, 500);
  };
  const truncateText = (text, length = 50) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <div className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${isJustRated ? 'animate-pop' : ''}`}>
      <img
        src={album.coverArt || '/src/assets/default-avatar.jpg'}
        alt={album.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white truncate" title={album.name}>{album.name}</h3>
        <p className="text-sm text-gray-400">Artist: {album.artist || 'N/A'}</p>
        <p className="text-sm text-gray-400">Year: {album.year || 'N/A'}</p>
        <p className="text-sm text-gray-400 truncate" title={album.genres?.join(', ')}>
          Genre: {album.genres?.join(', ') || 'N/A'}
        </p>
        <div className="flex-grow mt-2">
          <p className="text-xs text-gray-500" title={album.description}>
            {truncateText(album.description) || 'No description available.'}
          </p>
        </div>
        <div className="mt-auto pt-2">
          <RatingStars rating={album.rating} onRate={handleRate} />
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;