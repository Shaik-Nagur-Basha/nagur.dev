import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden font-outfit">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center">
          {/* Advanced Spinner */}
          <div className="relative w-20 h-20 mb-8">
            {/* Pulsing Core */}
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />

            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500/40 animate-spin" />

            {/* Middle Ring */}
            <div className="absolute inset-2 rounded-full border border-transparent border-b-purple-500 border-l-purple-500/20 animate-[spin_2s_linear_infinite_reverse]" />

            {/* Inner Ring */}
            <div className="absolute inset-4 rounded-full border border-white/10" />

            {/* Central Point */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-1.5 text-center">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-md">
              Authenticating
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* System Version */}
        <div className="absolute bottom-10">
          <p className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.5em]">
            Nagur Control Center
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
