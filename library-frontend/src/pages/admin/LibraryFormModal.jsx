import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi'; // <--- USE THIS

const LibraryFormModal = ({ isOpen, onClose, libraryToEdit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    locationTag: '',
    description: '',
    originalPrice: '',
    offerPrice: '',
    openingHours: '6 AM - 10 PM',
    totalSeats: '',
    contactNumber: '',
    amenities: '', // Input as comma-separated string
    images: ''     // Input as comma-separated string
  });

  // Populate form if Editing
  useEffect(() => {
    if (libraryToEdit) {
      setFormData({
        ...libraryToEdit,
        amenities: libraryToEdit.amenities?.join(', ') || '',
        images: libraryToEdit.images?.join(', ') || ''
      });
    } else {
      // Reset if Adding New
      setFormData({
        name: '', address: '', locationTag: '', description: '',
        originalPrice: '', offerPrice: '', openingHours: '6 AM - 10 PM',
        totalSeats: '', contactNumber: '', amenities: '', images: ''
      });
    }
  }, [libraryToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert comma-separated strings back to Arrays
    const payload = {
      ...formData,
      amenities: formData.amenities.split(',').map(s => s.trim()).filter(s => s),
      images: formData.images.split(',').map(s => s.trim()).filter(s => s),
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
      onSuccess(); // Refresh the list
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save library.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-gray-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl relative">
        
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold text-white">
            {libraryToEdit ? 'Edit Library' : 'Add New Library'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Library Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="admin-input" placeholder="e.g. Central Library" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Location Tag</label>
              <input required name="locationTag" value={formData.locationTag} onChange={handleChange} className="admin-input" placeholder="e.g. Matwari" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs text-gray-400">Full Address</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} className="admin-input h-20" placeholder="Full street address..." />
          </div>

          {/* Row 2: Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Original Price (₹)</label>
              <input required type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Offer Price (₹)</label>
              <input required type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="admin-input" />
            </div>
          </div>

          {/* Row 3: Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Total Seats</label>
              <input required type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Contact Number</label>
              <input required name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="admin-input" />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs text-gray-400">Amenities (Comma separated)</label>
            <input name="amenities" value={formData.amenities} onChange={handleChange} className="admin-input" placeholder="WiFi, AC, RO Water, Parking" />
          </div>

          {/* Images */}
          <div>
            <label className="text-xs text-gray-400">Image URLs (Comma separated)</label>
            <input name="images" value={formData.images} onChange={handleChange} className="admin-input" placeholder="https://image1.jpg, https://image2.jpg" />
          </div>

          <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {libraryToEdit ? 'Update Library' : 'Create Library'}
          </button>
        </form>
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default LibraryFormModal;