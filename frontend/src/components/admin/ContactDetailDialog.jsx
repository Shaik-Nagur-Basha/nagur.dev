import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ContactDetailDialog = ({ open, contact, onClose }) => {
  if (!open || !contact) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-900 text-white rounded-lg p-6 w-[92%] max-w-2xl shadow-lg border border-white/6">
        <button
          onClick={onClose}
          className="absolute top-3 cursor-pointer right-3 p-2 rounded text-slate-300 hover:bg-white/5"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-bold">{contact.name}</h3>
          <p className="text-sm text-slate-400">{contact.email}</p>
          <div className="text-[12px] text-slate-500 mt-1">
            {new Date(contact.submittedAt).toLocaleString()}
          </div>
        </div>

        <div className="bg-white/[0.03] p-4 rounded-md text-slate-200 whitespace-pre-wrap max-h-[60vh] overflow-auto no-scrollbar">
          {contact.message}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ContactDetailDialog;
