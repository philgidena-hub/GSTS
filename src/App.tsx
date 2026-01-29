import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { Home, Membership, Login, About, Services, Contact, News, NewsDetail, Projects, Resources } from './pages';
import { MembershipSuccess } from './pages/MembershipSuccess';
import { MemberPortal } from './pages/MemberPortal';
import {
  Dashboard,
  HeroEditor,
  AboutEditor,
  ApplicationsManager,
  ProjectsManager,
  BlogManager,
  TeamManager,
  MembersManager,
  MessagesManager,
  SiteSettings,
  ServicesManager,
  StatisticsManager,
  FAQManager,
  PartnersManager,
  UsersManager,
  ResourcesManager,
} from './pages/admin';
import { SetupAdmin } from './pages/admin/SetupAdmin';
import { useAuthStore } from './stores/authStore';
import { useContentStore } from './stores/contentStore';
// Custom cursor disabled for better usability
// import { CustomCursor } from './components/cursor';
import { PageTransition } from './components/transitions';

// Protected Route wrapper - allows both super_admin and admin roles
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow super_admin and admin roles
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  // Check if user is disabled
  if (user?.isDisabled) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth Route wrapper (redirect if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin')) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Animated Routes component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <PageTransition>
                <Home />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/membership"
          element={
            <Layout>
              <PageTransition>
                <Membership />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/membership/success"
          element={
            <Layout>
              <PageTransition>
                <MembershipSuccess />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/member-portal"
          element={
            <Layout>
              <PageTransition>
                <MemberPortal />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <PageTransition>
                <About />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/programs"
          element={
            <Layout>
              <PageTransition>
                <Services />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout>
              <PageTransition>
                <Projects />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/news"
          element={
            <Layout>
              <PageTransition>
                <News />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/news/:slug"
          element={
            <Layout>
              <PageTransition>
                <NewsDetail />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <PageTransition>
                <Contact />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/resources"
          element={
            <Layout>
              <PageTransition>
                <Resources />
              </PageTransition>
            </Layout>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <PageTransition>
                <Login />
              </PageTransition>
            </AuthRoute>
          }
        />

        {/* Admin Setup (one-time use) */}
        <Route path="/setup-admin" element={<SetupAdmin />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="applications" element={<ApplicationsManager />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="thematic-areas" element={<ServicesManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="members" element={<MembersManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="statistics" element={<StatisticsManager />} />
          <Route path="faqs" element={<FAQManager />} />
          <Route path="partners" element={<PartnersManager />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="resources" element={<ResourcesManager />} />
          <Route path="analytics" element={<Dashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    </>
  );
};

function App() {
  const { initializeAuth, isLoading } = useAuthStore();
  const { initializeContent } = useContentStore();

  // Initialize Firebase auth listener on app startup
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  // Initialize content from Firebase
  useEffect(() => {
    initializeContent();
  }, [initializeContent]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f9fafb'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
