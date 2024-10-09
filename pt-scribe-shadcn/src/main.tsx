import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './output.css'
import LandingPage from './landingpage/LandingPage'
import { LoginForm } from './components/login'
import { SignupForm } from './components/signup'
import { Record } from './pages/record'
import { Notes } from './pages/notes'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: < LandingPage />,
  },
  {
    path: "/app/login",
    element: < LoginForm />
  },
  {
    path: "/app/signup",
    element: < SignupForm />
  },
  {
    path: "/app/record",
    element: < Record />
  },
  {
    path: "/app/notes",
    element: < Notes />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
