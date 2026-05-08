import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../utils/cn";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Projects", path: "/admin/projects", icon: FolderKanban },
    { name: "Inbox", path: "/admin/contacts", icon: Mail },
    { name: "Security", path: "/admin/security", icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex font-outfit overflow-hidden">
      {/* SVG Gradient Definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id="brand-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="sticky top-0 h-screen z-50 w-16 lg:w-64 glass-panel border-r border-white/5 transition-all duration-300 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 lg:px-6 border-b border-white/5">
          <div className="w-10 h-10 flex items-center justify-center shrink-0 mx-auto lg:mx-0">
            <Cpu
              className="w-6 h-6 transition-all duration-300"
              style={{ stroke: "url(#brand-gradient)" }}
            />
          </div>
          <span className="ml-2 text-sm font-black tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden lg:block">
            nagur.dev
          </span>
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
        <div className="hidden lg:block px-3 my-4">
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
        <div className="p-3 border-t border-white/5 mt-auto">
          {/* Desktop User Card */}
          <div className="hidden lg:block p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[14px] font-black shadow-inner">
                <span className="bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {user?.name?.[0] || "S"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold truncate">{user?.name}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-tighter">
                  Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 cursor-pointer rounded-lg bg-red-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
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
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 glass-panel z-40 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-100">
              {menuItems.find((m) => m.path === location.pathname)?.name ||
                "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {!(
              location.pathname === "/admin" ||
              location.pathname.startsWith("/admin/projects")
            ) && (
              <button
                onClick={() =>
                  navigate("/admin/projects", { state: { openForm: true } })
                }
                className="rotating-gradient-card new-project mr-3 !px-3 sm:!px-6"
                title="New Project"
              >
                <span>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Project</span>
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
                <span className="hidden sm:inline">Live Site</span>
              </span>
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
