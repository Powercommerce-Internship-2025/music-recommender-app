import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import userService from '../services/userService';
import authService from '../services/authService';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import SkeletonCard from '../components/SkeletonCard';
import { FaMusic, FaStar, FaSearch, FaRegThumbsUp } from 'react-icons/fa';

/**
 * Komponenta za prikaz statistike na dashboardu.
 */
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white/10 p-4 rounded-xl flex items-center space-x-4">
    <div className="text-blue-400 bg-gray-900 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

/**
 * Redizajnirana stranica sa kontrolnom tablom.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await userService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        toast.error("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-12 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <p className="text-center">Error loading data. Please try again.</p>;
  }

  const { username, stats, recommendations, forYouToRate } = dashboardData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-4xl md:text-5xl font-bold animate-fade-in">
          Welcome back, <span className="text-blue-400">{username}</span>!
        </h2>
        <p className="text-lg text-gray-400 mt-2">Here's what's new for you today.</p>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FaMusic size={24} />} value={stats.ratedAlbums} label="Albums Rated" />
        <StatCard icon={<FaStar size={24} />} value={stats.ratedArtists} label="Artists Rated" />
        <Link to="/browse" className="bg-green-600/20 hover:bg-green-500/30 p-4 rounded-xl flex items-center justify-center text-center transition-colors duration-300 col-span-1 sm:col-span-2 lg:col-span-2">
          <div>
            <FaSearch size={24} className="mx-auto mb-2 text-green-400" />
            <p className="font-bold text-white">Explore More Music</p>
            <p className="text-sm text-gray-300">Find new albums and artists</p>
          </div>
        </Link>
      </div>

      {/* Preporuke */}
      {recommendations.albums.length > 0 && (
        <div>
          <h3 className="text-3xl font-semibold mb-4 flex items-center">
            <FaRegThumbsUp className="mr-3 text-yellow-400" /> Just For You
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.albums.slice(0, 2).map(album => <AlbumCard key={album.id} album={album} onLike={() => {}} />)}
            {recommendations.artists.slice(0, 2).map(artist => <ArtistCard key={artist.id} artist={artist} onLike={() => {}} />)}
          </div>
          { (recommendations.albums.length > 2 || recommendations.artists.length > 2) &&
            <div className="text-center mt-6">
              <Link to="/recommendations" className="text-blue-400 hover:underline font-semibold">
                See all recommendations →
              </Link>
            </div>
          }
        </div>
      )}

      {/* Nastavi sa otkrivanjem */}
      {forYouToRate.length > 0 && (
        <div>
          <h3 className="text-3xl font-semibold mb-4">Continue Discovering</h3>
          <p className="text-gray-400 mb-4 -mt-3">Rate these to improve your recommendations.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {forYouToRate.map(album => <AlbumCard key={album.id} album={album} onLike={() => {}} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;