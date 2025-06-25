import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { FaSignOutAlt, FaMusic, FaUser, FaBars, FaTimes, FaSignInAlt, FaSearch, FaStar } from 'react-icons/fa';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, [location.pathname]);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderLinks = (isMobile = false) => {
    const linkClass = isMobile ? "block text-white hover:text-blue-300 py-2 transition-colors" : "text-white hover:text-blue-300 transition-colors btn-scale";
    const buttonClass = "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg btn-scale flex items-center";
    const primaryButtonClass = "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg btn-scale flex items-center";
    const secondaryButtonClass = "bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg btn-scale flex items-center";

    if (isAuthenticated) {
      return (
        <>
          <Link to="/browse" className={`${linkClass} flex items-center`} onClick={isMobile ? closeMobileMenu : undefined}>
            <FaSearch className="mr-1" /> Browse
          </Link>
          <Link to="/recommendations" className={`${linkClass} flex items-center`} onClick={isMobile ? closeMobileMenu : undefined}>
            <FaStar className="mr-1" /> Recommendations
          </Link>
          <Link to="/profile" className={`${linkClass} flex items-center`} onClick={isMobile ? closeMobileMenu : undefined}>
            <FaUser className="mr-1" /> Profile
          </Link>
          <button onClick={handleLogout} className={isMobile ? `${linkClass} w-full text-left` : buttonClass}>
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/login" className={isMobile ? linkClass : primaryButtonClass} onClick={isMobile ? closeMobileMenu : undefined}>
            <FaSignInAlt className="mr-2" /> Login
          </Link>
          <Link to="/register" className={isMobile ? linkClass : secondaryButtonClass} onClick={isMobile ? closeMobileMenu : undefined}>
            <FaUser className="mr-2" /> Sign Up
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-sm z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-white flex items-center animate-fade-in">
          <FaMusic className="mr-2 text-blue-400" /> Music Recommender
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {renderLinks(false)}
        </div>

        {/* Mobitel Menu Dugme */}
        <button className="md:hidden text-white focus:outline-none" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobitel Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-10 backdrop-blur-lg p-4 animate-fade-in space-y-2">
          {renderLinks(true)}
        </div>
      )}
    </nav>
  );
}

export default Navbar;