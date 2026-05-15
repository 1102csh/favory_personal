import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import {
  ProtectedRoute,
  PublicOnlyRoute,
  ArtisanRoute,
  AdminRoute,
} from './guards';

import LoginPage from '@/features/auth/pages/LoginPage';
import SignUpPage from '@/features/auth/pages/SignUpPage';
import EmailVerifyPage from '@/features/auth/pages/EmailVerifyPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import AuthCallbackPage from '@/features/auth/pages/AuthCallbackPage';
import CompleteProfilePage from '@/features/auth/pages/CompleteProfilePage';

import HomePage from '@/features/home/pages/HomePage';
import MyPage from '@/features/home/pages/MyPage';
import SettingsPage from '@/features/home/pages/SettingsPage';
import ChangePasswordPage from '@/features/home/pages/ChangePasswordPage';
import UpgradePage from '@/features/home/pages/UpgradePage';

import DashboardLayout from '@/features/dashboard/components/DashboardLayout';
import DashboardHomePage from '@/features/dashboard/pages/DashboardHomePage';
import AnalyticsPage from '@/features/dashboard/pages/AnalyticsPage';
import FeedManagePage from '@/features/dashboard/pages/FeedManagePage';
import StorePage from '@/features/dashboard/pages/StorePage';
import InventoryPage from '@/features/dashboard/pages/InventoryPage';
import OrdersPage from '@/features/dashboard/pages/OrdersPage';
import SalesPage from '@/features/dashboard/pages/SalesPage';
import CalendarPage from '@/features/dashboard/pages/CalendarPage';
import CustomersPage from '@/features/dashboard/pages/CustomersPage';
import ReviewsPage from '@/features/dashboard/pages/ReviewsPage';

import ProfilePage from '@/features/profile/pages/ProfilePage';
import ProfileEditPage from '@/features/profile/pages/ProfileEditPage';
import MyPageRedirect from '@/features/profile/pages/MyPageRedirect';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import LikedProductsPage from '@/features/home/pages/LikedProductsPage';
import FavoriteArtistsPage from '@/features/home/pages/FavoriteArtistsPage';
import NoticePage from '@/features/home/pages/NoticePage';
import InquiryPage from '@/features/home/pages/InquiryPage';

import NotFoundPage from './NotFoundPage';
import ToBeCountinue from '@/features/dashboard/pages/ToBeCountinue';

import FeedPage from '@/features/community/pages/FeedPage';
import PostDetailPage from '@/features/community/pages/PostDetailPage';
import WritePostPage from '@/features/community/pages/WritePostPage';
import EditPostPage from '@/features/community/pages/EditPostPage';

import SearchPage from '@/features/search/pages/SearchPage';
import AdminPage from '@/features/admin/pages/AdminPage';
import AdminMagazineEditPage from '@/features/admin/pages/AdminMagazineEditPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute> },
      { path: '/signup', element: <PublicOnlyRoute><SignUpPage /></PublicOnlyRoute> },
      { path: '/auth/verify-email', element: <EmailVerifyPage /> },
      { path: '/auth/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/auth/reset-password', element: <ResetPasswordPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
      { path: '/auth/complete-profile', element: <CompleteProfilePage /> },

      { path: '/', element: <ProtectedRoute><HomePage /></ProtectedRoute> },
      { path: '/mypage', element: <ProtectedRoute><MyPage /></ProtectedRoute> },
      { path: '/search', element: <ProtectedRoute><SearchPage /></ProtectedRoute> },
      { path: '/profile', element: <ProtectedRoute><MyPageRedirect /></ProtectedRoute> },
      
      { path: '/settings', element: <ProtectedRoute><SettingsPage /></ProtectedRoute> },
      { path: '/settings/profile', element: <ProtectedRoute><ProfileEditPage /></ProtectedRoute> },
      { path: '/settings/password', element: <ProtectedRoute><ChangePasswordPage /></ProtectedRoute> },
      { path: '/mypage/likes', element: <ProtectedRoute><LikedProductsPage /></ProtectedRoute> },
      { path: '/mypage/following', element: <ProtectedRoute><FavoriteArtistsPage /></ProtectedRoute> },
      { path: '/mypage/notices', element: <ProtectedRoute><NoticePage /></ProtectedRoute> },
      { path: '/mypage/inquiries', element: <ProtectedRoute><InquiryPage /></ProtectedRoute> },
      
      { path: '/upgrade', element: <ProtectedRoute><UpgradePage /></ProtectedRoute> },
      { path: '/users/:id', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: '/products/:id', element: <ProtectedRoute><ProductDetailPage /></ProtectedRoute> },
      { path: '/community', element: <ProtectedRoute><FeedPage /></ProtectedRoute> },
      { path: '/community/posts/:id', element: <ProtectedRoute><PostDetailPage /></ProtectedRoute> },
      { path: '/community/write', element: <ProtectedRoute><WritePostPage /></ProtectedRoute> },
      { path: '/community/posts/:id/edit', element: <ProtectedRoute><EditPostPage /></ProtectedRoute> },

      { path: '/admin', element: <ProtectedRoute><AdminPage /></ProtectedRoute> },
      { path: '/admin/magazine/new', element: <AdminRoute><AdminMagazineEditPage mode="create" /></AdminRoute> },
      { path: '/admin/magazine/:id/edit', element: <AdminRoute><AdminMagazineEditPage mode="edit" /></AdminRoute> },

      {
        path: '/dashboard',
        element: <ArtisanRoute><DashboardLayout /></ArtisanRoute>,
        children: [
          { index: true, element: <DashboardHomePage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'feed', element: <FeedManagePage /> },
          { path: 'store', element: <StorePage /> },
          { path: 'inventory', element: <InventoryPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'sales', element: <SalesPage /> },
          { path: 'calendar', element: <CalendarPage /> },
          { path: 'customers', element: <CustomersPage /> },
          { path: 'reviews', element: <ReviewsPage /> },
          { path: 'countinue', element: <ToBeCountinue /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);