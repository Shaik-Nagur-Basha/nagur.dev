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
} from "lucide-react";
import { motion } from "framer-motion";
import { useProfileStore } from "../../store/useProfileStore";
import { toast } from "react-toastify";

const ProfileManagement = () => {
  const { profile, loading, fetchProfile, updateProfile } = useProfileStore();
  const [formData, setFormData] = useState({
    name: "Sk Nagur Basha",
    title: "MERN Stack Developer",
    bio: "MERN full stack web developer focused on building fast, accessible, and visually refined web experiences with modern technologies.",
    cv: "https://drive.google.com/uc?export=download&id=1P3IEWXQhUUf6H2VGg1VjRFOOVBrS4DfV",
    profilePicture: "",
    location: "Badvel, Kadapa, Andhra Pradesh, 516227",
    phone: "8688463959",
    availability: "Available for projects",
    socialLinks: {
      github: "https://github.com/Shaik-Nagur-Basha",
      linkedin: "https://www.linkedin.com/in/nagur-basha",
      telegram: "",
      email: "sknbasknba@gmail.com",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
      </form>
      <div className="w-full sm:hidden flex items-center justify-center">
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
  );
};

export default ProfileManagement;
