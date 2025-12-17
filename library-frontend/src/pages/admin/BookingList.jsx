import React, { useEffect, useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle, Ban } from 'lucide-react';
import api from '../../services/adminApi'; 
import { toast } from 'react-hot-toast';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let result = bookings;

    // 1. Filter by Status
    if (statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }

    // 2. Search by Name or Email
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.user?.name?.toLowerCase().includes(lowerTerm) || 
        b.user?.email?.toLowerCase().includes(lowerTerm) ||
        b.seatNumber?.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredBookings(result);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'EXPIRED': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };


   const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to CANCEL this booking? The student will lose access immediately.")) {
      return;
    }

    try {
      await api.put(`/admin/bookings/${id}/cancel`);
      toast.success("Booking Cancelled");
      fetchBookings(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel booking");
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search student, email, or seat..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900/50 border border-white/10 text-gray-300 py-3 px-4 rounded-xl focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Active (Confirmed)</option>
            <option value="PENDING">Pending</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-black/20 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
             <thead>
  <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase">
     <th className="p-6 text-left">Student</th>
     <th className="p-6 text-left">Seat</th>
     <th className="p-6 text-left">Date</th>
     <th className="p-6 text-left">Amount</th>
     <th className="p-6 text-left">Status</th>
     <th className="p-6 text-right">Actions</th>
  </tr>
</thead>
              
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No bookings found matching your search.</td></tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Student Info */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-white shadow-lg">
                          {booking.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{booking.user?.name}</p>
                          <p className="text-xs text-gray-500">{booking.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Seat */}
                    <td className="p-6 font-mono text-blue-300 font-bold">
                      {booking.seatNumber || "TBD"}
                    </td>

                    {/* Dates */}
                    <td className="p-6 text-sm text-gray-400">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-sm">
                       <span className={new Date(booking.validUntil) < new Date() ? "text-red-400" : "text-emerald-400"}>
                         {booking.validUntil ? new Date(booking.validUntil).toLocaleDateString() : "-"}
                       </span>
                    </td>

                    {/* Amount */}
                    <td className="p-6 font-bold text-gray-200">
                      ₹{booking.amountPaid}
                    </td>

                    {/* Status Badge */}
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${getStatusColor(booking.status)}`}>
                        {booking.status === 'CONFIRMED' && <CheckCircle size={12} />}
                        {booking.status === 'PENDING' && <Clock size={12} />}
                        {booking.status === 'EXPIRED' && <AlertTriangle size={12} />}
                        {booking.status === 'CANCELLED' && <XCircle size={12} />}
                        {booking.status}
                      </span>
                    </td>

             
   <td className="p-6 text-right">
     {booking.status !== 'CANCELLED' && booking.status !== 'EXPIRED' && (
       <button 
         onClick={() => handleCancelBooking(booking.id)}
         className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
         title="Cancel Booking"
       >
         <Ban size={18} />
       </button>
     )}
   </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingList;