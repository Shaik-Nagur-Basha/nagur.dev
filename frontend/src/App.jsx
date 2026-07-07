import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useLayoutEffect, useEffect, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ErrorPage from "./pages/ErrorPage";
import ScrollToTop from "./components/ScrollToTop";
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

function ScrollRestoration() {
  const { pathname, hash } = useLocation();
  const lastPathname = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      isInitialMount.current = false;
    }, 1500);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const isPageTransition = lastPathname.current !== pathname;
        lastPathname.current = pathname;

        const needsCorrection = isPageTransition || isInitialMount.current;

        if (needsCorrection) {
          // Scroll immediately to start movement
          const timer1 = setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
          
          // Re-scroll once loading skeletons have loaded actual content and heights are stable
          const timer2 = setTimeout(() => {
            const freshElement = document.querySelector(hash);
            if (freshElement) {
              freshElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 950);

          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
          };
        } else {
          const timer = setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
          return () => clearTimeout(timer);
        }
      }
    } else {
      lastPathname.current = pathname;
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function PageHeadController() {
  const location = useLocation();
  const {
    profile,
    activeSection,
    setActiveSection,
    customPageTitle,
    customPageDescription,
    setCustomPageTitle,
    setCustomPageDescription,
  } = useProfileStore();

  useEffect(() => {
    // Reset custom page metadata on route change
    setCustomPageTitle("");
    setCustomPageDescription("");
  }, [location.pathname, setCustomPageTitle, setCustomPageDescription]);

  useEffect(() => {
    if (location.pathname === "/" && !location.hash) {
      setActiveSection("home");
    }
  }, [location.pathname, location.hash, setActiveSection]);

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
    let pageTitle = customPageTitle || "";
    const path = location.pathname;
    const hash = location.hash;

    const profileTitle = profile?.title || "nagur.dev";
    const profileName = profile?.name || "Sk Nagur Basha";

    if (!pageTitle) {
      if (path === "/") {
        const currentSection = activeSection || "home";
        if (currentSection === "about") {
          pageTitle = "About";
        } else if (currentSection === "projects") {
          pageTitle = "Projects";
        } else if (currentSection === "skills") {
          pageTitle = "Skills & Education";
        } else if (currentSection === "contact") {
          pageTitle = "Contact";
        } else {
          pageTitle = profileName;
        }
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
        pageTitle = "Skills & Education";
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
    }

    let fullTitle = "";
    if (path === "/" && (activeSection === "home" || !activeSection)) {
      fullTitle = `${profileTitle} | ${profileName}`;
    } else {
      fullTitle = `${profileTitle} | ${pageTitle}`;
    }
    document.title = fullTitle;

    // 3. Update Meta Description and SEO tags dynamically
    let pageDescription = customPageDescription || "";
    
    if (!pageDescription) {
      if (path === "/") {
        if (hash === "#about") {
          pageDescription = "Learn more about Shaik Nagur Basha, a passionate Full Stack Developer with expertise in building responsive, scalable, and premium web applications.";
        } else if (hash === "#projects") {
          pageDescription = "Explore my portfolio of web development and software engineering projects, showcasing clean code, rich animations, and high performance.";
        } else if (hash === "#skills") {
          pageDescription = "Discover the technical skills and core competencies of Shaik Nagur Basha, including React, Node.js, databases, and UI/UX design.";
        } else if (hash === "#contact") {
          pageDescription = "Get in touch with Shaik Nagur Basha for collaborations, job opportunities, or project requests.";
        }
      } else if (path === "/about") {
        pageDescription = "Learn more about Shaik Nagur Basha, a passionate Full Stack Developer with expertise in building responsive, scalable, and premium web applications.";
      } else if (path === "/projects") {
        pageDescription = "Explore my portfolio of web development and software engineering projects, showcasing clean code, rich animations, and high performance.";
      } else if (path.startsWith("/projects/")) {
        const slug = path.split("/").pop() || "";
        const formattedSlug = slug
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        pageDescription = `Explore detailed features, technology stack, architecture, and live links for the project: ${formattedSlug || "Project Details"}.`;
      } else if (path === "/contact") {
        pageDescription = "Get in touch with Shaik Nagur Basha for collaborations, job opportunities, or project requests.";
      } else if (path === "/privacy") {
        pageDescription = "Privacy Policy for nagur.dev portfolio website. Read about how we handle user data and privacy.";
      } else if (path === "/terms") {
        pageDescription = "Terms of Service for nagur.dev portfolio website. Read our terms and conditions of usage.";
      } else if (path === "/cookies") {
        pageDescription = "Cookie Policy for nagur.dev portfolio website. Learn about the cookies we use to enhance user experience.";
      } else if (path.startsWith("/admin")) {
        pageDescription = "Admin panel for managing projects and inquiries on nagur.dev.";
      }
    }

    const setMeta = (name, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        if (isProperty) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    setMeta("title", fullTitle);
    setMeta("description", pageDescription);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", pageDescription, true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", pageDescription);

    // Update canonical link
    const canonicalUrl = `https://nagur-dev.web.app${path}`;
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (canonicalElement) {
      canonicalElement.setAttribute("href", canonicalUrl);
    } else {
      canonicalElement = document.createElement("link");
      canonicalElement.setAttribute("rel", "canonical");
      canonicalElement.setAttribute("href", canonicalUrl);
      document.head.appendChild(canonicalElement);
    }

    // Update Open Graph and Twitter URL
    setMeta("og:url", canonicalUrl, true);
    setMeta("twitter:url", canonicalUrl);
  }, [location, profile, activeSection, customPageTitle, customPageDescription]);

  return null;
}

function App() {
  const { checkAuth } = useAuthStore();
  const { fetchProfile } = useProfileStore();
  
  // Initial Auth Check & Profile Fetch (runs once on initial mount)
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      checkAuth();
    }
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
        <ScrollRestoration />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/skills" element={<Navigate to="/#skills" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
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
