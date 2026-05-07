import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FolderKanban, 
  Mail, 
  Eye, 
  TrendingUp, 
  Plus, 
  Clock,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { projects, contacts, fetchProjects, fetchContacts, loading } = useAdminStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProjects();
    fetchContacts();
  }, [fetchProjects, fetchContacts]);

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "blue",
      change: "+2 this month",
    },
    {
      label: "Contact Messages",
      value: contacts.length,
      icon: Mail,
      color: "purple",
      change: `${contacts.filter(c => c.status === "Unread").length} unread`,
    },
    {
      label: "Site Status",
      value: "Online",
      icon: Eye,
      color: "orange",
      change: "Public access live",
    },
    {
      label: "Active Session",
      value: "Live",
      icon: Clock,
      color: "emerald",
      change: "Stable connection",
    },
  ];

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800"></div>
          ))}
        </div>
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Hey, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Here's what's happening with your portfolio today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
              <div className="flex items-center text-xs font-semibold text-emerald-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Content & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">Recent Projects</h3>
              <Link to="/admin/projects" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="p-4">
              {projects.length === 0 ? (
                <div className="py-20 text-center">
                  <FolderKanban className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">No projects found. Start by adding one!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          {project.mediaType === "image" ? (
                            <img src={project.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">VIDEO</div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{project.title}</h4>
                          <p className="text-xs text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === "Published" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-orange-50 text-orange-600 dark:bg-orange-900/20"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity / Contacts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">New Messages</h3>
              <Link to="/admin/contacts" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="p-4">
              {contacts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">No messages yet.</div>
              ) : (
                <div className="space-y-4">
                  {contacts.slice(0, 4).map((contact) => (
                    <div key={contact._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-blue-500/20 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          {contact.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate">{contact.name}</p>
                          <p className="text-[10px] text-slate-500">{new Date(contact.submittedAt).toLocaleDateString()}</p>
                        </div>
                        {contact.status === "Unread" && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{contact.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Admin Profile Mini Card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <ShieldCheck className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-1">Portfolio Admin</h3>
              <p className="text-blue-100 text-sm mb-6">You have full control over your digital footprint.</p>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md">Secure Login</div>
                <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md">JWT Protected</div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
