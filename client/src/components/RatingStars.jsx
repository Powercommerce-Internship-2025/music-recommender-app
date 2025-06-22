import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

/**
 * Kompaktna komponenta za ocjenjivanje
 * @param {Object} props
 * @returns {JSX.Element}
 */
function RatingStars({ rating = 0, onRate }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex mt-2 space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`cursor-pointer w-5 h-5 ${
              ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-400'
            }`}
            onClick={() => onRate(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
}

export default RatingStars;