import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import SelectRole from './pages/SelectRole';
import Dashboard from './pages/Dashboard';
import CropMarket from './pages/CropMarket';
import CropDetail from './pages/CropDetail';
import ListCrop from './pages/ListCrop';
import MyOffers from './pages/MyOffers';
import MyContracts from './pages/MyContracts';
import Profile from './pages/Profile';

const NO_FOOTER_PATHS = ['/auth/callback', '/select-role', '/login', '/signup'];

const App = () => {
  const location = useLocation();
  const showFooter = !NO_FOOTER_PATHS.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/select-role" element={
            <ProtectedRoute><SelectRole /></ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/market" element={<CropMarket />} />
          <Route path="/crops/:id" element={<CropDetail />} />

          <Route path="/crops/list" element={
            <ProtectedRoute><ListCrop /></ProtectedRoute>
          } />

          <Route path="/my-offers" element={
            <ProtectedRoute><MyOffers /></ProtectedRoute>
          } />

          <Route path="/my-contracts" element={
            <ProtectedRoute><MyContracts /></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-wrap">
              <div className="container">
                <div className="empty-state" style={{ marginTop: 80 }}>
                  <div className="empty-icon">🌾</div>
                  <h3>Page not found</h3>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Go Home</a>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default App;
