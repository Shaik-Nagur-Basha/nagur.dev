import { useTheme } from "../context/ThemeContext";

function Logo() {
  const { darkMode } = useTheme();

  const logoAnimationStyle = `
    @keyframes logoFloat {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-4px);
      }
    }
    @keyframes logoGlow {
      0%, 100% {
        filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
      }
      50% {
        filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 8px rgba(124, 58, 237, 0.6));
      }
    }
    @keyframes rotateOuter {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes rotatePulse {
      0%, 100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
    }
    @keyframes codeFlash {
      0%, 100% {
        stroke-dashoffset: 100;
      }
      50% {
        stroke-dashoffset: 0;
      }
    }
    .logo-container {
      animation: logoFloat 3s ease-in-out infinite;
    }
    .logo-glow {
      animation: logoGlow 3s ease-in-out infinite;
    }
    .logo-rotate {
      animation: rotateOuter 12s linear infinite;
      transform-origin: center;
    }
    .logo-pulse {
      animation: rotatePulse 2.5s ease-in-out infinite;
    }
    .logo-flash {
      animation: codeFlash 2.5s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{logoAnimationStyle}</style>
      <div className="logo-container logo-glow">
        <svg
          width="36"
          height="36"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer rotating circle - tech accent */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke={
              darkMode ? "url(#techGradientDark)" : "url(#techGradientLight)"
            }
            strokeWidth="1"
            opacity="0.25"
            className="logo-rotate"
            strokeDasharray="5 3"
          />

          {/* Code bracket group - Left angle bracket < */}
          <g className="logo-pulse">
            <polyline
              points="12,14 8,20 12,26"
              stroke={darkMode ? "#3b82f6" : "#2563eb"}
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Central code dots - representing nodes/connections */}
          <g className="logo-pulse" style={{ animationDelay: "0.2s" }}>
            <circle
              cx="20"
              cy="15"
              r="1.8"
              fill={
                darkMode ? "url(#techGradientDark)" : "url(#techGradientLight)"
              }
              opacity="0.9"
            />
            <circle
              cx="20"
              cy="20"
              r="1.8"
              fill={
                darkMode ? "url(#techGradientDark)" : "url(#techGradientLight)"
              }
              opacity="1"
            />
            <circle
              cx="20"
              cy="25"
              r="1.8"
              fill={
                darkMode ? "url(#techGradientDark)" : "url(#techGradientLight)"
              }
              opacity="0.9"
            />
          </g>

          {/* Code bracket group - Right angle bracket > */}
          <g className="logo-pulse" style={{ animationDelay: "0.4s" }}>
            <polyline
              points="28,14 32,20 28,26"
              stroke={darkMode ? "#7c3aed" : "#a855f7"}
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Connection lines - Code flow */}
          <line
            x1="14"
            y1="20"
            x2="18"
            y2="20"
            stroke={darkMode ? "#3b82f6" : "#2563eb"}
            strokeWidth="1.5"
            opacity="0.6"
            className="logo-pulse"
          />
          <line
            x1="22"
            y1="20"
            x2="26"
            y2="20"
            stroke={darkMode ? "#7c3aed" : "#a855f7"}
            strokeWidth="1.5"
            opacity="0.6"
            className="logo-pulse"
            style={{ animationDelay: "0.2s" }}
          />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="techGradientLight"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient
              id="techGradientDark"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}

export default Logo;
