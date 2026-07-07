import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Mail, Plus, ShieldCheck, Activity } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "../../utils/cn";

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { projects, contacts, fetchProjects, fetchContacts, loading } =
    useAdminStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchContacts();
  }, [fetchProjects, fetchContacts]);

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 glass-panel rounded-2xl" />
          ))}
        </div>
        <div className="h-96 glass-panel rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hey, {user.name}! 👋
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Portfolio control center overview.
          </p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            navigate("/admin/projects", { state: { openForm: !isFormOpen } });
          }}
          className="rotating-gradient-card new-project"
        >
          <span>
            <Plus className="w-4 h-4" />
            {isFormOpen ? "All Projects" : "New Project"}
          </span>
        </button>
      </div>

      {/* Key Metrics Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all"
        >
          <div className="p-1 rounded bg-blue-500/20 text-blue-500">
            <FolderKanban className="w-3 h-3" />
          </div>
          <span className="text-[11px] font-bold text-blue-300">
            {projects.length} Projects
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all"
        >
          <div className="p-1 rounded bg-purple-500/20 text-purple-500">
            <Mail className="w-3 h-3" />
          </div>
          <span className="text-[11px] font-bold text-purple-300">
            {contacts.length} Messages
          </span>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Recent Projects */}
        <div className="glass-panel rounded-xl sm:rounded-3xl overflow-hidden h-full flex flex-col">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <h3 className="sm:text-sm text-xs font-bold uppercase tracking-widest">
                Recent Activity
              </h3>
            </div>
            <Link
              to="/admin/projects"
              className="sm:text-xs text-[10px] font-bold text-blue-500 hover:text-blue-400"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project._id}
                onClick={() =>
                  navigate("/projects/" + project.slug, {
                    state: { fromAdmin: true },
                  })
                }
                className="flex items-center justify-between p-2 sm:p-4 hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <div
                    className={`w-16 border-white/10 bg-white/5 aspect-video shrink-0 shadow-sm shadow-gray-950/75 overflow-hidden border transition-all duration-300`}
                  >
                    {project.mediaType === "video" && project.video ? (
                      <video
                        src={project.video}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : project.image || project.thumbnail ? (
                      <img
                        src={project.image || project.thumbnail}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={cn(
                          "w-full h-full flex items-center justify-center",
                          project.featured
                            ? "bg-amber-500/10"
                            : "bg-cyan-500/10",
                        )}
                      >
                        <FolderKanban
                          className={cn(
                            "w-4 h-4",
                            project.featured
                              ? "text-amber-500"
                              : "text-cyan-500",
                          )}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "sm:text-sm line-clamp-1 text-xs font-bold transition-colors",
                        project.featured ? "text-amber-400" : "text-cyan-400",
                      )}
                    >
                      {project.title}
                    </h4>
                    <div className="flex gap-2 mt-1 justify-baseline items-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      {project.category && (
                        <span
                          className={`tech-badge px-1.5 border border-dashed rounded text-[8px] font-mono tracking-wider transition-all duration-300 ${
                            project.featured
                              ? "text-amber-400 border-amber-500/40 bg-amber-400/10"
                              : "text-cyan-400 border-cyan-500/40 bg-cyan-400/10"
                          }`}
                        >
                          {project.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {project.status === "Draft" && (
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-semibold border border-dashed uppercase tracking-widest bg-orange-500/10 text-orange-500",
                      )}
                    >
                      {project.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {projects.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-xs text-slate-500">No activity yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages & Security */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl sm:rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <h3 className="sm:text-sm text-xs font-bold uppercase tracking-widest">
                  Inbox
                </h3>
              </div>
              <Link
                to="/admin/contacts"
                className="sm:text-xs text-[10px] font-bold text-purple-500 hover:text-purple-400"
              >
                VIEW ALL
              </Link>
            </div>
            <div className="flex-1 overflow-auto">
              {contacts.slice(0, 4).map((contact) => (
                <div
                  key={contact._id}
                  onClick={() =>
                    navigate("/admin/contacts", {
                      state: { selectId: contact._id },
                    })
                  }
                  className="flex items-center justify-between p-2 sm:p-4 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-500/50 transition-all shrink-0">
                      <div className="w-full h-full flex items-center justify-center bg-purple-500/10 text-purple-500 font-bold">
                        {contact.name[0]}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-purple-500 transition-colors">
                        {contact.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 tracking-wider line-clamp-1">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {contact.status === "Unread" ? (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase border border-dashed tracking-widest bg-amber-400/10 text-amber-400">
                        UNREAD
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-center py-8 text-xs text-slate-500">
                  No messages
                </p>
              )}
            </div>
          </div>

          {/* Security Status moved to AdminLayout (sidebar) */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
