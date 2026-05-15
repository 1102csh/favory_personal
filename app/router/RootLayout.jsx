// src/app/router/RootLayout.jsx (신규)
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../providers/AuthProvider';

/**
 * 모든 라우트의 부모. 라우터 컨텍스트 안에 AuthProvider를 둠으로써
 * AuthProvider가 useNavigate를 사용할 수 있게 함.
 */
const RootLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export default RootLayout;