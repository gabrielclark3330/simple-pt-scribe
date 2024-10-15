import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

const Layout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export default Layout;
