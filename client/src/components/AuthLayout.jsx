import { Link } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';

/**
 * Layout za stranice autentikacije (Login, Register)
 * @param {{ title: string, children: React.ReactNode, footerLink: string, footerText: string }} props
 * @returns {JSX.Element}
 */
function AuthLayout({ title, children, footerLink, footerText }) {
  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl max-w-md w-full animate-fade-in border border-white/20 shadow-2xl">
        {/* Dekorativni elementi */}
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500 rounded-full opacity-20 blur-xl"></div>

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-2xl font-bold text-white mb-2">
            <FaMusic className="mr-2 text-blue-400" /> Music Recommender
          </Link>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
        </div>
        
        {children}

        <p className="mt-6 text-center text-gray-300">
          {footerText}{' '}
          <Link to={footerLink} className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            {title === 'Login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;