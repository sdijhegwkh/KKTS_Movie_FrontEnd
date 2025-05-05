"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Xử lý khi không có poster
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/images/no-poster.jpg";

  return (
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
          <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors w-full font-medium">
            Đặt vé
          </button>
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
  );
};

export default MovieCard;
