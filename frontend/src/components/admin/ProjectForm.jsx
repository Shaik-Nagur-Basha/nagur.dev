import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Github, 
  ExternalLink,
  Loader2,
  Trash2,
  Tag,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import { toast } from "react-toastify";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}


const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  category: z.string().min(2, "Category is required"),
  githubLink: z.string().url("Valid GitHub link is required"),
  demoLink: z.string().url("Valid Demo link is required").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["Draft", "Published"]),
  mediaType: z.enum(["image", "video"]),
});

const ProjectForm = ({ project = null, onSuccess }) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(project?.image || project?.video || null);
  const [skills, setSkills] = useState(project?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef(null);
  const { createProject, updateProject, loading } = useAdminStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      status: "Draft",
      mediaType: "image",
      featured: false,
    },
  });

  const selectedMediaType = watch("mediaType");

  useEffect(() => {
    if (project) {
      setSkills(project.skills);
      setMediaPreview(project.mediaType === "image" ? project.image : project.video);
    }
  }, [project]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (selectedMediaType === "image" && !file.type.startsWith("image/")) {
        return toast.error("Please select an image file");
      }
      if (selectedMediaType === "video" && !file.type.startsWith("video/")) {
        return toast.error("Please select a video file");
      }

      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const value = skillInput.trim();
      if (value && !skills.includes(value)) {
        setSkills([...skills, value]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (!mediaPreview && !mediaFile) {
      return toast.error("Media is required");
    }
    if (skills.length === 0) {
      return toast.error("At least one skill is required");
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    
    if (mediaFile) {
      formData.append("media", mediaFile);
    }
    
    // Append skills array
    skills.forEach((skill) => formData.append("skills[]", skill));

    let result;
    if (project) {
      result = await updateProject(project._id, formData);
    } else {
      result = await createProject(formData);
    }

    if (result.success) {
      toast.success(`Project ${project ? "updated" : "created"} successfully!`);
      onSuccess();
    } else {
      toast.error(result.error || "Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: General Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center text-xs">01</span>
              General Details
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Project Title</label>
              <input
                {...register("title")}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Nagur.dev Portfolio"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category</label>
              <input
                {...register("category")}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Full Stack, Web Design"
              />
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Description</label>
              <textarea
                {...register("description")}
                rows={5}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Tell something amazing about this project..."
              ></textarea>
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Skills & Tools</label>
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                  {skills.map((skill, index) => (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-100 dark:border-blue-800/50"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(index)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Type skill and press Enter..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Media & Links */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center text-xs">02</span>
              Media & Assets
            </h3>

            <div className="flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setValue("mediaType", "image");
                  setMediaFile(null);
                  if (!project) setMediaPreview(null);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm",
                  selectedMediaType === "image" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"
                )}
              >
                <ImageIcon className="w-4 h-4" />
                Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("mediaType", "video");
                  setMediaFile(null);
                  if (!project) setMediaPreview(null);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm",
                  selectedMediaType === "video" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"
                )}
              >
                <Video className="w-4 h-4" />
                Video
              </button>
            </div>

            <div 
              onClick={() => fileInputRef.current.click()}
              className="group relative h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={selectedMediaType === "image" ? "image/*" : "video/*"}
                onChange={handleMediaChange}
              />
              
              {mediaPreview ? (
                <div className="w-full h-full relative">
                  {selectedMediaType === "image" ? (
                    <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <video src={mediaPreview} className="w-full h-full object-cover" muted />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold flex items-center gap-2">
                      <Upload className="w-5 h-5" /> Change Media
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-600 dark:text-slate-400">Click to upload {selectedMediaType}</p>
                    <p className="text-xs">Drag and drop supported</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">GitHub Repo</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register("githubLink")}
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="https://github.com/..."
                  />
                </div>
                {errors.githubLink && <p className="text-xs text-red-500 mt-1">{errors.githubLink.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Live Demo</label>
                <div className="relative">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register("demoLink")}
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
                {errors.demoLink && <p className="text-xs text-red-500 mt-1">{errors.demoLink.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center text-xs">03</span>
              Visibility & Status
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Featured Project</p>
                    <p className="text-xs text-slate-500">Show this on homepage</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-6 h-6 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Publish Status</label>
                <select
                  {...register("status")}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-8 py-4 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center min-w-[200px]"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            project ? "Update Project" : "Publish Project"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
