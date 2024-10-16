import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './output.css';
import LandingPage from '@/src/landingpage/LandingPage';
import { LoginForm } from '@/src/components/login';
import { SignupForm } from '@/src/components/signup';
import { Record } from '@/src/pages/record';
import { Notes } from '@/src/pages/notes';
import PrivateRoute from '@/src/components/PrivateRoute';
import Layout from '@/src/components/Layout';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Patients } from '@/src/pages/patients';
import { Calendar } from '@/src/pages/calendar';
import { Settings } from '@/src/pages/settings';
import { Patient } from '@/src/pages/patient';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Layout includes AuthProvider
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'app/login',
        element: <LoginForm />,
      },
      {
        path: 'app/signup',
        element: <SignupForm />,
      },
      {
        path: 'app/record',
        element: (
          <PrivateRoute>
            <Record />
          </PrivateRoute>
        ),
      },
      {
        path: 'app/notes',
        element: (
          <PrivateRoute>
            <Notes />
          </PrivateRoute>
        ),
      },
      {
        path: 'app/patients',
        element: (
          <PrivateRoute>
            <Patients />
          </PrivateRoute>
        ),
      },
      {
        path: 'app/calendar',
        element: (
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        ),
      },
      {
        path: 'app/settings',
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: 'app/patient/:id',
        element: (
          <PrivateRoute>
            <Patient />
          </PrivateRoute>
        ),
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);
