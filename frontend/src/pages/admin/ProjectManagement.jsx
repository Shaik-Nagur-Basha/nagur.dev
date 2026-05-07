import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Github,
  FolderKanban,
  AlertCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import ProjectForm from "../../components/admin/ProjectForm";
import { toast } from "react-toastify";

const ProjectManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { projects, fetchProjects, deleteProject, loading } = useAdminStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const result = await deleteProject(id);
      if (result.success) {
        toast.success("Project deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete project");
      }
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{editingProject ? "Edit Project" : "Create New Project"}</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
              >
                <X className="w-6 h-6" />
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
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image/Video Preview */}
                <div className="relative h-56 overflow-hidden">
                  {project.mediaType === "image" ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <video
                      src={project.video}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      muted
                      loop
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => e.target.pause()}
                    />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setIsFormOpen(true);
                        }}
                        className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                      project.status === "Published" ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10" : "text-orange-500 bg-orange-50 dark:bg-orange-900/10"
                    }`}>
                      {project.status}
                    </span>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-800">
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-800">
                        +{project.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                      <Github className="w-4 h-4 mr-1.5" /> Code
                    </a>
                    {project.demoLink && (
                      <a href={project.demoLink} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4 mr-1.5" /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredProjects.length === 0 && !loading && (
              <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FolderKanban className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">No projects found</h3>
                <p className="text-slate-500">Try adjusting your search or add a new project.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export default ProjectManagement;
