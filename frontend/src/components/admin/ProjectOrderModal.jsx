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
  Hash,
  Loader2,
} from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { cn } from "../../utils/cn";
import API from "../../api/axios";

const OrderItem = ({ project, index }) => {
  const controls = useDragControls();

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
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
        zIndex: 100,
        cursor: "grabbing",
      }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 35 },
        opacity: { duration: 0.2 },
      }}
      className="group relative bg-white/[0.04] border border-white/5 rounded-xl p-3 flex items-center gap-6 hover:border-white/10 hover:bg-white/[0.06] transition-colors select-none touch-none mb-3 last:mb-0"
    >
      {/* Order Indicator */}
      <div className="flex flex-col items-center justify-center min-w-[2.5rem]">
        <div className="text-[10px] font-black text-blue-400/80 bg-blue-500/5 w-8 h-8 flex items-center justify-center rounded-lg border border-white/5">
          {index + 1}
        </div>
      </div>

      {/* Content - This will drive the width */}
      <div className="flex-1 min-w-[200px] sm:min-w-[300px] max-w-[500px]">
        <h3 className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors mb-1">
          {project.title}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[8px] font-bold text-blue-400 uppercase tracking-wider">
            <Calendar className="w-2.5 h-2.5 text-slate-600" />
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            <Hash className="w-2.5 h-2.5 text-slate-600" />
            {project._id.slice(-6).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Dedicated Drag Handle */}
      <div
        onPointerDown={(e) => controls.start(e)}
        className="p-2 cursor-grab active:cursor-grabbing text-slate-600 group-hover:text-blue-400 hover:bg-white/5 rounded-lg transition-all ml-auto"
      >
        <GripVertical className="w-5 h-5" />
      </div>
    </Reorder.Item>
  );
};

const ProjectOrderModal = ({ isOpen, onClose }) => {
  const { reorderProjects, loading } = useAdminStore();
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const loadOrderData = async () => {
      if (isOpen) {
        setFetching(true);
        try {
          const { data } = await API.get("projects", {
            params: { select: "title,createdAt,order" },
          });
          const sorted = data.data.sort(
            (a, b) => (a.order || 0) - (b.order || 0),
          );
          setItems(sorted);
        } catch (error) {
          console.error("Failed to fetch order data:", error);
        } finally {
          setFetching(false);
        }
      }
    };
    loadOrderData();
  }, [isOpen]);

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-fit min-w-[320px] max-w-[95vw] bg-slate-900/90 border border-white/20 rounded-[1.5rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-3xl flex flex-col max-h-[85vh]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-purple-500/[0.05] pointer-events-none" />

          {/* Header */}
          <div className="relative p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 rounded-xl border border-white/10 shadow-inner">
                <ListOrdered className="w-5 h-5 text-blue-400" />
              </div>
              <div className="pr-8">
                <h2 className="text-lg font-black text-white tracking-tight leading-tight whitespace-nowrap">
                  Arrangement
                </h2>
                <p className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-bold">
                  Sequence Manager
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 p-2 hover:bg-white/5 bg-white/10 cursor-pointer rounded-xl transition-all duration-200 text-slate-400 hover:text-white group active:scale-90"
            >
              <X className="w-5 h-5 transition-transform" />
            </button>
          </div>

          {/* List Area */}
          <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {fetching ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 mb-4 text-blue-500 animate-spin opacity-50" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Retrieving sequence...
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
                    />
                  ))}
                </Reorder.Group>

                {items.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 min-w-[300px]">
                    <ListOrdered className="w-12 h-12 mb-3 text-slate-500" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      No projects
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="relative p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-6">
            <p className="hidden sm:block text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black pl-2">
              AUTO-ORDERING ENABLED
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-white/10 hover:bg-white/5 cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-100 group-hover:scale-110 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || items.length === 0}
                className="flex-1 sm:flex-none rotating-gradient-card new-project !px-8 !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed group transition-all"
              >
                <span>
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {loading ? "Syncing..." : "Finalize"}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectOrderModal;
