import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi';

const LibraryFormModal = ({ isOpen, onClose, editingLib, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    locationTag: '',
    address: '',
    totalSeats: '',
    offerPrice: '',
    originalPrice: '',
    amenities: []
  });

 // [FIX] Populate form when libraryToEdit changes
  useEffect(() => {
    if (libraryToEdit) {
      // Convert arrays to comma-separated strings for the input fields
      setFormData({
        ...libraryToEdit,
        amenities: Array.isArray(libraryToEdit.amenities) ? libraryToEdit.amenities.join(', ') : '',
        images: Array.isArray(libraryToEdit.images) ? libraryToEdit.images.join(', ') : ''
      });
    } else {
      // Reset if Adding New
      setFormData(initialState);
    }
  }, [libraryToEdit, isOpen]); // Runs whenever the modal opens or the target library changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert comma-separated strings back to Arrays for Backend
    const payload = {
      ...formData,
      amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()).filter(s => s) : [],
      images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(s => s) : [],
      originalPrice: Number(formData.originalPrice),
      offerPrice: Number(formData.offerPrice),
      totalSeats: Number(formData.totalSeats)
    };

    try {
      if (libraryToEdit) {
        // UPDATE
        await api.put(`/libraries/${libraryToEdit.id}`, payload);
        toast.success("Library Updated Successfully!");
      } else {
        // CREATE
        await api.post('/libraries', payload);
        toast.success("New Library Added!");
      }
      onSuccess();
      onClose();   
    } catch (error) {
      console.error(error);
      toast.error("Failed to save library. Check console.");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-white/10 w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-white">
            {editingLib ? 'Edit Library' : 'Add New Library Branch'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Library Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Focus Point Library"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location Tag</label>
              <input
                type="text"
                name="locationTag"
                placeholder="e.g., Matwari, Hazaribagh"
                value={formData.locationTag}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Address</label>
            <textarea
              name="address"
              placeholder="Complete address of the library"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                placeholder="50"
                value={formData.totalSeats}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Offer Price (₹)</label>
              <input
                type="number"
                name="offerPrice"
                placeholder="350"
                value={formData.offerPrice}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                placeholder="400"
                value={formData.originalPrice}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                editingLib ? 'Update Library' : 'Create Library'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibraryFormModal;
