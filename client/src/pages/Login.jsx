import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

/*
  Login stranica
*/

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri prijavi');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Prijava</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-sm">
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Lozinka</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">Prijavi se</button>
      </form>
    </div>
  );
}

export default Login;