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

  return (
    <div className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${isJustRated ? 'animate-pop' : ''}`}>
      <img
        src={album.coverArt || '/src/assets/default-avatar.jpg'}
        alt={album.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{album.name}</h3>
        <p className="text-sm text-gray-400">Artist: {album.artist || 'N/A'}</p>
        <p className="text-sm text-gray-400">Year: {album.year || 'N/A'}</p>
        {/* handleRate funkciju */}
        <RatingStars rating={album.rating} onRate={handleRate} />
      </div>
    </div>
  );
}

export default AlbumCard;