import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, LogOut, Wallet, ShieldCheck, MapPin ,MessageSquare , Star} from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard ', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Bookings', icon: <BookOpen size={20} />, path: '/admin/bookings' },
    { name: 'Students', icon: <Users size={20} />, path: '/admin/students' },
    { name: 'Finance', icon: <Wallet size={20} />, path: '/admin/finance' },
    { name: 'Manage Libraries', icon: <MapPin size={20} />, path: '/admin/libraries' },
    { name: 'Help & Queries', icon: <MessageSquare size={20} />, path: '/admin/help' },
    { name: 'Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
    
  ];

  // ✅ ADDED: Wrapper function to handle Logout + Redirect
  const handleLogout = () => {
    // 1. Call the context logout function
    logout(); 
    
    // 2. Force redirect to Login page
    navigate('/login');
    
    // 3. (Optional) Force reload to clear all memory states
    // window.location.reload(); 
  };

  return (
    <div className="flex h-screen bg-gray-900 font-sans text-gray-100 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col fixed h-full z-20 transition-all duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
             <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-orange-200">
              Admin
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Control Center</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                </span>
                <span className="font-medium text-sm tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            // ✅ UPDATED: Use the new handler instead of just 'logout'
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent rounded-xl transition-all duration-300 cursor-pointer"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-64 relative bg-gray-900 overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/10 blur-[120px] pointer-events-none" />
        
        <div className="p-8 relative z-10">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
                <p className="text-gray-400 text-sm">Welcome back, <span className="text-blue-400 font-semibold">{user?.name || 'Admin'}</span></p>
            </div>
            
            <div className="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">System Status</p>
                    <p className="text-xs font-bold text-green-400 flex items-center justify-end gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.name?.charAt(0) || "A"}
                </div>
            </div>
            </div>
            
            <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;