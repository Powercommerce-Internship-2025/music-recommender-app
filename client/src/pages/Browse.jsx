import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import authService from '../services/authService';
import musicService from '../services/musicService';

/**
 * Browse stranica
 * @returns {JSX.Element} Katalog albuma i izvođača
 */
function Browse() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const albumData = await musicService.getAlbums(searchQuery);
      const artistData = await musicService.getArtists(searchQuery);
      let fetchedAlbums = albumData.results?.albummatches?.album || albumData;
      let fetchedArtists = artistData.results?.artistmatches?.artist || artistData;

      fetchedAlbums = sortItems(fetchedAlbums, sortOption);
      fetchedArtists = sortItems(fetchedArtists, sortOption);

      setAlbums(fetchedAlbums);
      setArtists(fetchedArtists);
    } catch (error) {
      console.error('Greška pri dohvatanju podataka:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortItems = (items, option) => {
    const [field, direction] = option.split('-');
    return [...items].sort((a, b) => {
      const valueA = a[field] || '';
      const valueB = b[field] || '';
      if (direction === 'asc') {
        return valueA.localeCompare(valueB);
      }
      return valueB.localeCompare(valueA);
    });
  };

  const handleLike = async (id, rating, isAlbum = true) => {
    try {
      await musicService.addLike({ [isAlbum ? 'albumId' : 'artistId']: id, rating });
      fetchData();
    } catch (error) {
      console.error('Greška pri dodavanju like-a:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col">
      <Navbar />
      <div className="pt-20 w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Explore Music</h2>

        {/* Pretraga i sortiranje */}
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
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            {/* Popularnost može biti dodana kasnije s Last.fm podacima */}
          </select>
        </div>

        {/* Tabovi */}
        <div className="flex space-x-2 mb-6 border-b border-gray-700">
          {['all', 'albums', 'artists'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
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
                  {albums.map((album, index) => (
                    <AlbumCard
                      key={`${album.mbid || album.name}-${index}`}
                      album={{
                        id: album.mbid || album.name,
                        name: album.name,
                        genres: [],
                        coverArt: album.image?.find((img) => img.size === 'large')?.['#text'],
                        year: null,
                        description: null,
                        rating: 0,
                      }}
                      onLike={(rating) => handleLike(album.mbid || album.name, rating, true)}
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
                  {artists.map((artist, index) => (
                    <ArtistCard
                      key={`${artist.mbid || artist.name}-${index}`}
                      artist={{
                        id: artist.mbid || artist.name,
                        name: artist.name,
                        genres: [],
                        image: artist.image?.find((img) => img.size === 'large')?.['#text'],
                        description: null,
                        rating: 0,
                      }}
                      onLike={(rating) => handleLike(artist.mbid || artist.name, rating, false)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;