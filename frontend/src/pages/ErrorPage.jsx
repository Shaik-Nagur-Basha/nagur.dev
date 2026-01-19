import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoveLeft, Home, Meh } from "lucide-react";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SkeletonLoader from "../components/SkeletonLoader";
import { useTheme } from "../context/ThemeContext";

const ErrorPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);

  useEffect(() => {
    // Minimum skeleton display time (prevents flashing)
    const minTimer = setTimeout(() => setMinLoadingTime(false), 800);
    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    // Switch to content once minimum time has passed
    if (!minLoadingTime) {
      setIsLoading(false);
    }
  }, [minLoadingTime]);

  useEffect(() => {
    // Optional: Add a class to the body for page-specific styling
    document.body.classList.add("error-page-active");
    return () => {
      document.body.classList.remove("error-page-active");
    };
  }, []);

  // Inline styles for dynamic theme and animations
  const styles = `
    .error-page-container {
      background-color: ${darkMode ? "#020617" : "#f8fafc"};
      color: ${darkMode ? "#e2e8f0" : "#0f172a"};
    }

    .error-page-container::before {
      content: '';
      background: ${
        darkMode
          ? "radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.1), transparent 30%), radial-gradient(circle at 85% 75%, rgba(139, 92, 246, 0.1), transparent 40%)"
          : "radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.05), transparent 25%), radial-gradient(circle at 85% 75%, rgba(139, 92, 246, 0.05), transparent 30%)"
      };
      pointer-events: none;
    }

    .error-content-wrapper {
      padding: 2rem;
      z-index: 1;
    }

    /* Glitch effect for 404 text */
    .glitch-text-container {
      position: relative;
      animation: wobble 8s ease-in-out infinite;
    }

    .glitch-text {
      font-size: clamp(5.1rem, 21.25vw, 12.75rem);
      font-weight: 900;
      line-height: 1;
      position: relative;
      color: ${darkMode ? "#e2e8f0" : "#1e293b"};
      text-shadow: ${
        darkMode
          ? "0 0 10px rgba(59, 130, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.2)"
          : "0 0 10px rgba(59, 130, 246, 0.1), 0 0 20px rgba(139, 92, 246, 0.1)"
      };
    }

    .glitch-text::before,
    .glitch-text::after {
      content: '404';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${darkMode ? "#020617" : "#f8fafc"};
      overflow: hidden;
      clip-path: inset(50% 0 50% 0);
    }

    .glitch-text::before {
      left: -2px;
      text-shadow: -2px 0 #3b82f6;
      animation: glitch-anim-1 3s infinite linear alternate-reverse;
    }

    .glitch-text::after {
      left: 2px;
      text-shadow: -2px 0 #8b5cf6, 2px 2px #ec4899;
      animation: glitch-anim-2 2s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim-1 {
      0%, 100% { clip-path: inset(45% 0 56% 0); }
      25% { clip-path: inset(0 0 100% 0); }
      50% { clip-path: inset(80% 0 2% 0); }
      75% { clip-path: inset(30% 0 71% 0); }
    }

    @keyframes glitch-anim-2 {
      0%, 100% { clip-path: inset(10% 0 91% 0); }
      25% { clip-path: inset(100% 0 0 0); }
      50% { clip-path: inset(20% 0 82% 0); }
      75% { clip-path: inset(70% 0 31% 0); }
    }

    @keyframes wobble {
        0%, 100% { transform: rotate(-1deg); }
        50% { transform: rotate(1deg); }
    }

    /* Right side content */
    .error-details {
      animation: fadeIn 1s ease-out 0.2s backwards;
    }

    .error-subtitle {
      font-size: clamp(1.5rem, 4vw, 2.25rem);
      font-weight: 700;
      color: ${darkMode ? "#c7d2fe" : "#3730a3"};
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      justify-content: center;
    }

    @media (min-width: 768px) {
      .error-subtitle {
        justify-content: flex-start;
      }
    }

    .error-description {
      font-size: 1.125rem;
      color: ${darkMode ? "#94a3b8" : "#475569"};
      margin-bottom: 2.5rem;
      max-width: 475px;
    }

    /* Buttons */
    .error-actions {
      display: flex;
      gap: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 640px) {
      .error-actions {
        flex-direction: row;
        gap: 1rem;
      }
    }

    .error-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.875rem 2rem;
      border: 2px solid transparent;
      border-radius: 0.5rem;
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
      position: relative;
      overflow: hidden;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.35), 0 0 30px rgba(99, 102, 241, 0.1);
      border: 2px solid transparent;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      transform: translateY(-3px);
      box-shadow: 0 12px 24px rgba(79, 70, 229, 0.5), 0 0 40px rgba(99, 102, 241, 0.2);
    }

    .btn-primary:active {
      transform: translateY(-1px);
      box-shadow: 0 6px 12px rgba(79, 70, 229, 0.4);
    }

    .btn-secondary {
      background-color: ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(79, 70, 229, 0.1)"};
      color: ${darkMode ? "#c7d2fe" : "#4f46e5"};
      border-color: ${darkMode ? "rgba(199, 210, 254, 0.2)" : "rgba(79, 70, 229, 0.3)"};
      box-shadow: 0 2px 8px ${darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(79, 70, 229, 0.1)"};
    }
    
    .btn-secondary:hover {
      background-color: ${darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(79, 70, 229, 0.15)"};
      border-color: ${darkMode ? "rgba(199, 210, 254, 0.4)" : "rgba(79, 70, 229, 0.6)"};
      transform: translateY(-2px);
      box-shadow: 0 8px 16px ${darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(79, 70, 229, 0.2)"};
    }

    .btn-secondary:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px ${darkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(79, 70, 229, 0.1)"};
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="errorpage" />
      ) : (
        <div className="error-page-container">
          <style>{styles}</style>
          <Navigation />

          <main className="error-content-wrapper">
            <div className="flex flex-col justify-center items-center mt-10 space-y-8">
              <div className="glitch-text-container">
                <div className="glitch-text">404</div>
              </div>

              <div className="error-details w-full flex flex-col items-center">
                <h1 className="error-subtitle truncate">
                  <Meh size={36} strokeWidth={1.5} />
                  <span>Oops! Page Not Found</span>
                </h1>
                <p className="error-description mx-auto">
                  It seems you've taken a wrong turn in the digital universe.
                  The page you are looking for might have been moved, deleted,
                  or perhaps never existed.
                </p>

                <div className="error-actions justify-center items-center flex-wrap">
                  <button
                    onClick={() => navigate(-1)}
                    className="error-btn btn-secondary"
                  >
                    <MoveLeft size={20} className="mr-2" />
                    Go Back
                  </button>
                  <Link to="/nagur.dev" className="error-btn btn-primary">
                    <Home size={20} className="mr-2" />
                    Take Me Home
                  </Link>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </>
  );
};

export default ErrorPage;
