import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CompareProvider } from './context/CompareContext';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CompareDrawer } from './components/CompareDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { FindMachineryPage } from './pages/FindMachineryPage';
import { MachineDetailsPage } from './pages/MachineDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { RentMachineryPage } from './pages/RentMachineryPage';
import { EmergencyRequestPage } from './pages/EmergencyRequestPage';
import { AIMatchPage } from './pages/AIMatchPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return <>{children}</>;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If first-time user opens the site ('/') and is not logged in, or is on '/login', display Welcome / Sign In screen
  const isAuthScreen = location.pathname === '/login' || (!isAuthenticated && location.pathname === '/');

  if (isAuthScreen) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Interactive Role Switcher Banner */}
      <DemoBanner />

      {/* Primary Navigation Bar */}
      <Navbar />

      {/* Main App Routes */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-machinery" element={<FindMachineryPage />} />
          <Route path="/ai-match" element={<AIMatchPage />} />
          <Route path="/machinery/:id" element={<MachineDetailsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route
            path="/farmer-dashboard"
            element={
              <ProtectedRoute>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/rent-machinery" element={<RentMachineryPage />} />
          <Route path="/emergency" element={<EmergencyRequestPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Floating Compare Drawer (when items selected) */}
      <CompareDrawer />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CompareProvider>
              <ScrollToTop />
              <AppContent />
            </CompareProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
