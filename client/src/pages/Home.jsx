import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaThumbsUp, FaSpotify, FaLastfm } from 'react-icons/fa';
import Footer from '../components/Footer';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <main className="flex-grow">
        {/* Hero sekcija */}
        <section className="relative flex items-center justify-center text-center min-h-[90vh] px-4">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20"
              src="https://cdn.pixabay.com/video/2020/03/13/33560-402381634.mp4"
            ></video>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white animate-fade-in">
              Your Personal Music Universe
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-fade-in animation-delay-200">
              Unearth hidden gems and rediscover your favorites. Let us guide your musical journey.
            </p>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full btn-scale text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              Start Exploring
            </Link>
          </div>
        </section>

        {/* Sekcija sa funkcionalnostima */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white">How It Works</h2>
              <p className="text-gray-400 mt-2">Simple steps to endless music discovery.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<FaSearch size={40} />}
                title="1. Discover"
                description="Browse a vast catalog of albums and artists. Search for your favorites or explore something new."
              />
              <FeatureCard
                icon={<FaStar size={40} />}
                title="2. Rate"
                description="Tell us what you love. Rate albums and artists to build a profile of your unique musical taste."
              />
              <FeatureCard
                icon={<FaThumbsUp size={40} />}
                title="3. Get Recommendations"
                description="Receive personalized suggestions based on your ratings. The more you rate, the smarter it gets."
              />
            </div>
          </div>
        </section>

        {/* Sekcija "Powered By" */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Powered by the world's largest music databases
            </h3>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <FaLastfm size={120} className="text-gray-400" />
              <FaSpotify size={80} className="text-gray-400" />
            </div>
          </div>
        </section>
      </main>
      <Footer /> {/* Footer */}
    </div>
  );
}

export default Home;