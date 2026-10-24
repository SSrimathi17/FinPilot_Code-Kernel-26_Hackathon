import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Lock, Upload, Search, Filter, ShieldCheck, Eye, Trash2, Sparkles, X } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { DocumentVaultItem } from "../../types";

export const DocumentVaultView: React.FC = () => {
  const { documents, uploadDocument, deleteDocument } = useFinance();
  const { user } = useAuth();
  const { showToast } = useUI();

  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentVaultItem | null>(null);

  // Upload Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentVaultItem["category"]>("Salary Slips");
  const [fileName, setFileName] = useState("");

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    uploadDocument({
      title,
      category,
      fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      fileType: "PDF/Image",
      ocrData: {
        extractedText: `Verified document scan for ${title}. Categorized under ${category}.`,
        issuedBy: "Government / Banking Authority",
      },
    });

    showToast(`Uploaded ${title} to encrypted vault!`, "success");
    setUploadModalOpen(false);
    setTitle("");
  };

  const docList = documents || [];
  const filteredDocs = docList.filter((doc) => {
    const matchesCat = filterCategory === "All" || doc.category === filterCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" /> Encrypted Financial Document Vault
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Securely store passbooks, salary slips, tax proofs, property deeds and ID credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-2xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> AES-256 Encrypted Storage
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document name..."
            className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          {["All", "Tax Receipt", "Salary Slips", "Passbook", "Government ID", "Property Deed"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                  : "bg-gray-800/60 text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  {doc.category}
                </span>
                <span className="text-[10px] text-gray-500">{doc.uploadDate}</span>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                  <span className="text-[10px] text-gray-400 block">{doc.fileType}</span>
                </div>
              </div>

              {doc.ocrData && (
                <div className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 text-[11px] text-gray-300 mt-3 space-y-1">
                  <span className="text-[10px] text-indigo-400 font-bold block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> OCR Summary
                  </span>
                  <p className="line-clamp-2 text-gray-400">{doc.ocrData.extractedText}</p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-800/80 flex items-center justify-between">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> View Scan
              </button>

              <button
                onClick={() => {
                  deleteDocument(doc.id);
                  showToast("Document deleted", "info");
                }}
                className="p-1.5 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white mb-2">{previewDoc.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{previewDoc.category} • Uploaded {previewDoc.uploadDate}</p>

              <div className="w-full h-60 rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden flex items-center justify-center p-2 mb-4">
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {previewDoc.ocrData && (
                <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
                  <span className="font-bold text-indigo-300">OCR Scanned Text:</span>
                  <p className="text-gray-300">{previewDoc.ocrData.extractedText}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white mb-4">Upload Document to Vault</h3>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. FY2025 Tax Receipt"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentVaultItem["category"])}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Tax Receipt">Tax Receipt</option>
                    <option value="Salary Slips">Salary Slips</option>
                    <option value="Passbook">Passbook</option>
                    <option value="Government ID">Government ID</option>
                    <option value="Property Deed">Property Deed</option>
                  </select>
                </div>

                <div className="p-6 rounded-2xl border-2 border-dashed border-gray-800 text-center cursor-pointer hover:border-indigo-500 transition-colors">
                  <Upload className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <span className="text-xs text-gray-300 font-semibold block">Click to browse document image or PDF</span>
                  <span className="text-[10px] text-gray-500">Max size 10MB</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Save to Vault
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
