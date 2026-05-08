import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLayoutEffect, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ErrorPage from "./pages/ErrorPage";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutPage";
import FoundationsPage from "./pages/FoundationsPage";
import ContactPage from "./pages/ContactPage";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProjectManagement from "./pages/admin/ProjectManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import Security from "./pages/admin/Security";
import ProfileManagement from "./pages/admin/ProfileManagement";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { checkAuth } = useAuthStore();
  
  // Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Scroll to top on every route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<FoundationsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Auth Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <AdminLayout>
                  <ProjectManagement />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <AdminLayout>
                  <ContactManagement />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/security"
              element={
                <AdminLayout>
                  <Security />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <AdminLayout>
                  <ProfileManagement />
                </AdminLayout>
              }
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
