"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrailerModal from "./TrailerModal";

const HeroSection = ({ featuredMovie, trailerKey }) => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  // Sử dụng backdrop hoặc poster nếu không có backdrop
  const backdropPath = featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`
    : featuredMovie?.poster_path
    ? `https://image.tmdb.org/t/p/original${featuredMovie.poster_path}`
    : "/images/default-backdrop.jpg";

  return (
    <div className="relative w-full h-[70vh] mb-12">
      {/* Backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={backdropPath || "/placeholder.svg"}
          alt={featuredMovie?.title || "Featured Movie"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {featuredMovie?.title || "ĐẶT VÉ CHO BỘ PHIM CỦA BẠN"}
          </h1>
          <p className="text-lg text-gray-300 mb-8 line-clamp-3">
            {featuredMovie?.overview ||
              "Khám phá và đặt vé xem những bộ phim mới nhất tại rạp chiếu phim gần bạn."}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                featuredMovie && navigate(`/booking/${featuredMovie.id}`)
              }
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all transform hover:scale-105"
            >
              Đặt vé ngay
            </button>
            <button
              onClick={() =>
                featuredMovie && navigate(`/movies/${featuredMovie.id}`)
              }
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition-all transform hover:scale-105"
            >
              Xem chi tiết
            </button>
            {trailerKey && (
              <button
                onClick={() => setShowTrailer(true)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition-all transform hover:scale-105 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Xem Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={() => setShowTrailer(false)}
          title={`Trailer: ${featuredMovie.title}`}
        />
      )}
    </div>
  );
};

export default HeroSection;
