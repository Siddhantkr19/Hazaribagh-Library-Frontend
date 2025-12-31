import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, IndianRupee, Users, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi'; 
import LibraryFormModal from './LibraryFormModal'; 

const ManageLibraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // 🔍 New Search State
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLib, setEditingLib] = useState(null);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const { data } = await api.get('/libraries');
      setLibraries(data);
    } catch (error) {
      toast.error("Failed to load libraries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this library branch? This cannot be undone.")) return;
    try {
      await api.delete(`/libraries/${id}`);
      toast.success("Library deleted");
      fetchLibraries(); 
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openAddModal = () => {
    setEditingLib(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lib) => {
    setEditingLib(lib);
    setIsModalOpen(true);
  };

  // 🔍 Filter Logic: Search by Name OR Location Tag
  const filteredLibraries = libraries.filter(lib => 
    lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lib.locationTag && lib.locationTag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-black/20 p-6 rounded-2xl border border-white/10 backdrop-blur-md gap-4">
        
        {/* Title Section */}
        <div className="w-full md:w-auto">
          <h2 className="text-2xl font-bold text-white">Manage Libraries</h2>
          <p className="text-gray-400 text-sm">Add or update your library branches</p>
        </div>

        {/* 🔍 Search Bar & Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name or location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder-gray-500 transition-all text-sm"
                />
            </div>

            {/* Add Button */}
            <button 
            onClick={openAddModal}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
            >
            <Plus size={20} /> Add Branch
            </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
            <p className="text-gray-500 col-span-full text-center py-10">Loading...</p>
        ) : filteredLibraries.length > 0 ? (
            filteredLibraries.map((lib) => (
                <div key={lib.id} className="bg-gray-900/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                    
                    {/* Image Banner */}
                    <div className="h-40 bg-gray-800 relative overflow-hidden">
                        {lib.images && lib.images.length > 0 ? (
                            <img src={lib.images[0].imageUrl || lib.images[0].url} alt={lib.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                        )}
                        
                        {/* Edit/Delete Overlay Buttons */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-[-10px] group-hover:translate-y-0">
                            <button onClick={() => openEditModal(lib)} className="p-2 bg-black/60 backdrop-blur-md text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(lib.id)} className="p-2 bg-black/60 backdrop-blur-md text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-lg"><Trash2 size={16} /></button>
                        </div>
                    </div>

                    {/* Info Body */}
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{lib.name}</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                            <MapPin size={14} className="text-blue-500" /> {lib.locationTag || "No Location"}
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Price</p>
                                <p className="text-emerald-400 font-bold flex items-center gap-1 text-lg">
                                    <IndianRupee size={16}/> {lib.offerPrice}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Capacity</p>
                                <p className="text-blue-400 font-bold flex items-center gap-1 text-lg">
                                    <Users size={16}/> {lib.totalSeats}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-400 text-lg">No libraries found matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="mt-2 text-blue-400 hover:underline">Clear Search</button>
            </div>
        )}
      </div>

      {/* MODAL */}
      <LibraryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        libraryToEdit={editingLib}
        onSuccess={fetchLibraries}
      />
    </div>
  );
};

export default ManageLibraries;