import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api';
import { isTokenExpired } from '../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To handle loading state

  // Define public routes
  const publicRoutes = ['/app/login', '/app/signup'];

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');

      // If on a public route, skip token validation
      if (publicRoutes.includes(location.pathname)) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/app/login?sessionExpired=true', { replace: true });
        return;
      }

      try {
        await API.get('/auth/validate');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/app/login?sessionExpired=true', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [navigate, location.pathname]);

  // Handle logout event from Axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      if (!publicRoutes.includes(location.pathname)) {
        navigate('/app/login?sessionExpired=true', { replace: true });
      }
    };

    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, [navigate, location.pathname]);

  if (isLoading) {
    // Optionally, render a loading indicator
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
