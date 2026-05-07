import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const ConfirmDialog = ({
  open,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
  }, [onCancel]);

  const dialog = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-slate-900 text-white rounded-lg p-4 w-[90%] max-w-xs shadow-lg border border-white/6">
        <div className="mb-2 font-bold">{title}</div>
        <div className="text-sm text-slate-300 mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded cursor-pointer bg-white/5 text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded cursor-pointer bg-rose-500 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
};

export default ConfirmDialog;
