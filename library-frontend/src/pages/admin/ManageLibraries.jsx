import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, IndianRupee, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi'; // <--- USE THIS
import LibraryFormModal from '../../components/admin/LibraryFormModal';

const ManageLibraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      fetchLibraries(); // Refresh list
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

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-black/20 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Libraries</h2>
          <p className="text-gray-400 text-sm">Add or update your library branches</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Add New Branch
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? <p className="text-gray-500">Loading...</p> : libraries.map((lib) => (
          <div key={lib.id} className="bg-gray-900/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-all">
            
            {/* Image Banner */}
            <div className="h-32 bg-gray-800 relative">
               {lib.images && lib.images[0] ? (
                 <img src={lib.images[0]} alt={lib.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
               )}
               <div className="absolute top-2 right-2 flex gap-2">
                 <button onClick={() => openEditModal(lib)} className="p-2 bg-black/50 text-white rounded-lg hover:bg-blue-600 transition-colors"><Edit2 size={16} /></button>
                 <button onClick={() => handleDelete(lib.id)} className="p-2 bg-black/50 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={16} /></button>
               </div>
            </div>

            {/* Info Body */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-1">{lib.name}</h3>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <MapPin size={14} /> {lib.locationTag}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                   <p className="text-xs text-gray-500">Price</p>
                   <p className="text-emerald-400 font-bold flex items-center gap-1"><IndianRupee size={14}/> {lib.offerPrice}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500">Capacity</p>
                   <p className="text-blue-400 font-bold flex items-center gap-1"><Users size={14}/> {lib.totalSeats}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
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