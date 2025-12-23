import React, { useState } from 'react';
import { X, Download, Mail, Loader2, FileText, CheckSquare, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi';

const DownloadReportModal = ({ isOpen, onClose, libraries = [] }) => {
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [reportType, setReportType] = useState('ALL'); // ALL, STUDENT, LIBRARY
  const [targetEmail, setTargetEmail] = useState('');
  const [selectedLib, setSelectedLib] = useState('');
  
  // Delivery Options
  const [sendToEmail, setSendToEmail] = useState(''); 
  const [downloadDirect, setDownloadDirect] = useState(true); // Default to download

  const handleDownload = async (e) => {
    e.preventDefault();
    
    // Validation: Must choose at least one method
    if (!downloadDirect && !sendToEmail) {
        toast.error("Please select at least one: Download or Email");
        return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing report...");

    try {
      let params = new URLSearchParams();
      
      // 1. Logic for Filters
      if (reportType === 'STUDENT') {
          if(!targetEmail) throw new Error("Student email is required");
          params.append('email', targetEmail);
          if(selectedLib) params.append('libraryId', selectedLib);
      } 
      else if (reportType === 'LIBRARY') {
          if(!selectedLib) throw new Error("Please select a library");
          params.append('libraryId', selectedLib);
      }
      
      // 2. Logic for Emailing
      if (sendToEmail) params.append('sendTo', sendToEmail);

      // 3. API Call
      // We always request 'blob' because the backend sends the file data back 
      // regardless of whether we want to save it or not.
      const response = await api.get(`/admin/reports/payments?${params.toString()}`, {
        responseType: 'blob', 
      });

      // 4. Logic for Direct Download
      if (downloadDirect) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Payment_Report_${new Date().toLocaleDateString()}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
      }

      // 5. Success Message Logic
      let msg = "Success!";
      if (downloadDirect && sendToEmail) msg = "Report downloaded & emailed!";
      else if (downloadDirect) msg = "Report downloaded successfully!";
      else if (sendToEmail) msg = "Report sent to email!";

      toast.success(msg, { id: toastId });
      onClose();

    } catch (error) {
      console.error(error);
      const errorMsg = error.message || "Failed to generate report";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="text-blue-400 w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Export History</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleDownload} className="p-6 space-y-5">
          
          {/* 1. REPORT SCOPE */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Report Scope</label>
            <div className="grid grid-cols-3 gap-2">
                {['ALL', 'LIBRARY', 'STUDENT'].map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setReportType(type)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                            reportType === type 
                            ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50' 
                            : 'bg-black/20 text-gray-400 border-white/10 hover:bg-white/5'
                        }`}
                    >
                        {type === 'ALL' ? 'Global' : type === 'LIBRARY' ? 'By Library' : 'By Student'}
                    </button>
                ))}
            </div>
          </div>

          {/* Conditional Inputs */}
          <div className="space-y-4">
              {(reportType === 'LIBRARY' || reportType === 'STUDENT') && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="text-xs text-gray-400 block mb-2">Select Library</label>
                  <select 
                    required={reportType === 'LIBRARY'}
                    value={selectedLib} 
                    onChange={(e) => setSelectedLib(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="" className="bg-gray-900">Choose Library...</option>
                    {libraries.map(lib => (
                        <option key={lib.id} value={lib.id} className="bg-gray-900">{lib.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {reportType === 'STUDENT' && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="text-xs text-gray-400 block mb-2">Student Email</label>
                  <input 
                    required
                    type="email"
                    placeholder="student@example.com"
                    value={targetEmail} 
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  />
                </div>
              )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

          {/* 2. DELIVERY OPTIONS */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Delivery Options</label>
            
            {/* Option A: Download Checkbox */}
            <div 
                onClick={() => setDownloadDirect(!downloadDirect)}
                className="flex items-center gap-3 mb-3 cursor-pointer group"
            >
                {downloadDirect ? (
                    <CheckSquare className="text-blue-500 w-5 h-5" />
                ) : (
                    <Square className="text-gray-600 w-5 h-5 group-hover:text-gray-400" />
                )}
                <span className={`text-sm ${downloadDirect ? 'text-white font-medium' : 'text-gray-400'}`}>
                    Download to this device
                </span>
            </div>

            {/* Option B: Email Input */}
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors w-4 h-4 ${sendToEmail ? 'text-blue-400' : 'text-gray-600'}`} />
              <input 
                type="email"
                placeholder="Send copy to email (Optional)..."
                value={sendToEmail} 
                onChange={(e) => setSendToEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={loading || (!downloadDirect && !sendToEmail)}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
                <>
                    {/* Dynamic Icon based on selection */}
                    {!downloadDirect && sendToEmail ? <Mail size={18} /> : <Download size={18} />}
                    
                    {/* Dynamic Text */}
                    {downloadDirect && sendToEmail ? 'Download & Email Report' : 
                     downloadDirect ? 'Download Report' : 
                     'Send Email Only'}
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DownloadReportModal;