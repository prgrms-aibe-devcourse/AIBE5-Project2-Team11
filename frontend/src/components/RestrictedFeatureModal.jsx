import React from 'react';

export default function RestrictedFeatureModal({ isOpen, onClose, message = "기업회원은 이용 불가능한 기능입니다" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center">
        <div className="flex justify-center mb-4">
          <i className="ri-alert-circle-line text-red-500 text-5xl"></i>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">이용 불가능</h2>
        <p className="text-gray-600 mb-8 text-base leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}
