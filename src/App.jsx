import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/core/ScrollToTop';
import ProtectedRoute from './components/core/ProtectedRoute';

// Pages
import LandingPage from './pages/public/LandingPage';
import ScannerPage from './pages/app/ScannerPage';
import DashboardPage from './pages/app/DashboardPage';
import HistoryPage from './pages/app/HistoryPage';
import ScanDetailPage from './pages/app/ScanDetailPage';
import ResourcesPage from './pages/public/ResourcesPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/public/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {/* 
        We only show Navbar on public routes. 
        Admin routes handle their own layout. 
      */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/scan/:id" element={<ScanDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
