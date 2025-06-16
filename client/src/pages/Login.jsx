import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import authService from '../services/authService';

/**
 * Stranica za prijavu korisnika
 * @returns {JSX.Element} Forma za prijavu
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri prijavi');
      console.error('Greška pri prijavi:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-white flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-300 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
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
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg btn-scale flex items-center justify-center"
          >
            {loading ? 'Učitavanje...' : (
              <>
                <FaSignInAlt className="mr-2" /> Login
              </>
            )}
          </button>
        </form>
        <p className="mt-4 text-center">
          You don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;