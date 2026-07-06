import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ErrorPage from "./pages/ErrorPage";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutPage";
import FoundationsPage from "./pages/FoundationsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";

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
import { useProfileStore } from "./store/useProfileStore";

function PageHeadController() {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Favicon
    const favicon = document.getElementById("favicon") || document.querySelector("link[rel*='icon']");
    if (favicon) {
      if (location.pathname.startsWith("/admin")) {
        favicon.setAttribute("href", "/logo-golden.svg");
      } else {
        favicon.setAttribute("href", "/logo.svg");
      }
    }

    // 2. Update Title (add sub string based on pages switch)
    let pageTitle = "";
    const path = location.pathname;

    if (path === "/") {
      pageTitle = "Home";
    } else if (path === "/about") {
      pageTitle = "About";
    } else if (path === "/projects") {
      pageTitle = "Projects";
    } else if (path.startsWith("/projects/")) {
      const slug = path.split("/").pop() || "";
      const formattedSlug = slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      pageTitle = formattedSlug || "Project Details";
    } else if (path === "/skills") {
      pageTitle = "Skills";
    } else if (path === "/contact") {
      pageTitle = "Contact";
    } else if (path === "/privacy") {
      pageTitle = "Privacy Policy";
    } else if (path === "/terms") {
      pageTitle = "Terms of Service";
    } else if (path === "/cookies") {
      pageTitle = "Cookie Policy";
    } else if (path === "/admin") {
      pageTitle = "Admin Dashboard";
    } else if (path === "/admin/login") {
      pageTitle = "Admin Login";
    } else if (path === "/admin/projects") {
      pageTitle = "Manage Projects";
    } else if (path === "/admin/contacts") {
      pageTitle = "Manage Contacts";
    } else if (path === "/admin/security") {
      pageTitle = "Security Settings";
    } else if (path === "/admin/profile") {
      pageTitle = "Manage Profile";
    } else {
      pageTitle = "404 Not Found";
    }

    document.title = `nagur.dev | ${pageTitle}`;
  }, [location]);

  return null;
}

function App() {
  const { checkAuth } = useAuthStore();
  const { fetchProfile } = useProfileStore();
  
  // Initial Auth Check & Profile Fetch (runs once on initial mount)
  useEffect(() => {
    checkAuth();
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top on every route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <PageHeadController />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/skills" element={<FoundationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />

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
