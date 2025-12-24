import React from 'react';
import { HelpCircle, Send, X, AlertCircle } from 'lucide-react';

const HelpModal = ({ showHelpModal, setShowHelpModal, helpSubject, setHelpSubject, helpMessage, setHelpMessage, handleHelpSubmit, isSendingHelp }) => {
  if (!showHelpModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 animate-in zoom-in-95">
            
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-orange-500" />
                    Help & Support
                </h3>
                <button onClick={() => setShowHelpModal(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-3 mb-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Refunds are only applicable within <span className="font-bold underline">3 days</span> of booking.
                </p>
            </div>

            <form onSubmit={handleHelpSubmit} className="space-y-4">
                
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Subject</label>
                    <select 
                        value={helpSubject}
                        onChange={(e) => setHelpSubject(e.target.value)}
                        className="w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                        <option value="Refund Request">Request Refund (3-Day Policy)</option>
                        <option value="Complaint">Library Facility Complaint</option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Other">Other Inquiry</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Message</label>
                    <textarea 
                        rows="4"
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        placeholder="Please explain why you are requesting a refund or describe your issue..."
                        className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                    ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowHelpModal(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSendingHelp}
                        className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 transition-all"
                    >
                        {isSendingHelp ? "Sending..." : <><Send className="w-4 h-4" /> Submit Ticket</>}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default HelpModal;