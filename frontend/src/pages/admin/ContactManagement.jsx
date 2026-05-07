import { useEffect, useState } from "react";
import { 
  Mail, 
  Trash2, 
  Search, 
  Clock, 
  User, 
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Circle,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import { toast } from "react-toastify";

const ContactManagement = () => {
  const { contacts, fetchContacts, updateContactStatus, deleteContact, loading } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Unread" ? "Read" : "Unread";
    await updateContactStatus(id, newStatus);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this message permanently?")) {
      const result = await deleteContact(id);
      if (result.success) toast.success("Message deleted");
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)]">
      {/* Contact List */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 h-full">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact._id}
              onClick={() => {
                setSelectedContact(contact);
                if (contact.status === "Unread") handleStatusUpdate(contact._id, "Unread");
              }}
              className={`p-5 rounded-3xl cursor-pointer border transition-all duration-200 group ${
                selectedContact?._id === contact._id
                  ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/20"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    selectedContact?._id === contact._id
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  }`}>
                    {contact.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm truncate ${
                      selectedContact?._id === contact._id ? "text-white" : "text-slate-900 dark:text-white"
                    }`}>
                      {contact.name}
                    </p>
                    <p className={`text-[10px] ${
                      selectedContact?._id === contact._id ? "text-blue-100" : "text-slate-500"
                    }`}>
                      {new Date(contact.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {contact.status === "Unread" && (
                  <div className={`w-2 h-2 rounded-full bg-blue-500 ${selectedContact?._id === contact._id ? "bg-white" : ""}`}></div>
                )}
              </div>
              <h4 className={`text-xs font-bold truncate mb-1 ${
                selectedContact?._id === contact._id ? "text-white" : "text-slate-700 dark:text-slate-300"
              }`}>
                {contact.subject}
              </h4>
              <p className={`text-xs line-clamp-1 ${
                selectedContact?._id === contact._id ? "text-blue-100" : "text-slate-500"
              }`}>
                {contact.message}
              </p>
            </motion.div>
          ))}
          
          {filteredContacts.length === 0 && (
            <div className="text-center py-20 text-slate-500 text-sm">No messages found.</div>
          )}
        </div>
      </div>

      {/* Message View */}
      <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <motion.div
              key={selectedContact._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {selectedContact.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedContact.name}</h3>
                    <p className="text-sm text-slate-500">{selectedContact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedContact._id, selectedContact.status)}
                    className={`p-3 rounded-2xl transition-all ${
                      selectedContact.status === "Read" 
                        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
                        : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedContact.subject}</h2>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 relative">
                  <MessageSquare className="absolute right-8 top-8 w-12 h-12 text-slate-200 dark:text-slate-700 -rotate-12" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-4">Message</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(selectedContact.submittedAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    UID: {selectedContact._id.slice(-8)}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center"
                >
                  Reply via Email
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center mb-6">
                <Mail className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a message to read</h3>
              <p className="text-slate-500 max-w-sm">
                Click on a contact message from the sidebar to view its full details and respond.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactManagement;
