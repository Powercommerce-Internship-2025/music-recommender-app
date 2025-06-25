import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import authService from '../services/authService';
import musicService from '../services/musicService';
import { FaStar } from 'react-icons/fa';

function Recommendations() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const data = await musicService.getRecommendations();
        setAlbums(data.recommendedAlbums || []);
        setArtists(data.recommendedArtists || []);
        if (data.message) {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('Could not load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate]);

  const handleLike = async (id, rating, type) => {
    try {
      await musicService.addLike({ [type === 'album' ? 'albumId' : 'artistId']: id, rating });
      if (type === 'album') {
        setAlbums(prev => prev.filter(item => item.id !== id));
      } else {
        setArtists(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Greška pri lajkovanju preporuke:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col">
      <Navbar />
      <div className="pt-20 w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Your Recommendations</h2>

        {loading ? (
          <p className="text-center text-gray-400">Generating recommendations for you...</p>
        ) : (
          <>
            {message && (
              <div className="text-center bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
                <FaStar className="text-yellow-400 text-3xl mx-auto mb-4" />
                <p className="text-lg">{message}</p>
              </div>
            )}

            {albums.length > 0 && (
              <div className="space-y-8 mt-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Recommended Albums</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {albums.map((album) => (
                      <AlbumCard key={album.id} album={album} onLike={(rating) => handleLike(album.id, rating, 'album')} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {artists.length > 0 && (
              <div className="space-y-8 mt-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Recommended Artists</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {artists.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} onLike={(rating) => handleLike(artist.id, rating, 'artist')} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Recommendations;