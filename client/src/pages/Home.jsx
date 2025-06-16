import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

/**
 * Početna stranica aplikacije
 * @returns {JSX.Element} Početna stranica sa pozivom na akciju
 */
function Home() {
  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Music Recommender
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl font-medium animate-fade-in animation-delay-200">
          Discover new albums and artists tailored to your taste. Join now and start exploring!
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg btn-scale flex items-center"
          >
            <FaSignInAlt className="mr-2" /> Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg btn-scale flex items-center"
          >
            <FaUserPlus className="mr-2" /> Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;