import React, { useEffect, useState } from 'react';
import { Search, Shield, User, Phone, Mail, MoreVertical } from 'lucide-react';
import api from '../../services/adminApi'; // <--- USE THIS
import { toast } from 'react-hot-toast';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Search Logic
    const lowerTerm = searchTerm.toLowerCase();
    const results = students.filter(s => 
      s.name?.toLowerCase().includes(lowerTerm) || 
      s.email?.toLowerCase().includes(lowerTerm) ||
      s.phoneNumber?.includes(lowerTerm)
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/admin/students');
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
      toast.error("Could not load student list.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
           <h2 className="text-xl font-bold text-white">Registered Students</h2>
           <p className="text-sm text-gray-500">Total: {students.length}</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-black/20 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-6 font-medium">Student Profile</th>
                <th className="p-6 font-medium">Contact Info</th>
                <th className="p-6 font-medium">Role</th>
                <th className="p-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading directory...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Profile */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                          {student.profilePicture ? (
                              <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
                          ) : (
                              student.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{student.name}</p>
                          <p className="text-xs text-gray-500">ID: #{student.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-6">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                             <Mail size={14} /> {student.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                             <Phone size={14} /> {student.phoneNumber || "No Phone"}
                          </div>
                       </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-6">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 w-fit">
                        <User size={12} /> Student
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-6">
                      <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <MoreVertical size={20} />
                      </button>
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

export default StudentList;