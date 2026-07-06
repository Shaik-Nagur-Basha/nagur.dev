import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Plus,
  User,
  ListOrdered,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { useProfileStore } from "../../store/useProfileStore";
import { cn } from "../../utils/cn";
import Logo from "../Logo";
import ProjectOrderModal from "./ProjectOrderModal";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  // null | "featured" | "nonfeatured"
  const [orderModalMode, setOrderModalMode] = useState(null);
  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Profile", path: "/admin/profile", icon: User },
    { name: "Projects", path: "/admin/projects", icon: FolderKanban },
    { name: "Inbox", path: "/admin/contacts", icon: Mail },
    { name: "Security", path: "/admin/security", icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="dark min-h-screen bg-[#020617] text-slate-100 flex font-outfit overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="sticky top-0 h-screen z-50 w-16 lg:w-64 glass-panel !border-r-0 transition-all duration-300 flex flex-col shrink-0 relative after:absolute after:top-20 after:right-0 after:bottom-0 after:w-[1px] after:bg-white/10">
        <div className="h-16 flex items-center px-4 lg:px-6 border-white/5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 opacity-80 transition-opacity hover:opacity-100 group"
          >
            <Logo theme="golden" />
            <span className="text-base lg:text-lg font-black tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden lg:block">
              {profile?.title || "nagur.dev"}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 lg:px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 lg:px-4 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                )}
              >
                <item.icon className="w-4 h-4 shrink-0 mx-auto lg:mx-0 lg:mr-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest hidden lg:block">
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Security Status (desktop only) */}
        <div className="hidden lg:block px-3 my-2">
          <div className="glass-panel !border-0 rounded-2xl overflow-hidden relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-xs font-semibold uppercase tracking-widest">
                    Security Status
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mb-2">
                System Protection Overview
              </p>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase text-slate-400 bg-white/3 px-2 py-1 rounded">
                  SSL
                </div>
                <div className="text-[10px] font-bold uppercase text-slate-400 bg-white/3 px-2 py-1 rounded">
                  JWT
                </div>
                <div className="text-[10px] font-bold uppercase text-slate-400 bg-white/3 px-2 py-1 rounded">
                  DB
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border-0 border-emerald-500/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    SECURE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-3 border-white/5 mt-auto">
          {/* Desktop User Card */}
          <div className="hidden lg:block p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[14px] font-black shadow-inner">
                <span className="bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {user?.name?.[0] || "S"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs truncate tracking-wider">{user?.name}</p>
                <p className="text-[9px] text-cyan-500 uppercase tracking-widest">
                  Admin
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 cursor-pointer rounded-lg bg-red-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-black/40"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Disconnect
            </button>
          </div>

          {/* Collapsed User Icon/Logout */}
          <div className="lg:hidden flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[12px] font-black shadow-inner">
              <span className="bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {user?.name?.[0] || "S"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex cursor-pointer items-center justify-center p-3 text-slate-400 hover:text-red-500 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        {/* Inverted corner transition */}
        <svg className="absolute top-16 left-0 w-4 h-4 pointer-events-none z-50" viewBox="0 0 16 16" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
          <path d="M 0 0 L 16 0 Q 0 0 0 16 Z" fill="rgba(255, 255, 255, 0.03)" />
          <path d="M 0 16 Q 0 0 16 0" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
        </svg>

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 glass-panel z-40 shrink-0 !border-l-0 !border-b-0 relative after:absolute after:bottom-0 after:left-4 after:right-0 after:h-[1px] after:bg-white/10">
          <div className="flex items-center gap-4">
            <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-100 mr-2">
              {menuItems.find((m) => m.path === location.pathname)?.name ||
                "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Featured Order Button — amber */}
            <button
              onClick={() => setOrderModalMode("featured")}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer border bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400/60 shadow-md shadow-amber-500/10 hover:-translate-y-0.5 active:scale-95"
              title="Change Featured Projects Order"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden md:inline text-nowrap">Featured Order</span>
            </button>

            {/* Non-Featured Order Button — cyan */}
            <button
              onClick={() => setOrderModalMode("nonfeatured")}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer border bg-cyan-500/15 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400/60 shadow-md shadow-cyan-500/10 hover:-translate-y-0.5 active:scale-95"
              title="Change Non-Featured Projects Order"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-nowrap">Standard Order</span>
            </button>
            {!(
              location.pathname === "/admin" ||
              location.pathname.startsWith("/admin/projects")
            ) && (
              <button
                onClick={() =>
                  navigate("/admin/projects", { state: { openForm: true } })
                }
                className="rotating-gradient-card new-project !px-3 sm:!px-6"
                title="New Project"
              >
                <span>
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline text-nowrap">New Project</span>
                </span>
              </button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rotating-gradient-card live-site !px-3 sm:!px-6"
            >
              <span>
                <ExternalLink className="w-4 h-4" />
                <span className="hidden md:inline text-nowrap">Live Site</span>
              </span>
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-6 px-2 lg:p-10 custom-scrollbar scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>

        <ProjectOrderModal
          isOpen={orderModalMode !== null}
          onClose={() => setOrderModalMode(null)}
          mode={orderModalMode || "featured"}
        />
      </main>
    </div>
  );
};

export default AdminLayout;
