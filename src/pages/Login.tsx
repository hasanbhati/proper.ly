import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth';

const Logo = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-600 shadow-lg mb-2">
      {/* Simple house icon SVG */}
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10.5L12 4L21 10.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10V20H19V10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="14" width="6" height="6" rx="1" fill="#fff"/>
      </svg>
    </div>
    <span className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      Proper<span className="text-teal-600">.Ly</span>
    </span>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);
  
  const from = location.state?.from?.pathname || '/dashboard';
  const redirected = Boolean(location.state?.from);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative" style={{ minHeight: '100vh' }}>
      {/* SVG Pattern Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <svg width="100%" height="100%" className="h-full w-full" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <pattern id="pattern-bg" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect x="0" y="0" width="40" height="40" fill="#f8fafc" />
              <circle cx="20" cy="20" r="1.5" fill="#d1fae5" />
              <circle cx="0" cy="40" r="1.5" fill="#d1fae5" />
              <circle cx="40" cy="0" r="1.5" fill="#d1fae5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-bg)" />
        </svg>
      </div>
      <div className="relative z-10 max-w-md w-full space-y-8 bg-white bg-opacity-90 rounded-xl shadow-xl p-10">
        <Logo />
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-2">Welcome to Proper.Ly</h2>
        <p className="text-center text-sm text-gray-600 mb-4">Please sign in to your account</p>
        {redirected && (
          <div className="mb-4 text-center text-yellow-600 bg-yellow-100 border border-yellow-300 rounded p-2 text-sm">
            You must be logged in to access that page.
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-gray-100"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-gray-100"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center text-gray-600 mt-6">
            <p>Demo Account:</p>
            <p>Email: demo@proper.ly</p>
            <p>Password: Prop@demo</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 