"use client";

import { useEffect, useRef } from "react";

const TrailerModal = ({ videoKey, onClose, title }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Thêm class để ngăn scroll khi modal mở
    document.body.classList.add("overflow-hidden");

    // Xử lý click bên ngoài để đóng modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Xử lý phím Escape để đóng modal
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // Cleanup
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden"
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">{title || "Trailer"}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
