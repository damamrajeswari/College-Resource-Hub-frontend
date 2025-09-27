import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Upload, FileText, Home, LogIn, UserPlus, LogOut } from 'lucide-react';
import { removeToken, getUserFromToken } from '../utils/auth';


import api from '../utils/api';


const Navbar = ({ authenticated, setAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getUserFromToken());

  useEffect(() => {
    const fetchUser = async () => {
      if (authenticated) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          setUser(getUserFromToken());
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [authenticated]);

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Responsive Navbar with mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">College Hub</span>
            </Link>
          </div>

          {/* Hamburger menu for mobile */}
          <div className="flex items-center lg:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Open main menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg className={`h-6 w-6 transition-transform ${menuOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center space-x-4">
            {authenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/resources"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/resources')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Resources</span>
                </Link>
                <Link
                  to="/upload"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/upload')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
                <Link
                  to="/about"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>About</span>
                </Link>
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-600">Hello, {user?.name || 'User'}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
                    isActive('/register') ? 'bg-blue-700' : ''
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
                <Link
                  to="/about"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>About</span>
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="lg:hidden mt-2 bg-white rounded-lg shadow-md border border-gray-100 py-2 px-2 z-50 absolute left-0 right-0 mx-4">
            <div className="flex flex-col space-y-2">
              {authenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/resources"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/resources')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Resources</span>
                  </Link>
                  <Link
                    to="/upload"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/upload')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Link>
                  <Link
                    to="/about"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/about')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>About</span>
                  </Link>
                  <div className="flex items-center space-x-2 border-t border-gray-200 pt-2 mt-2">
                    <span className="text-sm text-gray-600">Hello, {user?.name || 'User'}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/login')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
                      isActive('/register') ? 'bg-blue-700' : ''
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/about"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/about')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>About</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;