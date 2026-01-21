import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
// import BlogsPage from "./pages/BlogsPage";
import ErrorPage from "./pages/ErrorPage";
// import GalleryPage from "./pages/GalleryPage";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import { useEffect } from "react";
// import IframePage from "./pages/IframePage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      navigate(redirect, { replace: true });
    }
  }, []);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        {/* <Route path="/iframe" element={<IframePage />} /> */}
        {/* <Route path="/gallery" element={<GalleryPage />} /> */}
        {/* <Route path="/blogs" element={<BlogsPage />} /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
