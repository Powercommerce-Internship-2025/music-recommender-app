import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import authService from '../services/authService';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';

/**
 * Stranica za registraciju korisnika
 * @returns {JSX.Element} Forma za registraciju
 */
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      await authService.register({ username, email, password });
      navigate('/login');
    } catch (err) {
      setErrors({ server: err.response?.data?.error || 'Greška pri registraciji' });
      console.error('Greška pri registraciji:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-white flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign up</h2>
        {errors.server && <p className="text-red-300 mb-4 text-center">{errors.server}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            {errors.username && <p className="text-red-300 mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            {errors.email && <p className="text-red-300 mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            {errors.password && <p className="text-red-300 mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg btn-scale flex items-center justify-center"
          >
            {loading ? 'Loading...' : (
              <>
                <FaUserPlus className="mr-2" /> Sign up
              </>
            )}
          </button>
        </form>
        <p className="mt-4 text-center">
          You already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;