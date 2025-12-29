import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import api from '../../services/api';

const ReviewModal = ({ isOpen, onClose, booking, userEmail, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Local messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    // basic client-side validation
    if (rating === 0) {
      setErrorMessage('Please give a rating (1-5).');
      return;
    }

    const payload = {
      userEmail: userEmail,
      bookingId: booking.bookingId,
      rating,
      comment
    };

    console.log('Submitting Payload:', payload);
    setSubmitting(true);

    try {
      await api.post('/reviews/submit', payload);

      // success feedback inside modal
      setSuccessMessage('Thanks — your review has been submitted!');
      // notify parent (so it can show message on the card)
      onSuccess?.(booking.bookingId);

      // short delay so user sees confirmation, then close
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    } catch (err) {
      const backendMessage = err.response?.data || 'Failed to submit review.';
      setErrorMessage(backendMessage);
      console.error('Backend Error:', backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rate Your Experience</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                } transition-colors duration-200`}
              />
            </button>
          ))}
        </div>

        <div className="text-center mb-4 text-sm font-medium text-blue-500">
          {rating === 1 && 'Terrible 😞'}
          {rating === 2 && 'Bad 😕'}
          {rating === 3 && 'Average 😐'}
          {rating === 4 && 'Good 🙂'}
          {rating === 5 && 'Excellent! 🤩'}
          {rating === 0 && 'Select a Rating'}
        </div>

        <textarea
          rows="4"
          placeholder="What did you like or dislike? (e.g., AC, WiFi...)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white resize-none mb-4"
        />

        {/* Inline messages (no alerts) */}
        {errorMessage && (
          <div className="mb-4 text-center text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-center text-sm text-green-700 bg-green-50 dark:bg-green-900/20 p-2 rounded">
            {successMessage}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting ? 'Submitting...' : <><Send size={18} /> Submit Review</>}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
