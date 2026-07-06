import { useState, useEffect } from "react";
import {
  User,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  Save,
  Loader2,
  Globe,
  Send,
  Phone,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProfileStore } from "../../store/useProfileStore";
import { toast } from "react-toastify";
import API from "../../api/axios";

const ProfileManagement = () => {
  const { profile, loading, fetchProfile, updateProfile } = useProfileStore();
  const [publishedProjects, setPublishedProjects] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [formData, setFormData] = useState({
    name: "Sk Nagur Basha",
    title: "MERN Stack Developer",
    bio: "MERN full stack web developer focused on building fast, accessible, and visually refined web experiences with modern technologies.",
    cv: "https://drive.google.com/uc?export=download&id=1P3IEWXQhUUf6H2VGg1VjRFOOVBrS4DfV",
    profilePicture: "",
    location: "Badvel, Kadapa, Andhra Pradesh, 516227",
    phone: "9999999999",
    availability: "Available for projects",
    socialLinks: {
      github: "https://github.com/Shaik-Nagur-Basha",
      linkedin: "https://www.linkedin.com/in/nagur-basha",
      telegram: "",
      email: "sknbasknba@gmail.com",
    },
    footerDescription: "",
    footerProjects: [
      { label: "", link: "" },
      { label: "", link: "" },
      { label: "", link: "" },
      { label: "", link: "" },
    ],
  });

  useEffect(() => {
    fetchProfile(true);
  }, [fetchProfile]);

  useEffect(() => {
    const fetchPublishedProjects = async () => {
      try {
        const { data } = await API.get("/projects?status=Published&select=title,demoLink,slug");
        if (data.success) {
          setPublishedProjects(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching published projects:", error);
      }
    };
    fetchPublishedProjects();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        cv: profile.cv || "",
        profilePicture: profile.profilePicture || "",
        location: profile.location || "",
        phone: profile.phone || "",
        availability: profile.availability || "",
        socialLinks: {
          github: profile.socialLinks?.github || "",
          linkedin: profile.socialLinks?.linkedin || "",
          telegram: profile.socialLinks?.telegram || "",
          email: profile.socialLinks?.email || "",
        },
        footerDescription: profile.footerDescription || "",
        footerProjects: profile.footerProjects && profile.footerProjects.length > 0
          ? profile.footerProjects.map((p) => ({ label: p.label || "", link: p.link || "" }))
          : [
              { label: "", link: "" },
              { label: "", link: "" },
              { label: "", link: "" },
              { label: "", link: "" },
            ],
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success("Portfolio details updated successfully");
    } else {
      toast.error(result.error);
    }
  };

  const handleSocialChange = (key, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [key]: value,
      },
    });
  };

  const handleFooterProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.footerProjects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      footerProjects: updatedProjects,
    });
  };

  const handleDropdownSelect = (projectIdx, selectValue) => {
    const pIdx = parseInt(selectValue, 10);
    if (isNaN(pIdx)) return;
    const selectedProj = publishedProjects[pIdx];
    if (selectedProj) {
      setFormData((prevFormData) => {
        const updatedProjects = [...prevFormData.footerProjects];
        updatedProjects[projectIdx] = {
          ...updatedProjects[projectIdx],
          label: selectedProj.title,
          link: selectedProj.demoLink || `${window.location.origin}/projects/${selectedProj.slug}`,
        };
        return {
          ...prevFormData,
          footerProjects: updatedProjects,
        };
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 px-4">
      {/* Header */}
      <div className="flex flex-row items-center gap-3 mb-4 sm:mb-8 flex-nowrap">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner flex-shrink-0">
          <User className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7" />
        </div>
        <div className="min-w-0 max-w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white uppercase italic truncate">
            Portfolio Profile
          </h2>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">
            Identity & Digital Presence Configuration
          </p>
        </div>
        <div className="ml-auto max-sm:hidden">
          <button
            type="button"
            onClick={handleSubmit}
            className="rotating-gradient-card new-project max-w-fit border-none text-nowrap shadow-none ring-0 outline-none"
          >
            <span>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Core Identity */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel sm:rounded-[2.5rem] max-sm:mb-8 overflow-hidden border-0! sm:border max-sm:bg-transparent! border-white/5 p-1 sm:p-6 md:p-8 relative group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 max-sm:bg-transparent group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 sm:mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Core Identity
            </h3>

            <div className="sm:space-y-6">
              <div className="floating-label-group max-sm:mb-0! max-sm:mt-2!">
                <User className="input-icon w-4 h-4" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder=" "
                  id="name"
                  required
                />
                <label htmlFor="name">Full Name</label>
              </div>

              <div className="floating-label-group max-sm:mb-0! max-sm:mt-2!">
                <Briefcase className="input-icon w-4 h-4" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder=" "
                  id="title"
                  required
                />
                <label htmlFor="title">Professional Title</label>
              </div>

              <div className="max-sm:mt-4!">
                <div className="opacity-55 flex items-center gap-1.5 text-md">
                  <FileText className="input-icon w-4 h-4" />
                  <label htmlFor="bio">Professional Bio</label>
                </div>
                <textarea
                  className="w-full border-0 border-b border-gray-700 focus:ring-0 focus-visible:ring-0 focus:outline-none outline-none whiteblink-remover"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder=" "
                  id="bio"
                  rows={4}
                  required
                />
              </div>

              <div className="floating-label-group max-sm:mb-0! max-sm:mt-2!">
                <Phone className="input-icon w-4 h-4" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder=" "
                  id="phone"
                />
                <label htmlFor="phone">Phone Number</label>
              </div>

              <div className="floating-label-group max-sm:mb-0! max-sm:mt-2!">
                <MapPin className="input-icon w-4 h-4" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder=" "
                  id="location"
                />
                <label htmlFor="location">Location</label>
              </div>
            </div>
          </div>
        </div>

        {/* Social Presence & CV Section */}
        <div className="lg:col-span-6 h-fit space-y-4">
          {/* CV Section */}
          <div className="glass-panel rounded-[2.5rem] p-1 max-sm:mb-8 sm:p-6 md:p-8 border-0! max-sm:bg-transparent! sm:border border-white/5 relative group">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 sm:mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Profile Picture & Resume
            </h3>

            <div className="floating-label-group max-sm:mb-0!">
              <ImageIcon className="input-icon w-4 h-4 text-purple-400" />
              <input
                type="url"
                value={formData.profilePicture}
                onChange={(e) =>
                  setFormData({ ...formData, profilePicture: e.target.value })
                }
                placeholder=" "
                id="profilePicture"
              />
              <label htmlFor="profilePicture">Profile Picture URL</label>
            </div>

            <div className="floating-label-group max-sm:mb-0! max-sm:mt-2">
              <FileText className="input-icon w-4 h-4 text-emerald-400" />
              <input
                type="url"
                value={formData.cv}
                onChange={(e) =>
                  setFormData({ ...formData, cv: e.target.value })
                }
                placeholder=" "
                id="cv"
              />
              <label htmlFor="cv">CV Link (Drive, Cloudinary, etc.)</label>
            </div>
            <p className="mt-2 sm:mt-4 text-[10px] text-amber-500 font-medium italic">
              * Provide a direct link to your PDF or hosted resume.
            </p>
          </div>
          <div className="glass-panel rounded-[2.5rem] p-1 sm:p-4  bg-transparent! border-0! border-white/5 relative h-full">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 sm:mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Digital Presence
            </h3>

            <div className="space-y-2!">
              <div className="floating-label-group">
                <Github className="input-icon w-4 h-4" />
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  placeholder=" "
                  id="github"
                />
                <label htmlFor="github">GitHub Profile</label>
              </div>

              <div className="floating-label-group">
                <Linkedin className="input-icon w-4 h-4 text-blue-400" />
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) =>
                    handleSocialChange("linkedin", e.target.value)
                  }
                  placeholder=" "
                  id="linkedin"
                />
                <label htmlFor="linkedin">LinkedIn URL</label>
              </div>

              <div className="floating-label-group">
                <Send className="input-icon w-4 h-4 text-sky-400" />
                <input
                  type="url"
                  value={formData.socialLinks.telegram}
                  onChange={(e) =>
                    handleSocialChange("telegram", e.target.value)
                  }
                  placeholder=" "
                  id="telegram"
                />
                <label htmlFor="telegram">Telegram Profile</label>
              </div>

              <div className="floating-label-group">
                <Mail className="input-icon w-4 h-4 text-red-400" />
                <input
                  type="email"
                  value={formData.socialLinks.email}
                  onChange={(e) => handleSocialChange("email", e.target.value)}
                  placeholder=" "
                  id="email"
                />
                <label htmlFor="email">Contact Email</label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Configuration */}
        <div className="lg:col-span-12 space-y-4 relative z-20">
          <div className="glass-panel rounded-[2.5rem] sm:p-6 md:p-8 bg-transparent! border-0! border-white/5 relative h-full group">
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 rounded-[2.5rem] group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 sm:mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Footer Configuration
            </h3>

            <div className="space-y-6 p-3 sm:p-4">
              {/* Footer Description */}
              <div className="max-sm:mt-4!">
                <div className="opacity-55 flex items-center gap-1.5 text-md mb-2">
                  <FileText className="input-icon w-4 h-4 text-indigo-400" />
                  <label htmlFor="footerDescription" className="text-slate-300">Footer Bio</label>
                </div>
                <textarea
                  className="w-full border-0 border-b border-gray-700 focus:ring-0 focus-visible:ring-0 focus:outline-none outline-none whiteblink-remover text-white bg-transparent"
                  value={formData.footerDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, footerDescription: e.target.value })
                  }
                  placeholder="Bio description..."
                  id="footerDescription"
                  rows={2}
                />
              </div>

              {/* Footer 4 Projects Links */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span>Footer Projects (Exactly 4)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.footerProjects.map((project, idx) => (
                    <div key={idx} className="md:w-11/12">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[10px] uppercase font-bold text-indigo-400">Project #{idx + 1}</span>
                        {publishedProjects.length > 0 && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                              className="text-[9px] uppercase font-black tracking-wider bg-[#0f172a] hover:bg-slate-800 border border-white/10 rounded-md px-2.5 py-1 text-slate-300 transition-colors duration-150 cursor-pointer flex items-center gap-1.5 focus:outline-none"
                            >
                              {project.label || "Link Project"} <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                            {openDropdown === idx && (
                              <>
                                <div
                                  className="fixed inset-0 z-50 cursor-pointer"
                                  onClick={() => setOpenDropdown(null)}
                                />
                                <div className="absolute right-0 mt-1.5 w-fit z-60 rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden py-1">
                                  {publishedProjects.map((p, pIdx) => (
                                    <button
                                      key={p._id}
                                      type="button"
                                      onClick={() => {
                                        handleDropdownSelect(idx, pIdx);
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full text-left text-nowrap px-3 py-2 text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-white hover:bg-indigo-600/35 transition-colors duration-150 cursor-pointer"
                                    >
                                      {p.title}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="floating-label-group my-0! relative!">
                        <input
                          type="text"
                          value={project.label}
                          onChange={(e) => handleFooterProjectChange(idx, "label", e.target.value)}
                          placeholder=" "
                          id={`proj-label-${idx}`}
                          required
                          className="max-md:pl-0! pl-5!"
                        />
                        <label htmlFor={`proj-label-${idx}`} className="absolute! max-md:left-0! left-5! top-2!">Label</label>
                      </div>
                      <div className="floating-label-group my-0! relative!">
                        <input
                          type="url"
                          value={project.link}
                          onChange={(e) => handleFooterProjectChange(idx, "link", e.target.value)}
                          placeholder=" "
                          id={`proj-link-${idx}`}
                          required
                          className="max-md:pl-0! pl-5!"
                        />
                        <label htmlFor={`proj-link-${idx}`} className="absolute! max-md:left-0! left-5! top-2!">URL</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="w-full sm:hidden flex items-center justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="rotating-gradient-card z-10 new-project max-w-fit border-none text-nowrap shadow-none ring-0 outline-none"
        >
          <span>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileManagement;
