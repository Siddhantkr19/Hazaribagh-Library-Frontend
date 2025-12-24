import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import axios from 'axios';
import ReviewModal from './ReviewModal';
import { useAuth } from '../../context/AuthContext';

const ActiveSubscriptions = ({ bookings, loading }) => {
  const { user } = useAuth();

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [checking, setChecking] = useState(false);

  // messages per bookingId (string)
  const [reviewMessages, setReviewMessages] = useState({});
  // list of bookingIds that were reviewed successfully
  const [reviewedBookingIds, setReviewedBookingIds] = useState([]);

  const setReviewMessage = (bookingId, message, ttlMs = 6000) => {
    setReviewMessages((prev) => ({ ...prev, [bookingId]: message }));
    if (ttlMs > 0) {
      setTimeout(() => {
        setReviewMessages((prev) => {
          const copy = { ...prev };
          delete copy[bookingId];
          return copy;
        });
      }, ttlMs);
    }
  };

  const handleRateClick = async (booking) => {
    setChecking(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reviews/check-eligibility?bookingId=${booking.bookingId}`,
        { withCredentials: true }
      );

      if (response.data.canReview) {
        setSelectedBooking(booking);
        setReviewModalOpen(true);
      } else {
        // show friendly message inside the card (no alert)
        setReviewMessage(booking.bookingId, response.data.reason || 'Cannot review', 5000);
      }
    } catch (error) {
      console.error('Check failed', error);
      setReviewMessage(booking.bookingId, 'Please login again or refresh the page.', 5000);
    } finally {
      setChecking(false);
    }
  };

  // onSuccess callback from modal
  const handleReviewSuccess = (bookingId) => {
    // show persistent confirmation and mark booking as reviewed (disable button)
    setReviewMessage(bookingId, "Thanks — your review has been submitted!", 8000);
    setReviewedBookingIds((prev) => (prev.includes(bookingId) ? prev : [...prev, bookingId]));
  };

  return (
    <div>
      <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 ml-1">
        Active Subscriptions
      </h2>

      {loading ? (
        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center animate-pulse border border-gray-200 dark:border-white/10">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-100 dark:bg-white/5 rounded w-full"></div>
        </div>
      ) : bookings.length > 0 ? (
        bookings.map((booking) => {
          const msg = reviewMessages[booking.bookingId];
          const isReviewed = reviewedBookingIds.includes(booking.bookingId);

          return (
            <div
              key={booking.bookingId}
              className="bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-white/10 relative overflow-hidden group hover:border-orange-500/30 transition-all mb-4"
            >
              <div
                className={`absolute top-0 right-0 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl shadow-md ${
                  booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                ● {booking.status || 'ACTIVE'}
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32 h-32 bg-gray-100 dark:bg-black/20 rounded-xl overflow-hidden flex items-center justify-center text-4xl border border-gray-200 dark:border-white/5">
                  📚
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{booking.libraryName}</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-4 flex items-center gap-1">
                    📍 {booking.libraryAddress}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-white/5">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                        Seat Number
                      </span>
                      <span className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                        {booking.seatNumber}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-white/5">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                        Expires In
                      </span>
                      <span className="font-mono text-xl font-bold text-green-600 dark:text-green-400">
                        {booking.daysRemaining} Days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <p>
                  Owner Contact:{' '}
                  <span className="text-gray-900 dark:text-white font-mono">{booking.libraryOwnerContact}</span>
                </p>

                <div className="flex flex-col items-end gap-2">
                  {/* Inline message area (between owner and rate) */}
                  {msg && (
                    <div className="text-sm px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-md text-gray-700 dark:text-gray-200">
                      {msg}
                    </div>
                  )}

                  {/* Rate button - hide/disable if already reviewed */}
                  <button
                    onClick={() => handleRateClick(booking)}
                    disabled={checking || isReviewed}
                    className={`flex items-center gap-1.5 px-4 py-2 ${
                      isReviewed ? 'opacity-60 cursor-not-allowed' : 'bg-yellow-400/10 hover:bg-yellow-400/20'
                    } text-yellow-600 dark:text-yellow-400 rounded-lg font-bold transition-all border border-yellow-400/20`}
                  >
                    <Star size={14} className="fill-yellow-600 dark:fill-yellow-400" />
                    {isReviewed ? 'Already Reviewed' : checking ? 'Checking...' : 'Rate Library'}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-white dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-3xl mb-4">🪑</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Active Seat</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">You haven't booked a study space yet.</p>
          <Link to="/" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg">
            Book a Seat Now
          </Link>
        </div>
      )}

      {/* Render modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={selectedBooking}
        userEmail={user?.email}
        onSuccess={(bookingId) => {
          setReviewModalOpen(false);
          handleReviewSuccess(bookingId);
        }}
      />
    </div>
  );
};

export default ActiveSubscriptions;
