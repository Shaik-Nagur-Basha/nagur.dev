import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import SkeletonLoader from "./SkeletonLoader";

function Footer() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const currentYear = new Date().getFullYear();

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

  const styles = `
    .footer-wrapper {
      position: relative;
      overflow: hidden;
      background: ${
        darkMode
          ? "linear-gradient(180deg, #0f172a 0%, #020617 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)"
      };
      transition: all 0.3s ease;
    }

    .footer-wrapper::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(600px circle at 10% 10%, ${
          darkMode ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)"
        }, transparent 40%),
        radial-gradient(500px circle at 90% 80%, ${
          darkMode ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.08)"
        }, transparent 45%);
      pointer-events: none;
      z-index: 0;
    }

    .footer-content {
      position: relative;
      z-index: 1;
      max-width: 80rem;
      margin: 0 auto;
      padding: 3rem 1.25rem 2rem;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .footer-title {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: 0.3px;
      color: ${darkMode ? "#f1f5f9" : "#0f172a"};
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-title::before {
      content: "";
      width: 3px;
      height: 20px;
      background: linear-gradient(180deg, #3b82f6, #a855f7);
      border-radius: 2px;
    }

    .footer-description {
      font-size: 0.95rem;
      line-height: 1.7;
      color: ${darkMode ? "#cbd5e1" : "#64748b"};
      max-width: 380px;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .footer-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: ${darkMode ? "#cbd5e1" : "#64748b"};
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      padding-left: 1rem;
    }

    .footer-link::before {
      content: "";
      position: absolute;
      left: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg, #3b82f6, transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .footer-link:hover {
      color: ${darkMode ? "#f1f5f9" : "#0f172a"};
      transform: translateX(4px);
    }

    .footer-link:hover::before {
      opacity: 1;
    }

    .footer-link svg {
      opacity: 0;
      transform: translateX(-8px);
      transition: all 0.3s ease;
    }

    .footer-link:hover svg {
      opacity: 1;
      transform: translateX(0);
    }

    .social-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
      align-items: center;
      justify-content: flex-start;
    }

    .social-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: ${
        darkMode
          ? "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
          : "linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))"
      };
      color: ${darkMode ? "#cbd5e1" : "#475569"};
      border: 2px solid ${
        darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
      };
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: visible;
    }

    .social-btn::before {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: linear-gradient(45deg, transparent);
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: -1;
    }

    .social-btn::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: inherit;
      opacity: 0;
      transition: all 0.4s ease;
      z-index: -2;
    }

    .social-btn:nth-child(1) {
      --icon-color: #333333;
      --icon-color-hover: #ffffff;
      --gradient-start: #1f2937;
      --gradient-end: #374151;
    }

    .social-btn:nth-child(2) {
      --icon-color: #0a66c2;
      --icon-color-hover: #ffffff;
      --gradient-start: #0a66c2;
      --gradient-end: #054da6;
    }

    .social-btn:nth-child(3) {
      --icon-color: #1da1f2;
      --icon-color-hover: #ffffff;
      --gradient-start: #1da1f2;
      --gradient-end: #1a8cd8;
    }

    .social-btn:nth-child(4) {
      --icon-color: #ea4335;
      --icon-color-hover: #ffffff;
      --gradient-start: #ea4335;
      --gradient-end: #c5221f;
    }

    .social-btn:hover {
      transform: translateY(-8px) rotateZ(10deg) scale(1.05);
      color: var(--icon-color-hover);
      border-color: var(--gradient-start);
      box-shadow: 
        0 20px 50px rgba(0,0,0,0.2),
        0 0 30px rgba(0,0,0,0.1),
        inset 0 1px 2px rgba(255,255,255,0.1);
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    }

    .social-btn:hover::before {
      opacity: 0.3;
      background: linear-gradient(
        45deg,
        var(--gradient-start),
        var(--gradient-end),
        var(--gradient-start)
      );
      animation: pulse-ring 1.5s ease-out infinite;
    }

    @keyframes pulse-ring {
      0% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
      }
    }

    .social-btn:active {
      transform: translateY(-4px) rotateZ(10deg) scale(1.05);
    }

    ${
      darkMode
        ? `
      .social-btn {
        background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
        border-color: rgba(99,102,241,0.2);
      }
      
      .social-btn:hover {
        background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
        box-shadow: 
          0 20px 50px rgba(99,102,241,0.4),
          0 0 30px rgba(168,85,247,0.2),
          inset 0 1px 2px rgba(255,255,255,0.2);
      }
    `
        : `
      .social-btn:hover {
        background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
        box-shadow: 
          0 20px 50px rgba(59,130,246,0.25),
          0 0 30px rgba(168,85,247,0.15),
          inset 0 1px 2px rgba(255,255,255,0.3);
      }
    `
    }

    .footer-divider {
      height: 1px;
      margin: 2.5rem 0 1.75rem 0;
      background: linear-gradient(
        90deg,
        transparent,
        ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"},
        transparent
      );
    }

    .footer-bottom {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      font-size: 0.875rem;
      color: ${darkMode ? "#94a3b8" : "#64748b"};
    }

    .bottom-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .copyright {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .footer-links-bottom {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .footer-links-bottom a {
      color: inherit;
      text-decoration: none;
      transition: color 0.3s ease;
      position: relative;
    }

    .footer-links-bottom a::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #a855f7);
      transition: width 0.3s ease;
    }

    .footer-links-bottom a:hover {
      color: ${darkMode ? "#f1f5f9" : "#0f172a"};
    }

    .footer-links-bottom a:hover::after {
      width: 100%;
    }

    @media (max-width: 768px) {
      .footer-content {
        padding: 2.5rem 1rem 1.5rem;
      }

      .bottom-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .footer-description {
        max-width: 100%;
      }

      .footer-links-bottom {
        gap: 1rem;
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .footer-content {
        padding: 1.75rem 0.75rem 1.25rem;
      }

      .footer-title {
        font-size: 1rem;
      }

      .footer-description {
        font-size: 0.875rem;
        line-height: 1.6;
      }

      .footer-link {
        font-size: 0.85rem;
      }

      .social-links {
        margin-top: 0.75rem;
      }

      .social-btn {
        width: 40px;
        height: 40px;
      }
    }
  `;

  const linkSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Projects", href: "#projects" },
        { label: "Foundations", href: "#foundations" },
      ],
    },
    {
      title: "Projects",
      links: [
        { label: "BlogByte Blog", href: "https://blogbyte-blog.onrender.com" },
        {
          label: "Gradient Craft",
          href: "https://shaik-nagur-basha.github.io/Gradient-Craft",
        },
        {
          label: "DevMatrix",
          href: "https://shaik-nagur-basha.github.io/DevMatrix",
        },
        {
          label: "NeoChat",
          href: "https://neochat-sk.onrender.com",
        },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Web Development", href: "#contact" },
        { label: "UI/UX Design", href: "#contact" },
        { label: "Backend Development", href: "#contact" },
        { label: "Consulting", href: "#contact" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "+91 6302504034", href: "tel:+916302504034" },
        { label: "sknbasknba@gmail.com", href: "mailto:sknbasknba@gmail.com" },
        {
          label: "Badvel, Kadapa, Andhra Pradesh, 516227",
          href: "https://maps.app.goo.gl/b5FJS9nsc9etuV5f7",
        },
        { label: "Contact Form", href: "#contact" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/Shaik-Nagur-Basha",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nagur-basha",
    },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Mail, label: "Email", href: "mailto:sknbasknba@gmail.com" },
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="footer" />
      ) : (
        <footer className="footer-wrapper rounded-tl-2xl rounded-tr-2xl">
          <div
            className={`absolute top-0 w-full h-1 ${darkMode ? "bg-linear-to-r from-blue-800 via-purple-800 to-cyan-800" : "bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500"}`}
          ></div>
          <style>{styles}</style>

          <div className="footer-content">
            {/* Brand Section */}
            <div className="w-full gap-14 max-[1072px]:flex-col flex">
              <div className="flex flex-wrap gap-4 justify-between min-[1072px]:w-3/4">
                {linkSections.map((section) => (
                  <div key={section.title} className="footer-section max-w-fit">
                    <h3 className="footer-title">{section.title}</h3>
                    <nav className="footer-links">
                      {section.links.map((link) => (
                        <a
                          key={link.label}
                          href={
                            link.href === "#projects"
                              ? "/nagur.dev/projects"
                              : link.href
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-link"
                        >
                          <ArrowUpRight size={14} />
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
              <div className="footer-section min-[1060px]:w-1/4 max-[1072px]:mx-auto">
                <h2 className="footer-title">Portfolio</h2>
                <p className="footer-description">
                  MERN full stack web developer focused on building fast,
                  accessible, and visually refined web experiences with modern
                  technologies.
                </p>
                <div className="social-links">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                        aria-label={social.label}
                        title={social.label}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="footer-divider"></div>

            {/* Bottom Section */}
            <div className="footer-bottom">
              <div className="bottom-row">
                <p className="copyright">
                  &copy; {currentYear} Made with
                  <Heart
                    size={14}
                    className="text-red-500 cursor-pointer animate-pulse"
                  />{" "}
                  by{" "}
                  <span className="bg-linear-to-r from-blue-600 to-purple-600 cursor-pointer bg-clip-text text-transparent animate-pulse">
                    Sk Nagur Basha
                  </span>
                </p>
                <nav className="footer-links-bottom">
                  <a href="#privacy">Privacy Policy</a>
                  <a href="#terms">Terms of Service</a>
                  <a href="#cookies">Cookie Policy</a>
                </nav>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default Footer;
