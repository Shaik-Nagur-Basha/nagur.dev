import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  // All hooks must be called unconditionally at the top
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Check auth on mount so stored session is restored
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to /admin if already authenticated
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, isCheckingAuth, navigate]);

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success("Welcome back, Nagur!");
      navigate("/admin", { replace: true });
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  // Show spinner while checking stored session
  if (isCheckingAuth) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  // If already logged in, show nothing while redirect fires via useEffect
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="dark min-h-screen bg-pattern-subtle flex items-center justify-center bg-[#020617] p-4 font-outfit">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="rotating-gradient-border">
          <div className="rotating-gradient-content bg-[#0f172a] p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 mb-6 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
                ADMIN PORTAL
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Authentication Required
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="floating-label-group">
                <Mail className="input-icon w-4 h-4" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder=" "
                  id="email"
                  autoComplete="email"
                />
                <label htmlFor="email">Administrative Email</label>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="floating-label-group">
                <Lock className="input-icon w-4 h-4" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  id="password"
                  autoComplete="current-password"
                />
                <label htmlFor="password">Security Protocol</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 cursor-pointer top-[1.65rem] text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <button
                  disabled={loading}
                  type="submit"
                  className="rotating-gradient-card new-project w-fit mt-8 !px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="ml-2">Initializing...</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Initialize Session</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[10px] font-medium text-slate-500 tracking-wide">
                SYSTEM ID:{" "}
                <span className="text-slate-400">ADMIN-ALPHA-01</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
