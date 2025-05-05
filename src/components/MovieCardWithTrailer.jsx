"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrailerModal from "./TrailerModal";

const MovieCardWithTrailer = ({ movie, trailerKey }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Xử lý khi không có poster
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/images/no-poster.jpg";

  const handleBookingClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/booking/${movie.id}`);
    }
  };

  return (
    <>
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/movies/${movie.id}`)}
      >
        {/* Poster */}
        <div className="aspect-[2/3] relative">
          <img
            src={posterPath || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay khi hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex items-center mb-2">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-white">
                {movie.vote_average?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/movies/${movie.id}`);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors w-full font-medium"
              >
                Chi tiết
              </button>
              <button
                onClick={handleBookingClick}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors w-full font-medium"
              >
                Đặt vé
              </button>
              {trailerKey && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTrailer(true);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition-colors w-full font-medium flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin phim (hiển thị khi không hover) */}
        <div
          className={`p-3 bg-gray-800 transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <h3 className="text-white font-medium text-base mb-1 line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-white text-sm">
              {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={() => setShowTrailer(false)}
          title={`Trailer: ${movie.title}`}
        />
      )}
    </>
  );
};

export default MovieCardWithTrailer;
