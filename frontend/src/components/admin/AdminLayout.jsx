import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Mail, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Projects", path: "/admin/projects", icon: FolderKanban },
    { name: "Contacts", path: "/admin/contacts", icon: Mail },
    { name: "Security", path: "/admin/security", icon: ShieldAlert },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] flex font-outfit text-slate-900 dark:text-slate-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 transform",
          !isSidebarOpen && "-translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-blue-600 mr-3 shrink-0" />
            {isSidebarOpen && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                Admin CMS
              </span>
            )}
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  location.pathname === item.path
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isSidebarOpen ? "mr-4" : "mx-auto")} />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            {isSidebarOpen ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                    {user?.name?.[0] || "A"}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6 lg:hidden" /> : <Menu className="w-6 h-6" />}
              <span className="hidden lg:block">{isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</span>
            </button>
            <h1 className="text-xl font-bold hidden sm:block">
              {menuItems.find((m) => m.path === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Site
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
