import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle,
  KeyRound
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Security = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { updatePassword, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const newPasswordValue = watch("newPassword", "");

  const onSubmit = async (data) => {
    const result = await updatePassword(data);
    if (result.success) {
      toast.success("Password updated successfully!");
      reset();
    } else {
      toast.error(result.error || "Failed to update password");
    }
  };

  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "One uppercase letter", regex: /[A-Z]/ },
    { label: "One lowercase letter", regex: /[a-z]/ },
    { label: "One number", regex: /[0-9]/ },
    { label: "One special character (@$!%*?&)", regex: /[@$!%*?&]/ },
  ];

  return (
    <div className="max-w-4xl mx-auto font-outfit">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Form */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8"
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Update Password</h2>
                <p className="text-sm text-slate-500">Ensure your account is protected with a strong password.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Old Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register("oldPassword")}
                    type={showOld ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.oldPassword.message}</p>}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register("newPassword")}
                    type={showNew ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.newPassword.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Retype New Password</label>
                <div className="relative group">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register("confirmPassword")}
                    type={showNew ? "text" : "password"}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none mt-4"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update Password"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Requirements Sidebar */}
        <div className="w-full md:w-80">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 h-fit">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Requirements</h3>
            <div className="space-y-4">
              {requirements.map((req, i) => {
                const isMet = req.regex.test(newPasswordValue);
                return (
                  <div key={i} className="flex items-center gap-3">
                    {isMet ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${isMet ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
              <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-500 font-medium">
                Tip: Use a combination of random words and numbers to make your password even more secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
