import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  Eye,
  EyeOff,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Fingerprint,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import { cn } from "../../utils/cn";

const Security = () => {
  const { updatePassword, loading } = useAuthStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.newPassword.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.newPassword) },
    {
      label: "Special character",
      met: /[!@#$%^&*]/.test(formData.newPassword),
    },
    { label: "Uppercase letter", met: /[A-Z]/.test(formData.newPassword) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    const unmet = passwordRequirements.filter((r) => !r.met);
    if (unmet.length > 0) {
      return toast.error("Password complexity requirements not met");
    }
    const result = await updatePassword({
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });
    if (result.success) {
      toast.success("Password updated successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 px-3 sm:px-4 pb-8">
      <div className="flex flex-row items-center gap-3 mb-4 flex-nowrap">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7" />
        </div>
        <div className="min-w-0 max-w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white uppercase italic truncate">
            Security Protocol
          </h2>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">
            Credential Management & System Access
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/5 relative group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-blue-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                  Update Password
                </h3>
              </div>
              <div className="px-2 py-0.5 rounded-md bg-transparent border-0 border-blue-500/20">
                <Fingerprint className="w-3 h-3 text-blue-400" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-5">
                <div className="floating-label-group !mb-0">
                  <Key className="input-icon w-4 h-4" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder=" "
                    id="currentPassword"
                    required
                  />
                  <label htmlFor="currentPassword">Current Authorization</label>
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2 cursor-pointer top-[1.65rem] p-1.5 text-slate-500 hover:text-blue-400 transition-colors z-10"
                  >
                    {showCurrent ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="floating-label-group !mb-0">
                  <ShieldAlert className="input-icon w-4 h-4" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    placeholder=" "
                    id="newPassword"
                    required
                  />
                  <label htmlFor="newPassword">New Access Key</label>
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2 cursor-pointer top-[1.65rem] p-1.5 text-slate-500 hover:text-blue-400 transition-colors z-10"
                  >
                    {showNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="floating-label-group !mb-0">
                  <CheckCircle2 className="input-icon w-4 h-4" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder=" "
                    id="confirmPassword"
                    required
                  />
                  <label htmlFor="confirmPassword">Validate Key</label>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 cursor-pointer top-[1.65rem] p-1.5 text-slate-500 hover:text-blue-400 transition-colors z-10"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.25em] transition-all active:scale-[0.98] disabled:opacity-50 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full"
                    />
                    <span>INITIALIZING...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>INITIALIZE PROTOCOL</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 max-md:hidden">
          <div className="glass-panel rounded-[2rem] p-4 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">
                Complexity Index
              </h3>
            </div>

            <div className="space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-300",
                      req.met
                        ? "border-emerald-500/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.08)]"
                        : "border-white/5 text-slate-600",
                    )}
                  >
                    {req.met ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-bold tracking-tight transition-colors duration-300",
                      req.met ? "text-emerald-400" : "text-slate-500",
                    )}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex gap-3 relative">
              <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
              <p className="text-[9px] text-orange-200/60 leading-snug font-bold uppercase tracking-wider">
                <span className="text-orange-500 block mb-1">WARNING</span>
                Updating your credentials will invalidate existing sessions.
                Re-authentication required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
