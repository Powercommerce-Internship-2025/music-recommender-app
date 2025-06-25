import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';
import AuthLayout from '../components/AuthLayout';

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
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Greška pri registraciji';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
      <AuthLayout
        title="Sign Up"
        footerText="You already have an account?"
        footerLink="/login"
      >
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
            {errors.username && <p className="text-red-300 mt-1 text-sm">{errors.username}</p>}
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
            {errors.email && <p className="text-red-300 mt-1 text-sm">{errors.email}</p>}
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
            {errors.password && <p className="text-red-300 mt-1 text-sm">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg btn-scale flex items-center justify-center"
          >
            {loading ? 'Loading...' : (
              <>
                <FaUserPlus className="mr-2" /> Sign Up
              </>
            )}
          </button>
        </form>
      </AuthLayout>
    </div>
  );
}

export default Register;
