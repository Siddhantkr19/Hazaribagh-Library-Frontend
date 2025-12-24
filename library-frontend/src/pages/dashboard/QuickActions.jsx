import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const QuickActions = ({ handleLogout, setShowHelpModal }) => {
  return (
    <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-white/10">
      <div className="p-3 border-b border-gray-100 dark:border-white/10">
        <h3 className="font-bold text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wide">Settings</h3>
      </div>
      <ul className="text-sm text-gray-700 dark:text-gray-300">
        <Link to="/history">
          <li className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
            <span>💳</span> Payment History
          </li>
        </Link>
        
        <li onClick={() => setShowHelpModal(true)} className="p-3 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium">
          <HelpCircle className="w-4 h-4" /> Help / Refund
        </li>

        <li onClick={handleLogout} className="p-3 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-bold mt-1">
          <span>🚪</span> Logout
        </li>
      </ul>
    </div>
  );
};

export default QuickActions;