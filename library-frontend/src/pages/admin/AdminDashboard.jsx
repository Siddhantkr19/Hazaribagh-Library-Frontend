import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast'; // Notification Library
import RevenueChart from '../../components/admin/RevenueChart';
import OfflineBookingModal from '../../components/admin/OfflineBookingModal';
import WhatsAppBatchModal from '../../components/admin/WhatsAppBatchModal';
import api from '../../services/adminApi';
import { 
  IndianRupee, Users, Armchair, AlertCircle, 
  TrendingUp, Loader2, ArrowUpRight, Search, 
  Mail, MonitorPlay, MessageCircle ,MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
 const [showOfflineModal, setShowOfflineModal] = useState(false);
 const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  useEffect(() => {
    fetchStats();
  }, []);

  // 1. Fetch Data from Backend
  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error("Failed to load admin stats", error);
      // Optional: Check if 401 and redirect to login
      if (error.response && error.response.status === 401) {
         toast.error("Session expired. Please login again.");
      } else {
         toast.error("Could not load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle "Send Reminders" Action
  const handleSendReminders = async () => {
    // Confirmation Dialog
    if(!window.confirm("⚠️ Confirm Action:\n\nSend email reminders to all students whose subscription expires in the next 3 days?")) return;
    
    const toastId = toast.loading("Processing reminders...");
    
    try {
      // Call the endpoint we created in AdminController
      await api.post('/admin/trigger-reminders');
      toast.success("Emails sent successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send emails. Check server logs.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-400 animate-pulse">Syncing with Library Database...</p>
        </div>
      </div>
    );
  }

  // --- CONFIG: Stats Cards Data ---
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue || 0}`,
      icon: <IndianRupee className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/5",
      border: "group-hover:border-emerald-500/50",
      text: "text-emerald-400",
      trend: "+12.5% vs last month"
    },
    { 
      label: "WhatsApp Batch Sender", 
      desc: "Send reminders 1-by-1",
      icon: <MessageCircle size={18} />, 
      color: "hover:bg-green-500/20 hover:border-green-500/50 text-green-400",
      onClick: () => setShowWhatsAppModal(true) 
    },
    {
      title: "Active Students",
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6 text-blue-400" />,
      color: "from-blue-500/20 to-indigo-500/5",
      border: "group-hover:border-blue-500/50",
      text: "text-blue-400",
      trend: "Total registered accounts"
    },
    {
      title: "Occupied Seats",
      value: stats?.activeSeats || 0,
      icon: <Armchair className="w-6 h-6 text-purple-400" />,
      color: "from-purple-500/20 to-fuchsia-500/5",
      border: "group-hover:border-purple-500/50",
      text: "text-purple-400",
      trend: "Currently valid bookings"
    },
    {
      title: "Expiring Soon",
      value: stats?.expiringSoonCount || 0,
      icon: <AlertCircle className="w-6 h-6 text-orange-400" />,
      color: "from-orange-500/20 to-red-500/5",
      border: "group-hover:border-orange-500/50",
      text: "text-orange-400",
      trend: "Within next 72 hours"
    }
  ];

  // --- CONFIG: Quick Actions ---
  const actions = [
    { 
      label: "Send Reminders", 
      desc: "Notify expiring students",
      icon: <Mail size={18} />,
      color: "hover:bg-purple-500/20 hover:border-purple-500/50 text-purple-400",
      onClick: handleSendReminders // Connects the function
    },
    { 
      label: "Add Offline Booking", 
      desc: "For cash payments",
      icon: <MonitorPlay size={18} />,
      color: "hover:bg-blue-500/20 hover:border-blue-500/50 text-blue-400",
      onClick: () => setShowOfflineModal(true) // <--- THIS OPENS THE MODAL
    },
    
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      {/* 1. TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-2xl border border-white/5 bg-gradient-to-br ${card.color} backdrop-blur-xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.border}`}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-3xl bg-white`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-xl bg-gray-900/40 border border-white/10 shadow-inner`}>
                {card.icon}
              </div>
              {index === 0 && (
                 <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <TrendingUp size={12} /> +12%
                 </span>
              )}
            </div>
            
            <h3 className="text-gray-400 text-sm font-medium mb-1 tracking-wide">{card.title}</h3>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">{card.value}</p>
            <p className={`text-xs ${card.text} font-medium opacity-80 flex items-center gap-1`}>
                {index < 2 && <ArrowUpRight size={12} />} {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* 2. DASHBOARD CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* ================== REPLACE FROM HERE ================== */}
        {/* LEFT COLUMN: Revenue Graph */}
        <div className="lg:col-span-2 bg-black/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Revenue Trends</h3>
                <p className="text-gray-500 text-sm">Income over the last 7 days</p>
              </div>
           </div>
           
           {/* THE CHART GOES HERE */}
           <div className="flex-1 w-full h-72">
               <RevenueChart />
           </div>
        </div>
        {/* ================== TO HERE ================== */}

        {/* RIGHT COLUMN: Action Center */}
        <div className="bg-black/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl flex flex-col h-full">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">Quick Actions</h3>
                <p className="text-gray-500 text-sm mb-6">Manage your library instantly</p>
            </div>

            {/* Action Buttons List */}
            <div className="space-y-4 flex-1">
               {actions.map((action, i) => (
                   <button 
                    key={i}
                    onClick={action.onClick}
                    className={`w-full p-4 bg-gray-900/50 border border-white/5 text-left rounded-2xl transition-all duration-300 ${action.color} group relative overflow-hidden`}
                   >
                      <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white/5">{action.icon}</div>
                            <div>
                                <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{action.label}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{action.desc}</p>
                            </div>
                        </div>
                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
                      </div>
                      
                      {/* Button Hover Highlight */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                   </button>
               ))}
            </div>

            {/* Server Status Widget */}
            <div className="mt-8 p-5 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 blur-2xl rounded-full" />
                
                <div className="flex justify-between items-end mb-2 relative z-10">
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Server Status</p>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> ONLINE
                    </span>
                </div>
                
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[98%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
                <p className="text-right text-[10px] text-gray-500 mt-2 font-mono">Latency: 24ms</p>
            </div>
        </div>
      </div>
      <OfflineBookingModal 
        isOpen={showOfflineModal} 
        onClose={() => setShowOfflineModal(false)} 
      />

      {/* [NEW] WhatsApp Batch Modal Component Added Here */}
      <WhatsAppBatchModal 
        isOpen={showWhatsAppModal} 
        onClose={() => setShowWhatsAppModal(false)} 
      />
    </div>
  );
};

export default AdminDashboard;