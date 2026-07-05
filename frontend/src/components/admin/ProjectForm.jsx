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
  Hash,
  ListTodo,
  Cpu,
  CheckSquare,
  Info,
  Images,
  FolderKanban,
  FileText,
  GripVertical,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import { cn } from "../../utils/cn";

const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z
    .string()
    .min(5, "Short description is required")
    .max(250, "Short description must be under 250 characters"),
  description: z.string().min(10, "Description is required"),
  category: z.string().optional().or(z.literal("")),
  githubLink: z
    .string()
    .url("Valid GitHub link is required")
    .optional()
    .or(z.literal("")),
  demoLink: z
    .string()
    .url("Valid Demo link is required")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["Draft", "Published"]),
  mediaType: z.enum(["image", "video"]),
  order: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().nonnegative("Order must be a positive number").default(0)
  ),
});

const ProjectForm = ({ project = null, onSuccess }) => {
  const { darkMode } = useTheme();
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(
    project?.image || project?.video || null,
  );
  
  // Dynamic Array States
  const [skills, setSkills] = useState(project?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  
  // Array states with unique IDs for Framer Motion Reordering
  const [featuresList, setFeaturesList] = useState(
    (project?.featuresList || []).map((item, idx) => ({
      ...item,
      id: item._id || `feat-${idx}-${Date.now()}-${Math.random()}`,
    }))
  );
  const [gallery, setGallery] = useState(
    (project?.gallery || []).map((item, idx) => ({
      ...item,
      id: item._id || `gal-${idx}-${Date.now()}-${Math.random()}`,
    }))
  );
  const [techStackDetails, setTechStackDetails] = useState(
    (project?.techStackDetails || []).map((item, idx) => ({
      ...item,
      id: item._id || `cat-${idx}-${Date.now()}-${Math.random()}`,
    }))
  );

  // Toggles for adding tags
  const [showAddCoreTag, setShowAddCoreTag] = useState(false);
  const [activeAddTagCatIdx, setActiveAddTagCatIdx] = useState(null);

  // Active dragging item tracker
  const [draggingId, setDraggingId] = useState(null);

  // Screen size detection to enable/disable drag-and-drop
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
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
      order: 0,
    },
  });

  const selectedMediaType = watch("mediaType");
  const featuredValue = watch("featured");
  const statusValue = watch("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef(null);

  const watchTitle = watch("title");
  useEffect(() => {
    if (!project && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [watchTitle, project, setValue]);

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
      setSkills(project.skills || []);
      setFeaturesList(
        (project.featuresList || []).map((item, idx) => ({
          ...item,
          id: item._id || `feat-${idx}-${Date.now()}-${Math.random()}`,
        }))
      );
      setGallery(
        (project.gallery || []).map((item, idx) => ({
          ...item,
          id: item._id || `gal-${idx}-${Date.now()}-${Math.random()}`,
        }))
      );
      setTechStackDetails(
        (project.techStackDetails || []).map((item, idx) => ({
          ...item,
          id: item._id || `cat-${idx}-${Date.now()}-${Math.random()}`,
        }))
      );
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
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = skillInput.trim();
      if (value && !skills.includes(value)) {
        setSkills([...skills, value]);
        setSkillInput("");
      }
    }
  };

  // Features List Handlers (Prepending to appear on top)
  const addFeature = () => {
    setFeaturesList([
      { id: `feat-new-${Date.now()}-${Math.random()}`, title: "", description: "" },
      ...featuresList,
    ]);
  };
  const removeFeature = (idx) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };
  const updateFeature = (idx, field, value) => {
    const updated = [...featuresList];
    updated[idx][field] = value;
    setFeaturesList(updated);
  };

  // Gallery Handlers (Prepend local image files selected from system)
  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newItems = [];
    let processedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newItems.push({
          id: `gal-new-${Date.now()}-${Math.random()}`,
          url: reader.result,
          caption: "",
        });
        processedCount++;
        if (processedCount === files.length) {
          setGallery([...newItems, ...gallery]);
          e.target.value = "";
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryItem = (idx) => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };
  const updateGalleryItem = (idx, field, value) => {
    const updated = [...gallery];
    updated[idx][field] = value;
    setGallery(updated);
  };

  // Tech Stack Details Handlers (Prepending to appear on top)
  const addTechCategory = () => {
    setTechStackDetails([
      { id: `cat-new-${Date.now()}-${Math.random()}`, category: "", items: [] },
      ...techStackDetails,
    ]);
  };
  const removeTechCategory = (idx) => {
    setTechStackDetails(techStackDetails.filter((_, i) => i !== idx));
  };
  const updateTechCategoryName = (idx, value) => {
    const updated = [...techStackDetails];
    updated[idx].category = value;
    setTechStackDetails(updated);
  };
  const addTechItem = (catIdx, item) => {
    if (!item.trim()) return;
    const updated = [...techStackDetails];
    if (!updated[catIdx].items.includes(item.trim())) {
      updated[catIdx].items.push(item.trim());
      setTechStackDetails(updated);
    }
  };
  const removeTechItem = (catIdx, itemIdx) => {
    const updated = [...techStackDetails];
    updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
    setTechStackDetails(updated);
  };

  const onSubmit = async (data) => {
    if (!mediaPreview && !mediaFile) return toast.error("Media is required");
    if (skills.length === 0) return toast.error("Skills required");

    const formData = new FormData();
    
    // Append simple values
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    
    if (mediaFile) formData.append("media", mediaFile);
    
    // Append standard skills array
    skills.forEach((skill) => formData.append("skills[]", skill));

    // Append Features List array of objects
    featuresList.forEach((item, index) => {
      if (item.title.trim()) {
        formData.append(`featuresList[${index}][title]`, item.title.trim());
        formData.append(`featuresList[${index}][description]`, (item.description || "").trim());
      }
    });

    // Append Tech Stack Details array of objects
    techStackDetails.forEach((item, index) => {
      if (item.category.trim()) {
        formData.append(`techStackDetails[${index}][category]`, item.category.trim());
        item.items.forEach((subItem, subIdx) => {
          formData.append(`techStackDetails[${index}][items][${subIdx}]`, subItem.trim());
        });
      }
    });

    // Append Gallery Images array of objects
    gallery.forEach((item, index) => {
      if (item.url.trim()) {
        formData.append(`gallery[${index}][url]`, item.url.trim());
        formData.append(`gallery[${index}][caption]`, (item.caption || "").trim());
      }
    });

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
    <form onSubmit={handleSubmit(onSubmit)} className="pb-10">
      
      {/* ── RESPONSIVE GRID LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* ── PANEL 1: Identity & Basic Info (order-1 on all screens) ── */}
        <div className="order-1 lg:order-1 glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
            <FolderKanban className="w-3.5 h-3.5" /> Identity & Info
          </h3>

          <div className="space-y-3">
            <div className="floating-label-group">
              <FileText className="input-icon w-4 h-4 text-blue-500/70" />
              <input {...register("title")} placeholder=" " id="title" />
              <label htmlFor="title">Project Title <span className="text-red-500">*</span></label>
              {errors.title && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="floating-label-group">
              <ExternalLink className="input-icon w-4 h-4 text-blue-500/70" />
              <input {...register("slug")} placeholder=" " id="slug" />
              <label htmlFor="slug">Project Slug (URL part) <span className="text-red-500">*</span></label>
              {errors.slug && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="floating-label-group">
                <Tag className="input-icon w-4 h-4 text-blue-500/70" />
                <input
                  {...register("category")}
                  placeholder=" "
                  id="category"
                />
                <label htmlFor="category">Category</label>
                {errors.category && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="floating-label-group">
                <Hash className="input-icon w-4 h-4 text-blue-500/70" />
                <input
                  type="number"
                  {...register("order")}
                  placeholder=" "
                  id="order"
                />
                <label htmlFor="order">
                  <span className="hidden sm:inline">Display Order Index</span>
                  <span className="sm:hidden">Order</span>
                </label>
                {errors.order && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                    {errors.order.message}
                  </p>
                )}
              </div>
            </div>

            <div className="floating-label-group">
              <FileText className="input-icon w-4 h-4 text-blue-500/70" />
              <input
                {...register("shortDescription")}
                placeholder=" "
                id="shortDescription"
              />
              <label htmlFor="shortDescription">Short Description <span className="text-red-500">*</span></label>
              {errors.shortDescription && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <label htmlFor="description" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                <span className="hidden sm:inline">Full Project Brief / Description</span>
                <span className="sm:hidden">Full Project Brief</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                {...register("description")}
                placeholder="Provide markdown or clear text describing the project details..."
                id="description"
                rows={10}
                className="w-full border-0 border-b border-gray-700 bg-transparent py-2 focus:ring-0 focus-visible:ring-0 focus:outline-none outline-none whiteblink-remover text-sm"
              />
              {errors.description && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── PANEL 2: Media & Links (order-2 on all screens, dynamic relative priority stack) ── */}
        <div className={cn("order-2 lg:order-2 glass-panel p-6 rounded-3xl space-y-4 transition-all duration-300", statusOpen ? "z-50 relative" : "z-10 relative")}>
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 mb-4 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5" /> Media & Links
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
            className="group relative w-full aspect-video border-2 border-dashed border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all bg-white/5"
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
                    controls
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
                  Upload Hero File <span className="text-red-500">*</span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="floating-label-group">
              <Github className="input-icon w-4 h-4 text-purple-500/70" />
              <input
                {...register("githubLink")}
                placeholder=" "
                id="githubLink"
              />
              <label htmlFor="githubLink">Repository URL (GitHub)</label>
              {errors.githubLink && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                  {errors.githubLink.message}
                </p>
              )}
            </div>
            
            <div className="floating-label-group !m-0">
              <ExternalLink className="input-icon w-4 h-4 text-purple-500/70" />
              <input
                {...register("demoLink")}
                placeholder=" "
                id="demoLink"
              />
              <label htmlFor="demoLink">Live Demo URL</label>
              {errors.demoLink && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                  {errors.demoLink.message}
                </p>
              )}
            </div>
          </div>

          {/* Responsive positioning: side-by-side on md and up, stacked on mobile */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer">
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
                    featuredValue ? "bg-blue-500" : "bg-white/5",
                  )}
                />
                <div
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-0 w-6 h-6 bg-white/70 rounded-full shadow transform transition-transform",
                    featuredValue ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </div>
              <label
                htmlFor="featured"
                className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer"
              >
                Featured
              </label>
            </div>

            <div className="space-y-1.5 relative w-full md:w-40" ref={statusRef}>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Status <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setStatusOpen((s) => !s)}
                className="modern-select flex items-center justify-between cursor-pointer focus:ring-0 focus-visible:ring-0 focus:outline-none outline-none border-0 text-gray-300 w-full bg-white/5 px-4 py-2.5 rounded-xl border border-white/5"
                aria-haspopup="listbox"
                aria-expanded={statusOpen}
              >
                <span className="text-sm font-bold uppercase tracking-wider">{statusValue || "Draft"}</span>
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
                  className="mt-1.5 bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5 absolute left-0 right-0 z-50 shadow-2xl"
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
                        "p-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors",
                        statusValue === opt ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
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

        {/* ── PANEL 3: Highlights & Features (order-3 on mobile, order-4 on desktop) ── */}
        <div className="order-3 lg:order-4 glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ListTodo className="w-3.5 h-3.5" />
              <span><span className="hidden sm:inline">Highlights & </span>Features</span>
            </span>
            <button
              type="button"
              onClick={addFeature}
              className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold text-emerald-400 uppercase tracking-wider hover:bg-emerald-500/20 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span><span className="hidden sm:inline">Add Feature</span><span className="sm:hidden">Add</span></span>
            </button>
          </h3>

          {/* Draggable Reorder list, no border lines, card spacing = space-y-6, input field spacing = space-y-1.5 */}
          {featuresList.length > 0 && (
            <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent my-3" />
          )}

          <Reorder.Group
            axis="y"
            values={featuresList}
            onReorder={setFeaturesList}
            as="div"
            className="space-y-6 max-h-[300px] overflow-y-auto pr-1"
          >
            {featuresList.length === 0 ? (
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center py-6">No features added yet</p>
            ) : (
              featuresList.map((feature, idx) => (
                <Reorder.Item
                  key={feature.id}
                  value={feature}
                  as="div"
                  drag={isLargeScreen ? "y" : false}
                  onDragStart={() => isLargeScreen && setDraggingId(feature.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className="relative flex items-center pl-0 md:pl-7 transition-all duration-200"
                >
                  {/* Absolute drag handle positioned outside grid flow, taking no width */}
                  <div className="absolute left-0.5 top-[50%] -translate-y-[50%] hidden md:flex items-center justify-center cursor-grab text-slate-600 hover:text-slate-400">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Input fields wrapper - background styling applied ONLY during dragging */}
                  <div className={cn(
                    "flex-1 space-y-1.5 p-2 rounded-xl transition-all duration-200",
                    draggingId === feature.id ? "bg-white/[0.06] shadow-xl ring-1 ring-white/10" : ""
                  )}>
                    {/* Row 1: Title input & Delete button on the right */}
                    <div className="flex items-center gap-4">
                      <div className="floating-label-group flex-1 !mb-0">
                        <CheckSquare className="input-icon w-4 h-4 text-emerald-400/80" />
                        <input
                          value={feature.title}
                          onChange={(e) => updateFeature(idx, "title", e.target.value)}
                          placeholder=" "
                          id={`feat-title-${idx}`}
                        />
                        <label htmlFor={`feat-title-${idx}`}>Feature Title</label>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="cursor-pointer p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/25 text-slate-500 hover:text-red-400 transition-all flex-shrink-0"
                        title="Delete Feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Row 2: Description input */}
                    <div className="floating-label-group !mb-0">
                      <Info className="input-icon w-4 h-4 text-slate-500/70" />
                      <input
                        value={feature.description}
                        onChange={(e) => updateFeature(idx, "description", e.target.value)}
                        placeholder=" "
                        id={`feat-desc-${idx}`}
                      />
                      <label htmlFor={`feat-desc-${idx}`}>Feature Description</label>
                    </div>
                  </div>
                </Reorder.Item>
              ))
            )}
          </Reorder.Group>
        </div>

        {/* ── PANEL 4: Technology Stack Categories (order-4 on mobile, order-3 on desktop) ── */}
        <div className="order-4 lg:order-3 glass-panel p-6 rounded-3xl space-y-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" /> Technology Stack
          </h3>

          {/* Simple tags array (skills) with conditional Toggle field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Main Stack Tags (Core Highlights) <span className="text-red-500">*</span>
              </label>
              
              {/* Premium EMERALD toggle button styling (different styling colors requested) */}
              {!showAddCoreTag && (
                <button
                  type="button"
                  onClick={() => setShowAddCoreTag(true)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-400 uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Tag</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold flex items-center gap-1.5"
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

            {/* Conditional Core Tag input field */}
            {showAddCoreTag && (
              <div className="flex items-center gap-2">
                <div className="floating-label-group flex-1 !mb-0">
                  <Tag className="input-icon w-4 h-4 text-cyan-500/70" />
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        addSkill(e);
                        setShowAddCoreTag(false);
                      }
                    }}
                    placeholder=" "
                    id="skillInput"
                    autoFocus
                  />
                  <label htmlFor="skillInput">Add Core Tag (Press Enter)</label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCoreTag(false)}
                  className="cursor-pointer p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Detailed tech stack categories (techStackDetails) */}
          <div className="space-y-4 pt-4 border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                <span><span className="hidden sm:inline">Detailed </span>Categories</span>
              </label>
              <button
                type="button"
                onClick={addTechCategory}
                className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-xs font-bold text-cyan-400 uppercase tracking-wider hover:bg-cyan-500/20 transition-all duration-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span><span className="hidden sm:inline">Add Category</span><span className="sm:hidden">Add</span></span>
              </button>
            </div>

            {/* Draggable Reorder list, no border lines, card spacing = space-y-6, input field spacing = space-y-2 */}
            {techStackDetails.length > 0 && (
              <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent my-3" />
            )}

            <div className="max-h-[300px] overflow-y-auto pr-1">
              <Reorder.Group
                axis="y"
                values={techStackDetails}
                onReorder={setTechStackDetails}
                as="div"
                className="space-y-6"
              >
                {techStackDetails.length === 0 ? (
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center py-6">No categories added yet</p>
                ) : (
                  techStackDetails.map((cat, catIdx) => (
                    <Reorder.Item
                      key={cat.id}
                      value={cat}
                      as="div"
                      drag={isLargeScreen ? "y" : false}
                      onDragStart={() => isLargeScreen && setDraggingId(cat.id)}
                      onDragEnd={() => setDraggingId(null)}
                      className="relative flex items-start pl-0 md:pl-7 transition-all duration-200"
                    >
                      {/* Absolute drag handle positioned outside grid flow, taking no width */}
                      <div className="absolute left-0.5 top-[50%] -translate-y-[50%] hidden md:flex items-center justify-center cursor-grab text-slate-600 hover:text-slate-400 mt-2">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Right Column: Inputs & Tags (background only shown while dragging) */}
                      <div className={cn(
                        "flex-1 space-y-2 p-2 rounded-xl transition-all duration-200",
                        draggingId === cat.id ? "bg-white/[0.06] shadow-xl ring-1 ring-white/10" : ""
                      )}>
                        {/* Row 1: Category Name input & Delete button */}
                        <div className="flex items-center gap-4">
                          <div className="floating-label-group flex-1 !mb-0">
                            <Cpu className="input-icon w-4 h-4 text-cyan-500/70" />
                            <input
                              value={cat.category}
                              onChange={(e) => updateTechCategoryName(catIdx, e.target.value)}
                              placeholder=" "
                              id={`cat-${catIdx}`}
                            />
                            <label htmlFor={`cat-${catIdx}`}>
                              <span className="hidden sm:inline">Category Name (e.g. Frontend, Databases)</span>
                              <span className="sm:hidden">Name</span>
                            </label>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeTechCategory(catIdx)}
                            className="cursor-pointer p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/25 text-slate-500 hover:text-red-400 transition-all flex-shrink-0"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Row 2: Skill Tags Area (very short gap) */}
                        <div className="space-y-2 pl-2">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {cat.items.map((item, itemIdx) => (
                              <span
                                key={itemIdx}
                                className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md text-[9px] font-bold text-cyan-400 flex items-center gap-1"
                              >
                                {item}
                                <X
                                  onClick={() => removeTechItem(catIdx, itemIdx)}
                                  className="w-2.5 h-2.5 cursor-pointer hover:text-red-500"
                                />
                              </span>
                            ))}

                            {/* Premium CYAN toggle button styling (different styling colors requested) */}
                            {activeAddTagCatIdx !== catIdx && (
                              <button
                                type="button"
                                onClick={() => setActiveAddTagCatIdx(catIdx)}
                                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_8px_rgba(99,102,241,0.15)]"
                              >
                                <Plus className="w-3 h-3" /> Add Tag
                              </button>
                            )}
                          </div>
                          
                          {/* Conditional Category Tag Input Field */}
                          {activeAddTagCatIdx === catIdx && (
                            <div className="flex items-center gap-2 pt-1">
                              <div className="floating-label-group flex-1 !mb-0">
                                <Tag className="input-icon w-4 h-4 text-cyan-500/50" />
                                <input
                                  type="text"
                                  placeholder=" "
                                  id={`cat-add-item-${catIdx}`}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addTechItem(catIdx, e.target.value);
                                      e.target.value = "";
                                      setActiveAddTagCatIdx(null);
                                    }
                                  }}
                                  autoFocus
                                />
                                <label htmlFor={`cat-add-item-${catIdx}`}>
                                  <span className="hidden sm:inline">Add Tag (Press Enter)</span>
                                  <span className="sm:hidden">Add Tag</span>
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveAddTagCatIdx(null)}
                                className="cursor-pointer p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Reorder.Item>
                  ))
                )}
              </Reorder.Group>
            </div>
          </div>
        </div>

        {/* ── PANEL 5: Project Gallery (order-5 on all screens) ── */}
        <div className="order-5 lg:order-5 glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Images className="w-3.5 h-3.5" />
              <span><span className="hidden sm:inline">Project </span>Gallery</span>
            </span>
            <button
              type="button"
              onClick={handleGalleryClick}
              className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-400 uppercase tracking-wider hover:bg-amber-500/20 transition-all duration-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span><span className="hidden sm:inline">Add Image</span><span className="sm:hidden">Add</span></span>
            </button>
          </h3>

          {/* Hidden Input selector for Multiple Image Files */}
          <input
            type="file"
            ref={galleryInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleGalleryFilesChange}
          />

          {/* Draggable Reorder list, no border lines, card spacing = space-y-6, input field spacing = space-y-1.5 */}
          {gallery.length > 0 && (
            <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent my-3" />
          )}

          <Reorder.Group
            axis="y"
            values={gallery}
            onReorder={setGallery}
            as="div"
            className="space-y-6 max-h-[300px] overflow-y-auto pr-1"
          >
            {gallery.length === 0 ? (
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center py-6">No gallery items added yet</p>
            ) : (
              gallery.map((g, idx) => (
                <Reorder.Item
                  key={g.id}
                  value={g}
                  as="div"
                  drag={isLargeScreen ? "y" : false}
                  onDragStart={() => isLargeScreen && setDraggingId(g.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className="relative flex items-center pl-0 md:pl-7 transition-all duration-200"
                >
                  {/* Absolute drag handle positioned outside grid flow, taking no width */}
                  <div className="absolute left-0.5 top-[50%] -translate-y-[50%] hidden md:flex items-center justify-center cursor-grab text-slate-600 hover:text-slate-400">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Polaroid Card Wrapper (background styling applied ONLY during dragging) */}
                  <div className={cn(
                    "flex-1 flex flex-col p-3 rounded-2xl transition-all duration-200",
                    draggingId === g.id ? "bg-white/[0.06] shadow-xl ring-1 ring-white/10" : "bg-white/[0.01]"
                  )}>
                    {/* Polaroid Image Preview (16:9 aspect-video) */}
                    {g.url && (
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5 flex-shrink-0 bg-white/5 shadow-md relative group">
                        <img
                          src={g.url}
                          alt="Gallery item preview"
                          className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                        />
                        {/* Absolute positioned Delete button in the top-right corner */}
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(idx)}
                          className="absolute top-2.5 right-2.5 cursor-pointer p-2 rounded-xl bg-black/60 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-black/80 transition-all flex-shrink-0"
                          title="Delete Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Polaroid Caption Input stacked underneath */}
                    <div className="floating-label-group !mb-0 mt-3.5">
                      <Info className="input-icon w-4 h-4 text-slate-500/70" />
                      <input
                        value={g.caption}
                        onChange={(e) => updateGalleryItem(idx, "caption", e.target.value)}
                        placeholder=" "
                        id={`gal-cap-${idx}`}
                      />
                      <label htmlFor={`gal-cap-${idx}`}>Caption / Subtitle</label>
                    </div>
                  </div>
                </Reorder.Item>
              ))
            )}
          </Reorder.Group>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-white/5 mt-6">
        <button
          type="button"
          onClick={onSuccess}
          className="btn-secondary cursor-pointer px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.12em]"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="btn-gradient w-fit cursor-pointer flex items-center gap-2 px-7 py-2.5 sm:w-auto justify-center disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.12em] font-black">
                {project ? (
                  <>
                    <span className="hidden sm:inline">Execute Update</span>
                    <span className="sm:hidden">Update</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Deploy Asset</span>
                    <span className="sm:hidden">Deploy</span>
                  </>
                )}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
