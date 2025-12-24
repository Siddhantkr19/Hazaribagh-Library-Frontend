import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { Search, Mail, AlertCircle, Trash2, Reply, Send, X, Clock, CheckCircle } from 'lucide-react';

const HelpQueries = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Reply Modal States
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await adminApi.get('/help/all');
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to load tickets", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
        await adminApi.delete(`/help/delete/${id}`);
        setTickets(tickets.filter(t => t.id !== id)); // Optimistic UI update
    } catch (error) {
        alert("Failed to delete ticket");
    }
  };

  // 3. Open Reply Modal
  const openReplyModal = (ticket) => {
      setSelectedTicket(ticket);
      setReplyMessage(`Dear Student,\n\nRegarding your issue "${ticket.subject}":\n\n`);
      setReplyModalOpen(true);
  };

  // 4. Send Reply Handler
  const handleSendReply = async () => {
      if(!replyMessage.trim()) return;
      setSendingReply(true);
      try {
          await adminApi.post('/help/reply', {
              ticketId: selectedTicket.id,
              message: replyMessage
          });
          alert("Reply sent successfully via Email!");
          setReplyModalOpen(false);
          fetchTickets(); // Refresh to show updated status if you added one
      } catch (error) {
          console.error("Reply failed", error);
          alert("Failed to send email.");
      } finally {
          setSendingReply(false);
      }
  };

  // 5. Enhanced Filter Logic
  const filteredTickets = tickets.filter(ticket => 
    ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Student Queries</h2>
          <p className="text-gray-400 text-sm">Manage support tickets and refunds.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search email, subject or message..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading tickets...</div>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all group relative">
              
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                {/* User Info */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${ticket.subject.includes('Refund') ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {ticket.subject.includes('Refund') ? <AlertCircle size={24} /> : <Mail size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {ticket.subject}
                      {ticket.status === 'REPLIED' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">REPLIED</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono mt-1">{ticket.userEmail}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-right">
                  <p className="text-xs text-gray-500 flex items-center justify-end gap-1 mb-2">
                    <Clock size={12} /> {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-black/30 p-4 rounded-lg border border-white/5 text-gray-300 text-sm leading-relaxed mb-4">
                "{ticket.message}"
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                 <button 
                    onClick={() => handleDelete(ticket.id)}
                    className="px-4 py-2 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2"
                 >
                    <Trash2 size={14} /> Delete
                 </button>
                 
                 <button 
                    onClick={() => openReplyModal(ticket)}
                    className="px-4 py-2 text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center gap-2"
                 >
                    <Reply size={14} /> Reply via Email
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Mail size={40} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-white font-bold">No Queries Found</h3>
            <p className="text-gray-500 text-sm">No tickets match your search.</p>
          </div>
        )}
      </div>

      {/* --- REPLY MODAL --- */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-gray-900 border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Reply size={20} className="text-blue-500" /> Reply to Student
                    </h3>
                    <button onClick={() => setReplyModalOpen(false)} className="text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 p-3 rounded-lg text-sm text-gray-400">
                        <p><strong className="text-gray-200">To:</strong> {selectedTicket?.userEmail}</p>
                        <p><strong className="text-gray-200">Subject:</strong> Re: {selectedTicket?.subject}</p>
                    </div>

                    <textarea 
                        rows="6"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-blue-500/50 resize-none text-sm font-mono"
                    ></textarea>

                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setReplyModalOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSendReply}
                            disabled={sendingReply}
                            className="px-6 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            {sendingReply ? "Sending..." : <><Send size={14} /> Send Email</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default HelpQueries;