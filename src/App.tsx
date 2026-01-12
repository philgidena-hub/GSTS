import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { Home, Membership, Login, About, Services, Contact, News, Projects } from './pages';
import {
  Dashboard,
  HeroEditor,
  ApplicationsManager,
  ProjectsManager,
  BlogManager,
  TeamManager,
  MembersManager,
  MessagesManager,
  SiteSettings,
} from './pages/admin';
import { SetupAdmin } from './pages/admin/SetupAdmin';
import { useAuthStore } from './stores/authStore';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Auth Route wrapper (redirect if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  // Initialize Firebase auth listener on app startup
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

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
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/membership"
          element={
            <Layout>
              <Membership />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <Services />
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout>
              <Projects />
            </Layout>
          }
        />
        <Route
          path="/news"
          element={
            <Layout>
              <News />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
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
          <Route path="about" element={<HeroEditor />} />
          <Route path="services" element={<HeroEditor />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="members" element={<MembersManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="analytics" element={<Dashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
