// src/app/router.jsx
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import EmailVerifyPage from '../features/auth/pages/EmailVerifyPage';
import AuthCallbackPage from '../features/auth/pages/AuthCallbackPage';
import HomePage from '../features/home/pages/HomePage';
import AdminPage from '../features/admin/pages/AdminPage';

const RootLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/auth/verify-email', element: <EmailVerifyPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
      { path: '/admin', element: <AdminPage /> },
    ],
  },
]);
