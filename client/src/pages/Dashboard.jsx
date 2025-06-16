import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import authService from '../services/authService';
import { FaMusic, FaStar, FaUser } from 'react-icons/fa';

/**
 * Stranica sa kontrolnom tablom za prijavljene korisnike
 * @returns {JSX.Element} Modernizirana dashboard stranica sa opcijama za pretragu, preporuke i profil
 */
function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero text-white flex flex-col items-center">
      <Navbar />
      <div className="pt-20 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in text-center">
          Welcome to Your Dashboard
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl text-center animate-fade-in animation-delay-200">
          Explore new music, browse albums, or check your recommendations!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl justify-items-center">
          <Link
            to="/browse"
            className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-scale flex flex-col items-center text-center w-full max-w-xs"
          >
            <FaMusic className="text-4xl text-blue-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Browse Albums</h3>
            <p className="text-gray-200">Find new albums based on your taste.</p>
          </Link>
          <Link
            to="/recommendations"
            className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-scale flex flex-col items-center text-center w-full max-w-xs"
          >
            <FaStar className="text-4xl text-yellow-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Recommendations</h3>
            <p className="text-gray-200">See personalized music suggestions.</p>
          </Link>
          <Link
            to="/profile"
            className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-scale flex flex-col items-center text-center w-full max-w-xs"
          >
            <FaUser className="text-4xl text-green-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Your Profile</h3>
            <p className="text-gray-200">Manage your preferences and likes.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;