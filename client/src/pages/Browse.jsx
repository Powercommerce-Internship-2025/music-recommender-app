import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import authService from '../services/authService';
import musicService from '../services/musicService';

function Browse() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
    fetchData();
  }, [navigate, sortOption]);

  const fetchData = async (query = searchQuery) => {
    setLoading(true);
    setError('');
    try {
      const albumData = await musicService.getAlbums(query);
      const artistData = await musicService.getArtists(query);
      
      setAlbums(sortItems(albumData, sortOption));
      setArtists(sortItems(artistData, sortOption));

    } catch (error) {
      console.error('Greška pri dohvatanju podataka:', error);
      setError('Ne možemo učitati podatke. Pokušajte ponovo kasnije.');
    } finally {
      setLoading(false);
    }
  };

  const sortItems = (items, option) => {
    const [field, direction] = option.split('-');
    return [...items].sort((a, b) => {
      const valueA = a[field]?.toLowerCase() || '';
      const valueB = b[field]?.toLowerCase() || '';
      if (direction === 'asc') {
        return valueA.localeCompare(valueB);
      }
      return valueB.localeCompare(valueA);
    });
  };
  
  const handleLike = async (id, rating, type) => {
    try {
      const likeData = type === 'album' ? { albumId: id, rating } : { artistId: id, rating };
      await musicService.addLike(likeData);
      
      if (type === 'album') {
        setAlbums(prevAlbums => 
          prevAlbums.map(album => 
            album.id === id ? { ...album, rating: rating } : album
          )
        );
      } else {
        setArtists(prevArtists => 
          prevArtists.map(artist => 
            artist.id === id ? { ...artist, rating: rating } : artist
          )
        );
      }

    } catch (error) {
      console.error('Greška pri dodavanju like-a:', error);
      const errorMessage = error.response?.data?.error || 'Greška pri dodavanju ocjene.';
      setError(errorMessage);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col">
      <Navbar />
      <div className="pt-20 w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Explore Music</h2>

        {error && <p className="text-red-300 mb-4 text-center">{error}</p>}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-grow">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search albums or artists..."
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          <select value={sortOption} onChange={handleSortChange} className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-400">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>

        <div className="flex space-x-2 mb-6 border-b border-gray-700">
          {['all', 'albums', 'artists'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

         {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-12">
            {/* Albumi */}
            {(activeTab === 'all' || activeTab === 'albums') && albums.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Albums</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {albums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      onLike={(rating) => handleLike(album.id, rating, 'album')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Izvođači */}
            {(activeTab === 'all' || activeTab === 'artists') && artists.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Artists</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {artists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      onLike={(rating) => handleLike(artist.id, rating, 'artist')}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Prazan prikaz */}
            {!loading && activeTab === 'albums' && albums.length === 0 && (
              <p className="text-center text-gray-400">Nema albuma za prikaz.</p>
            )}
            {!loading && activeTab === 'artists' && artists.length === 0 && (
              <p className="text-center text-gray-400">Nema izvođača za prikaz.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;