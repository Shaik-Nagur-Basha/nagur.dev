import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  FolderKanban,
  X,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import ProjectForm from "../../components/admin/ProjectForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { toast } from "react-toastify";
import { cn } from "../../utils/cn";

const ProjectManagement = () => {
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(
    location?.state?.openForm || false,
  );
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { projects, fetchProjects, deleteProject, loading } = useAdminStore();
  const [expandedId, setExpandedId] = useState(null);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (-(y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", `0deg`);
    card.style.setProperty("--rotate-y", `0deg`);
  };

  const handleExpandClick = (e, id) => {
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Reset state after navigation
  useEffect(() => {
    if (location?.state?.openForm) {
      setIsFormOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDelete = async (id) => {
    // open confirm modal instead of native confirm
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setConfirmOpen(false);
    const result = await deleteProject(pendingDeleteId);
    setPendingDeleteId(null);
    if (result.success) toast.success("PROJECT DELETED");
    else toast.error(result.error);
  };

  const q = searchQuery.trim().toLowerCase();

  const filteredProjects = !q
    ? projects
    : projects.filter((p) => {
        const inTitle = p.title?.toLowerCase().includes(q);
        const inCategory = p.category?.toLowerCase().includes(q);
        const inDescription = p.description?.toLowerCase().includes(q);
        const inTags = Array.isArray(p.tags)
          ? p.tags.some((t) => String(t).toLowerCase().includes(q))
          : false;

        return inTitle || inCategory || inDescription || inTags;
      });

  // Highlight matching query substrings in text
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightText = (text = "", query) => {
    if (!query) return text;
    try {
      const re = new RegExp(`(${escapeRegExp(query)})`, "gi");
      const parts = String(text).split(re);
      return parts.map((part, i) =>
        re.test(part) ? (
          <span key={i} className="bg-yellow-300 text-slate-900 px-1 rounded">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      );
    } catch (e) {
      return text;
    }
  };

  const projectCardStyle = `
    @keyframes rotate-gradient { to { --gradient-angle: 360deg; } }
    @keyframes glow-pulse { 0%,100%{opacity:0.15;transform:scale(1);}50%{opacity:0.25;transform:scale(1.05);} }
    @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    .ripple { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0)); pointer-events: none; animation: ripple 0.6s ease-out; }
    .project-card-grid { --mouse-x: 50%; --mouse-y: 50%; perspective: 1200px; transition: transform 0.1s ease-out; }
    .project-card-inner { position: relative; height: 100%; width: 100%; transition: all 0.5s cubic-bezier(0.23,1,0.32,1); transform-style: preserve-3d; background: rgba(15,23,42,0.45); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); box-shadow: 0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.45);}
    .project-card-inner::before { content: ""; position: absolute; inset: 0; background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.04), transparent 40%); z-index:3; pointer-events:none; }
    .project-card-inner::after { content: ""; position: absolute; inset: -1px; z-index: -1; border-radius: inherit; animation: rotate-gradient 4s linear infinite; opacity: 0; transition: opacity .3s; }
    .project-card-grid:hover .project-card-inner::after { opacity: 1; }
    .project-card-grid:hover .project-card-inner { transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));  box-shadow: 0 14px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.55);}
    .tech-badge { transform: translateZ(20px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
  `;

  return (
    <div className="">
      <style>{projectCardStyle}</style>
      {/* Action Bar (hidden when form is open) */}
      <div
        className={`flex pb-8 flex-row items-center justify-between gap-4 glass-panel !border-0 !bg-transparent rounded-2xl ${
          isFormOpen ? "hidden" : ""
        }`}
      >
        {/* Search (left) */}
        <div className="flex-1">
          <div className="relative w-full md:max-w-[720px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="SEARCH ASSETS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-b border-white/20  bg-transparent pl-9 pr-9 py-2 text-[13px] text-white/85 placeholder:text-slate-600 transition-colors duration-150 outline-none focus:outline-0 focus-visible:outline-0 ring-0 focus:ring-0 focus-visible:ring-0 whiteblink-remover"
              aria-label="Search assets"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 p-1 text-slate-500 hover:text-slate-400 transition-colors duration-150"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Action (right) */}
        <div className="flex items-center gap-3 w-fit">
          <button
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
            className="rotating-gradient-card new-project border-none shadow-none ring-0 outline-none !px-3 sm:!px-6"
          >
            <span>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel !bg-transparent !border-0"
          >
            <div className="flex items-center bg-transparent justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                  {editingProject
                    ? "Reconfigure Asset"
                    : "Initialize New Asset"}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 bg-white/10 rounded-xl transition-all text-slate-500 cursor-pointer border border-gray-600/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProjectForm
              project={editingProject}
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingProject(null);
                fetchProjects();
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="project-card-grid relative p-2 rounded-2xl overflow-hidden group h-80 cursor-pointer"
              >
                <div className="project-card-inner shadow-md rounded-2xl overflow-hidden flex flex-col relative h-full">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" />

                  {project.mediaType === "video" || project.video ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={project.video} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={project.image || project.thumbnail}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  <div
                    className={`absolute inset-0 z-10 transition-opacity duration-300 ${expandedId === project._id ? "bg-black/70" : ""}`}
                  />

                  <div
                    className={`relative z-20 transition-all duration-500 flex flex-col ${expandedId === project._id ? "h-full p-6 backdrop-blur-md rounded-2xl" : "mt-auto hidden lg:flex group-hover:flex pl-3 pb-1 bg-black/40"}`}
                    onClick={(e) => handleExpandClick(e, project._id)}
                  >
                    <h3
                      className={`text-lg tracking-wide font-black transition-colors duration-300 ${expandedId === project._id ? "text-cyan-400 mb-3" : "text-white mb-1"}`}
                    >
                      {highlightText(project.title, q)}
                    </h3>

                    {expandedId === project._id ? (
                      <div className="flex flex-col h-full space-y-4">
                        <p className="text-gray-300 text-sm font-medium">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {(project.tags || project.skills || []).map(
                            (tag, idx) => (
                              <span
                                key={idx}
                                className="tech-badge px-3 py-1 bg-white/10 text-cyan-400 rounded-full text-[10px] font-bold border border-cyan-400/30"
                              >
                                {tag}
                              </span>
                            ),
                          )}
                        </div>

                        <div className="flex gap-2.5 mt-auto">
                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative px-3 py-2 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1.5 text-xs font-medium backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 text-cyan-500 hover:text-cyan-400"
                            >
                              <ExternalLink
                                size={16}
                                className="transition-all duration-300 group-hover:scale-110"
                              />
                              <span className="hidden sm:inline">DEMO</span>
                            </a>
                          )}
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative px-3 py-2 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1.5 text-xs font-mono font-medium backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 text-cyan-500 hover:text-cyan-400"
                            >
                              <Github
                                size={16}
                                className="transition-all duration-300 group-hover:scale-110"
                              />
                              <span className="hidden sm:inline">CODE</span>
                            </a>
                          )}
                          <div className="ml-auto flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProject(project);
                                setIsFormOpen(true);
                              }}
                              className="px-3 py-2 rounded cursor-pointer bg-white/8 text-white text-sm font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project._id);
                              }}
                              className="px-3 py-2 rounded cursor-pointer bg-red-600 text-white text-sm font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center cursor-pointer pl-3 pb-0.5 gap-0.5 text-cyan-500 font-bold text-[10px] tracking-widest">
                        EXPLORE PROJECT
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
};

export default ProjectManagement;
