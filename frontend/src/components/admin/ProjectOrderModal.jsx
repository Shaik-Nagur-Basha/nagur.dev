import React, { useState, useEffect } from "react";
import {
  motion,
  Reorder,
  AnimatePresence,
  useDragControls,
} from "framer-motion";
import {
  X,
  GripVertical,
  Save,
  ListOrdered,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import API from "../../api/axios";

// mode: "featured" | "nonfeatured"
const OrderItem = ({ project, index, mode }) => {
  const controls = useDragControls();
  const isFeatured = mode === "featured";

  return (
    <Reorder.Item
      value={project}
      layout="position"
      dragListener={false}
      dragControls={controls}
      dragElastic={0}
      dragConstraints={{ left: 0, right: 0 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileDrag={{
        scale: 1.01,
        backgroundColor: isFeatured
          ? "rgba(245, 158, 11, 0.12)"
          : "rgba(6, 182, 212, 0.08)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
        zIndex: 100,
        cursor: "grabbing",
      }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 35 },
        opacity: { duration: 0.2 },
      }}
      className={`group relative border rounded-xl p-3 flex items-center gap-4 transition-colors select-none touch-none mb-3 last:mb-0 ${
        isFeatured
          ? "bg-amber-500/[0.04] border-amber-500/15 hover:border-amber-500/30 hover:bg-amber-500/[0.08]"
          : "bg-cyan-500/[0.03] border-cyan-500/10 hover:border-cyan-500/25 hover:bg-cyan-500/[0.06]"
      }`}
    >
      {/* Order Indicator */}
      <div className="flex flex-col items-center justify-center min-w-[2.5rem]">
        <div
          className={`text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-lg border ${
            isFeatured
              ? "text-amber-400/80 bg-amber-500/10 border-amber-500/20"
              : "text-cyan-400/80 bg-cyan-500/10 border-cyan-500/15"
          }`}
        >
          {index + 1}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-[180px] sm:min-w-[280px] max-w-[480px]">
        <div className="flex items-center gap-2 mb-1">
          {isFeatured && (
            <Sparkles
              size={10}
              className="text-amber-400 shrink-0 animate-pulse"
            />
          )}
          <h3
            className={`text-sm font-bold truncate transition-colors ${
              isFeatured
                ? "text-amber-200 group-hover:text-amber-100"
                : "text-slate-200 group-hover:text-white"
            }`}
          >
            {project.title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 text-[8px] text-nowrap font-bold uppercase tracking-wider ${
              isFeatured ? "text-amber-500/70" : "text-cyan-500/70"
            }`}
          >
            <Calendar className="w-2.5 h-2.5 opacity-60" />
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          {project.category && (
            <span
              className={`text-[8px] text-nowrap font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                isFeatured
                  ? "text-amber-400/60 border-amber-500/20 bg-amber-500/5"
                  : "text-cyan-400/60 border-cyan-500/15 bg-cyan-500/5"
              }`}
            >
              {project.category}
            </span>
          )}
        </div>
      </div>

      {/* Drag Handle */}
      <div
        onPointerDown={(e) => controls.start(e)}
        className={`p-2 cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-lg transition-all ml-auto ${
          isFeatured
            ? "text-slate-600 group-hover:text-amber-400"
            : "text-slate-600 group-hover:text-cyan-400"
        }`}
      >
        <GripVertical className="w-5 h-5" />
      </div>
    </Reorder.Item>
  );
};

// mode: "featured" | "nonfeatured"
const ProjectOrderModal = ({ isOpen, onClose, mode = "featured" }) => {
  const { reorderProjects, loading } = useAdminStore();
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);

  const isFeatured = mode === "featured";
  const accentClass = isFeatured ? "amber" : "cyan";

  useEffect(() => {
    const loadOrderData = async () => {
      if (!isOpen) return;
      setFetching(true);
      setItems([]);
      try {
        const { data } = await API.get("projects", {
          params: {
            status: "Published",
            select: "title,createdAt,order,featured,category",
            limit: 200,
          },
        });
        const all = data.data || [];
        const filtered = all
          .filter((p) => (isFeatured ? p.featured === true : p.featured === false))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(filtered);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      } finally {
        setFetching(false);
      }
    };
    loadOrderData();
  }, [isOpen, mode]);

  const handleSave = async () => {
    const orders = items.map((item, index) => ({
      id: item._id,
      order: index,
    }));
    const result = await reorderProjects(orders);
    if (result.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        style={{ perspective: "1000px" }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{ transformStyle: "preserve-3d" }}
          className={`relative w-fit min-w-[320px] max-w-[95vw] bg-slate-900/90 border rounded-[1.5rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-3xl flex flex-col max-h-[85vh] ${
            isFeatured ? "border-amber-500/20" : "border-cyan-500/15"
          }`}
        >
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              isFeatured
                ? "bg-gradient-to-br from-amber-500/[0.05] via-transparent to-yellow-500/[0.03]"
                : "bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-blue-500/[0.03]"
            }`}
          />

          {/* Header */}
          <div className="relative p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-inner ${
                  isFeatured
                    ? "bg-amber-500/15 border-amber-500/25"
                    : "bg-cyan-500/10 border-cyan-500/20"
                }`}
              >
                {isFeatured ? (
                  <Sparkles
                    className="w-5 h-5 text-amber-400 animate-pulse"
                  />
                ) : (
                  <ListOrdered className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <div className="pr-8">
                <h2 className="text-lg font-black text-white tracking-tight leading-tight whitespace-nowrap">
                  {isFeatured ? "Featured" : "Standard"} Order
                </h2>
                <p
                  className={`text-[9px] uppercase tracking-[0.15em] font-bold ${
                    isFeatured ? "text-amber-500/70" : "text-cyan-500/60"
                  }`}
                >
                  {isFeatured
                    ? "Published · Featured Projects"
                    : "Published · Non-Featured Projects"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 p-2 hover:bg-white/5 bg-white/10 cursor-pointer rounded-xl transition-all duration-200 text-slate-400 hover:text-white active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Area */}
          <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {fetching ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <Loader2
                  className={`w-10 h-10 mb-4 animate-spin opacity-50 ${
                    isFeatured ? "text-amber-400" : "text-cyan-500"
                  }`}
                />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Loading sequence...
                </p>
              </div>
            ) : (
              <>
                <Reorder.Group
                  axis="y"
                  values={items}
                  onReorder={setItems}
                  className="w-full"
                >
                  {items.map((project, index) => (
                    <OrderItem
                      key={project._id}
                      project={project}
                      index={index}
                      mode={mode}
                    />
                  ))}
                </Reorder.Group>

                {items.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 min-w-[300px]">
                    <ListOrdered className="w-12 h-12 mb-3 text-slate-500" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      No {isFeatured ? "featured" : "non-featured"} published projects
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="relative p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-6">
            <p className="hidden sm:block text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black pl-2">
              Drag to reorder · Published only
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-white/10 hover:bg-white/5 cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || items.length === 0}
                className={`flex-1 sm:flex-none flex text-nowrap items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 ${
                  isFeatured
                    ? "bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400/60 shadow-md shadow-amber-500/10"
                    : "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400/60 shadow-md shadow-cyan-500/10"
                }`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? "Saving..." : "Save Order"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectOrderModal;
