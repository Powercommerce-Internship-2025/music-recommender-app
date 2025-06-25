import { FaMusic } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 bg-opacity-50 text-gray-400 py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-2">
          <FaMusic className="mr-2 text-blue-400" />
          <p className="font-semibold text-white">Music Recommender</p>
        </div>
        <p>© {new Date().getFullYear()} PowerCommerce </p>
        <p className="text-sm mt-1">
          Powered by TARIK
        </p>
      </div>
    </footer>
  );
}

export default Footer;