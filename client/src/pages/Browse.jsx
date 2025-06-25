import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import SkeletonCard from '../components/SkeletonCard';
import authService from '../services/authService';
import musicService from '../services/musicService';

function Browse() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastAlbumSearch, setLastAlbumSearch] = useState('');
  const [lastArtistSearch, setLastArtistSearch] = useState('');
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const sortItems = (items, option) => {
    if (!items) return [];
    const [field, direction] = option.split('-');
    return [...items].sort((a, b) => {
      const valueA = a[field]?.toLowerCase() || '';
      const valueB = b[field]?.toLowerCase() || '';
      return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  };

  useEffect(() => {
    setAlbums(prev => sortItems(prev, sortOption));
    setArtists(prev => sortItems(prev, sortOption));
  }, [sortOption]);

  useEffect(() => {
    if (!lastAlbumSearch) return;
    const fetchAlbums = async () => {
      setLoadingAlbums(true);
      try {
        const data = await musicService.getAlbums(lastAlbumSearch);
        setAlbums(sortItems(data, sortOption));
      } catch (err) {
        toast.error('Greška pri dohvatanju albuma.');
      } finally {
        setLoadingAlbums(false);
      }
    };
    fetchAlbums();
  }, [lastAlbumSearch, sortOption]);

  useEffect(() => {
    if (!lastArtistSearch) return;
    const fetchArtists = async () => {
      setLoadingArtists(true);
      try {
        const data = await musicService.getArtists(lastArtistSearch);
        setArtists(sortItems(data, sortOption));
      } catch (err) {
        toast.error('Greška pri dohvatanju izvođača.');
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, [lastArtistSearch, sortOption]);

  const handleLike = async (id, rating, type) => {
    try {
      const likeData = type === 'album' ? { albumId: id, rating } : { artistId: id, rating };
      await musicService.addLike(likeData);
      toast.success('Ocjena sačuvana!');
      
      const updateState = (items) => items.map(item => item.id === id ? { ...item, rating } : item);
      if (type === 'album') setAlbums(updateState);
      else setArtists(updateState);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Greška pri dodavanju ocjene.';
      toast.error(errorMessage);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      toast.error("Unesite pojam za pretragu.");
      return;
    }
    if (activeTab === 'albums' || activeTab === 'all') {
      setLastAlbumSearch(searchQuery);
    }
    if (activeTab === 'artists' || activeTab === 'all') {
      setLastArtistSearch(searchQuery);
    }
  };

  const renderSkeletons = (count = 5) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <h2 className="text-4xl font-bold mb-6 text-center">Explore Music</h2>

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
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-400">
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

      <div className="space-y-12">
        {(activeTab === 'all' || activeTab === 'albums') && (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Albums</h3>
            {loadingAlbums ? renderSkeletons() : 
              albums.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {albums.map((album) => <AlbumCard key={album.id} album={album} onLike={(r) => handleLike(album.id, r, 'album')} />)}
                </div>
              ) : <p className="text-center text-gray-400">No albums to display. Enter a search term and press Enter.</p>
            }
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'artists') && (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Artists</h3>
            {loadingArtists ? renderSkeletons() :
              artists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {artists.map((artist) => <ArtistCard key={artist.id} artist={artist} onLike={(r) => handleLike(artist.id, r, 'artist')} />)}
                </div>
              ) : <p className="text-center text-gray-400">No artists to display. Enter a search term and press Enter.</p>
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;