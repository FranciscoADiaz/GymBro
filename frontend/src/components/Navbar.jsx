import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const linkClasses = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-lg font-bold text-gray-900">
            GymBro
          </NavLink>
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={linkClasses}>
                  Dashboard
                </NavLink>
                <NavLink to="/members" className={linkClasses}>
                  Socios
                </NavLink>
                <NavLink to="/memberships" className={linkClasses}>
                  Planes
                </NavLink>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClasses}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClasses}>
                  Register
                </NavLink>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={linkClasses} onClick={() => setIsOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/members" className={linkClasses} onClick={() => setIsOpen(false)}>
                  Socios
                </NavLink>
                <NavLink to="/memberships" className={linkClasses} onClick={() => setIsOpen(false)}>
                  Planes
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block text-sm font-semibold text-red-600 hover:text-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClasses} onClick={() => setIsOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClasses} onClick={() => setIsOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

