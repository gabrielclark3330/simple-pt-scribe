import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api';
import { isTokenExpired } from '../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Added user state
  const [isLoading, setIsLoading] = useState(true); // To handle loading state

  // Define public routes
  const publicRoutes = ['/app/login', '/app/signup'];

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');

      // If on a public route, skip token validation
      if (publicRoutes.includes(location.pathname)) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        navigate('/app/login?sessionExpired=true', { replace: true });
        return;
      }

      try {
        // Decode token to get user info
        const decoded = jwtDecode(token);
        setUser({ 
          id: decoded.id, 
          email: decoded.email, 
          first_name: decoded.first_name, 
          last_name: decoded.last_name 
        });

        // Optionally, verify token with backend
        await API.get('/auth/validate');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
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
      setUser(null);
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
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
