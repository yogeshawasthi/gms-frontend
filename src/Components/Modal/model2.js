// src/Components/Modal.js
import React from "react";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
        {children}
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;