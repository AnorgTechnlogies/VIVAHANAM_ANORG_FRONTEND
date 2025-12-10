import React from 'react';

const AuthPagePopup = ({ onSuccess, onClose }) => {
  return (
    <div className="p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">
          Please sign in or create an account to access this feature.
        </p>
        <div className="space-y-3">
          <button
            onClick={onSuccess}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPagePopup;