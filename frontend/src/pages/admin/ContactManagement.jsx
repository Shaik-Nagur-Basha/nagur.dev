import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, X, Trash2, CheckCircle2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ContactDetailDialog from "../../components/admin/ContactDetailDialog";
import { cn } from "../../utils/cn";

const ContactManagement = () => {
  const location = useLocation();
  const { contacts, fetchContacts, updateContactStatus, deleteContact } =
    useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailContact, setDetailContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (location?.state?.selectId && contacts.length > 0) {
      const contact = contacts.find((c) => c._id === location.state.selectId);
      if (contact) {
        setDetailContact(contact);
        setDetailOpen(true);
        if (contact.status === "Unread") {
          updateContactStatus(contact._id, "Read");
        }
      }
      window.history.replaceState({}, document.title);
    }
  }, [location, contacts, updateContactStatus]);

  const q = searchQuery.trim().toLowerCase();

  const filteredContacts = !q
    ? contacts
    : contacts.filter((c) => {
        const msg = String(c.message || "").toLowerCase();
        return (
          String(c.name || "")
            .toLowerCase()
            .includes(q) ||
          String(c.email || "")
            .toLowerCase()
            .includes(q) ||
          msg.includes(q)
        );
      });

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const highlightText = (text = "", query) => {
    if (!query) return text;
    try {
      const re = new RegExp(`(${escapeRegExp(query)})`, "gi");
      const parts = String(text).split(re);
      return parts.map((part, i) =>
        re.test(part) ? (
          <span key={i} className="bg-yellow-300 text-slate-900 px-1 rounded">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      );
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full overflow-auto no-scrollbar">
      {/* Sidebar List */}
      <div className="lg:col-span-12 flex flex-col gap-4 h-full min-h-0">
        <div className="glass-panel p-3 rounded-2xl relative !bg-transparent !border-0">
          <div className="relative w-3/4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Search Inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-b border-white/20 bg-transparent pl-9 pr-9 py-2 text-[13px] text-white/85 placeholder:text-slate-600 transition-colors duration-150 outline-none focus:outline-0 whiteblink-remover"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 p-1 text-slate-500 hover:text-slate-400 transition-colors duration-150"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact._id}
              onClick={() => setSelectedContact(contact)}
              className={cn(
                "p-4 rounded-2xl transition-all duration-200 group relative shadow-lg",
                selectedContact?._id === contact._id
                  ? "bg-blue-600/10 border-blue-500/50"
                  : "bg-white/[0.02] hover:bg-white/[0.03] border border-white/5",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm",
                      selectedContact?._id === contact._id
                        ? "bg-blue-500/25 text-white"
                        : "bg-white/5 text-slate-400",
                    )}
                  >
                    {String(contact.name || "")[0] || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black uppercase tracking-widest truncate">
                      {highlightText(contact.name, searchQuery)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold truncate">
                      {highlightText(contact.email, searchQuery)}
                    </p>
                  </div>
                </div>

                {/* Desktop / large screens: always visible */}
                <div className="hidden 2xl:flex items-center gap-2">
                  {String(contact.message || "").length > 220 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailContact(contact);
                        setDetailOpen(true);
                      }}
                      className="p-2 rounded-xl cursor-pointer text-slate-300 hover:text-white"
                      title="Expand"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const current = contact.status || "Unread";
                      const next = current === "Unread" ? "Read" : "Unread";
                      updateContactStatus(contact._id, next).then((res) => {
                        if (res?.success) toast.success(`Marked ${next}`);
                      });
                    }}
                    className={cn(
                      "p-2 rounded-xl cursor-pointer transition-all",
                      contact.status === "Read"
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-slate-400 hover:text-white",
                    )}
                    title={
                      contact.status === "Read" ? "Mark Unread" : "Mark Read"
                    }
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(contact._id);
                      setConfirmOpen(true);
                    }}
                    className="p-2 rounded-xl cursor-pointer text-rose-400 hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile: show actions only when this contact is selected */}
                <div
                  className={
                    selectedContact?._id === contact._id
                      ? "absolute top-2 right-2 z-20 flex 2xl:hidden items-center gap-0.5 p-0.5 bg-black rounded-xl"
                      : "hidden 2xl:hidden"
                  }
                >
                  {String(contact.message || "").length > 220 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailContact(contact);
                        setDetailOpen(true);
                      }}
                      className="p-2 rounded-xl cursor-pointer text-slate-300 hover:text-white"
                      title="Expand"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const current = contact.status || "Unread";
                      const next = current === "Unread" ? "Read" : "Unread";
                      updateContactStatus(contact._id, next).then((res) => {
                        if (res?.success) toast.success(`Marked ${next}`);
                      });
                    }}
                    className={cn(
                      "p-2 rounded-xl cursor-pointer transition-all",
                      contact.status === "Read"
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-slate-400 hover:text-white",
                    )}
                    title={
                      contact.status === "Read" ? "Mark Unread" : "Mark Read"
                    }
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(contact._id);
                      setConfirmOpen(true);
                    }}
                    className="p-2 rounded-xl cursor-pointer text-rose-400 hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-[11px] text-slate-200 font-medium line-clamp-2">
                  {highlightText(contact.message, searchQuery)}
                </p>
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-500">
                <div>{new Date(contact.submittedAt).toLocaleString()}</div>
                <div className="uppercase font-semibold tracking-widest text-[10px] text-slate-500">
                  {contact.status || "Unread"}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="text-center py-10 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              Zero Results
            </div>
          )}
        </div>
      </div>
      <ContactDetailDialog
        open={detailOpen}
        contact={detailContact}
        onClose={() => {
          setDetailOpen(false);
          setDetailContact(null);
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Contact"
        message="Are you sure you want to permanently delete this contact?"
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (!pendingDeleteId) return;
          deleteContact(pendingDeleteId).then((res) => {
            if (res?.success) toast.success("DELETED");
            setConfirmOpen(false);
            setPendingDeleteId(null);
            fetchContacts();
          });
        }}
      />

      {/* Message view removed — contact list is full width */}
    </div>
  );
};

export default ContactManagement;
