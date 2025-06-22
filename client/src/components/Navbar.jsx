import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { FaSignOutAlt, FaMusic, FaStar, FaUser, FaBars, FaTimes } from 'react-icons/fa';

/**
 * Navigaciona traka za aplikaciju
 * @returns {JSX.Element}
 */
function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('Greška pri odjavi:', err);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-sm z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {}
        <Link to="/dashboard" className="text-2xl font-bold text-white flex items-center animate-fade-in">
          <FaMusic className="mr-2 text-blue-400" /> Music Recommender
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/browse" className="text-white hover:text-blue-300 transition-colors btn-scale">
                Browse Albums
              </Link>
              <Link to="/recommendations" className="text-white hover:text-blue-300 transition-colors btn-scale">
                Recommendations
              </Link>
              <Link to="/profile" className="text-white hover:text-blue-300 transition-colors btn-scale flex items-center">
                <FaUser className="mr-1" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg btn-scale flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-300 transition-colors btn-scale">
                Prijava
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg btn-scale flex items-center"
              >
                <FaUser className="mr-2" /> Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobitel Menu Dugme */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobitel Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-10 backdrop-blur-lg p-4 animate-fade-in">
          {isAuthenticated ? (
            <>
              <Link
                to="/browse"
                className="block text-white hover:text-blue-300 py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Browse Albums
              </Link>
              <Link
                to="/recommendations"
                className="block text-white hover:text-blue-300 py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Recommendatons
              </Link>
              <Link
                to="/profile"
                className="block text-white hover:text-blue-300 py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                <FaUser className="inline mr-2" /> Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="block w-full text-left text-white hover:text-blue-300 py-2 transition-colors"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-white hover:text-blue-300 py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Prijava
              </Link>
              <Link
                to="/register"
                className="block text-white hover:text-blue-300 py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;