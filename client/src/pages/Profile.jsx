import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import userService from '../services/userService';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import { FaUserEdit, FaLock, FaSave } from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState({ albums: [], artists: [] });
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('albums');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data.user);
        setFormData({ username: data.user.username, email: data.user.email });
        setLikes({
          albums: data.likes.filter(like => like.Album),
          artists: data.likes.filter(like => like.Artist),
        });
      } catch (error) {
        toast.error('Greška pri dohvatanju profila.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateProfile(formData);
      setUser(updatedUser);
      toast.success('Profile successfully updated!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating profile.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error('The new password must have at least 6 characters.');
      return;
    }
    try {
      await userService.updatePassword(passwordData);
      toast.success('Password successfully changed!');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error changing password.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading profile...</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <h2 className="text-4xl font-bold mb-8 text-center">Your Profile</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lijeva kolona: Info i promjena lozinke */}
        <div className="lg:col-span-1 space-y-8">
          {/* Informacije o korisniku */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center"><FaUserEdit className="mr-3 text-blue-400" /> Edit profile</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-sm">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleFormChange} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg btn-scale flex items-center justify-center">
                <FaSave className="mr-2" /> Save changes
              </button>
            </form>
          </div>

          {/* Promjena lozinke */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center"><FaLock className="mr-3 text-red-400" /> Change password</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-sm">Current password</label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">New password</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg btn-scale flex items-center justify-center">
                <FaSave className="mr-2" /> Change password
              </button>
            </form>
          </div>
        </div>

        {/* Desna kolona: Ocijenjeni sadržaj */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Your ratings</h3>
          <div className="flex space-x-2 mb-6 border-b border-gray-700">
            <button onClick={() => setActiveTab('albums')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'albums' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'}`}>
              Albums ({likes.albums.length})
            </button>
            <button onClick={() => setActiveTab('artists')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'artists' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'}`}>
              Artists ({likes.artists.length})
            </button>
          </div>

          {activeTab === 'albums' && (
            likes.albums.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {likes.albums.map(like => <AlbumCard key={like.id} album={{...like.Album, rating: like.rating}} onLike={() => {}} />)}
              </div>
            ) : <p className="text-center text-gray-400">You have not rated any albums.</p>
          )}

          {activeTab === 'artists' && (
            likes.artists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {likes.artists.map(like => <ArtistCard key={like.id} artist={{...like.Artist, rating: like.rating}} onLike={() => {}} />)}
              </div>
            ) : <p className="text-center text-gray-400">You have not rated any artist.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;