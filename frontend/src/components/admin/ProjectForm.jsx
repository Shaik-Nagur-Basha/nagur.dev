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
  Tag,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import { toast } from "react-toastify";
import { cn } from "../../utils/cn";

const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  category: z.string().min(2, "Category is required"),
  githubLink: z.string().url("Valid GitHub link is required"),
  demoLink: z
    .string()
    .url("Valid Demo link is required")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["Draft", "Published"]),
  mediaType: z.enum(["image", "video"]),
});

const ProjectForm = ({ project = null, onSuccess }) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(
    project?.image || project?.video || null,
  );
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
  const featuredValue = watch("featured");
  const statusValue = watch("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setStatusOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (project) {
      setSkills(project.skills);
      setMediaPreview(
        project.mediaType === "image" ? project.image : project.video,
      );
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
      reader.onloadend = () => setMediaPreview(reader.result);
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

  const onSubmit = async (data) => {
    if (!mediaPreview && !mediaFile) return toast.error("Media is required");
    if (skills.length === 0) return toast.error("Skills required");

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (mediaFile) formData.append("media", mediaFile);
    skills.forEach((skill) => formData.append("skills[]", skill));

    const result = project
      ? await updateProject(project._id, formData)
      : await createProject(formData);

    if (result.success) {
      toast.success(`Project ${project ? "updated" : "created"}`);
      onSuccess();
    } else {
      toast.error(result.error || "Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
              <Plus className="w-3 h-3" /> Identity
            </h3>

            <div className="space-y-3">
              <div className="floating-label-group">
                <Plus className="input-icon w-4 h-4" />
                <input {...register("title")} placeholder=" " id="title" />
                <label htmlFor="title">Project Title</label>
                {errors.title && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="floating-label-group">
                <Tag className="input-icon w-4 h-4" />
                <input
                  {...register("category")}
                  placeholder=" "
                  id="category"
                />
                <label htmlFor="category">Category</label>
              </div>

              <div className="">
                <label htmlFor="description" className="opacity-55">
                  Brief / Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder=" "
                  id="description"
                  rows={6}
                  className="w-full border-0 border-b border-gray-700 focus:ring-0 focus-visible:ring-0 focus:outline-none outline-none whiteblink-remover"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Stack
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold flex items-center gap-1.5"
                    >
                      {skill}
                      <X
                        onClick={() =>
                          setSkills(skills.filter((_, idx) => idx !== i))
                        }
                        className="w-2.5 h-2.5 cursor-pointer hover:text-red-500"
                      />
                    </span>
                  ))}
                </div>
                <div className="floating-label-group">
                  <Tag className="input-icon w-4 h-4" />
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder=" "
                    id="skillInput"
                  />
                  <label htmlFor="skillInput">Add Tech (press Enter)</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 mb-4 flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Media
            </h3>

            <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/5">
              {["image", "video"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue("mediaType", type)}
                  className={cn(
                    "flex-1 py-2 rounded-lg cursor-pointer text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedMediaType === type
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-slate-500 hover:text-slate-300",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            <div
              onClick={() => fileInputRef.current.click()}
              className="group relative h-48 border-2 border-dashed border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all bg-white/5"
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
                    <img
                      src={mediaPreview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Update File
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <Upload className="w-6 h-6 mb-1" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Upload Asset
                  </p>
                </div>
              )}
            </div>

            <div className="">
              <div className="floating-label-group">
                <Github className="input-icon w-4 h-4" />
                <input
                  {...register("githubLink")}
                  placeholder=" "
                  id="githubLink"
                />
                <label htmlFor="githubLink">Repository URL</label>
              </div>
              <div className="floating-label-group !m-0">
                <ExternalLink className="input-icon w-4 h-4" />
                <input
                  {...register("demoLink")}
                  placeholder=" "
                  id="demoLink"
                />
                <label htmlFor="demoLink">Live Demo URL</label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative  cursor-pointer">
                  <input
                    {...register("featured")}
                    id="featured"
                    type="checkbox"
                    className="sr-only"
                  />
                  <div
                    aria-hidden
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors",
                      featuredValue ? "bg-blue-500" : "bg-white/6",
                    )}
                  />
                  <div
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 w-6 h-6 bg-white/75 rounded-full shadow transform transition-transform",
                      featuredValue ? "translate-x-4" : "translate-x-0",
                    )}
                  />
                </div>
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                >
                  Featured
                </label>
              </div>

              <div className="w-40 relative" ref={statusRef}>
                <button
                  type="button"
                  onClick={() => setStatusOpen((s) => !s)}
                  className="modern-select flex items-center justify-between cursor-pointer focus:ring-0 focus-visible:ring-0 focus:outline-none outline-none border-0 text-gray-300"
                  aria-haspopup="listbox"
                  aria-expanded={statusOpen}
                >
                  <span className="text-sm">{statusValue || "Draft"}</span>
                  <svg
                    className="w-3 h-3 opacity-80"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {statusOpen && (
                  <ul
                    role="listbox"
                    aria-label="Status"
                    className="custom-dropdown-list"
                  >
                    {["Draft", "Published"].map((opt) => (
                      <li
                        key={opt}
                        role="option"
                        aria-selected={statusValue === opt}
                        onClick={() => {
                          setValue("status", opt);
                          setStatusOpen(false);
                        }}
                        className={cn(
                          "custom-dropdown-item",
                          statusValue === opt ? "selected" : "",
                        )}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="btn-secondary cursor-pointer px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em]"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="btn-gradient cursor-pointer flex items-center gap-2 px-6 py-2 w-full sm:w-auto justify-center disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.12em]">
                {project ? "Execute Update" : "Deploy Asset"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
