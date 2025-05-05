"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TrailerModal from "./TrailerModal";

const HeroCarousel = ({ movies = [], trailerMap = {} }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState(null);

  const currentMovie = movies[currentIndex];

  // Kiểm tra đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Tự động chuyển slide sau mỗi 6 giây
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, movies.length]);

  // Hàm chuyển đến slide tiếp theo
  const nextSlide = useCallback(() => {
    if (isTransitioning || movies.length <= 1) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, movies.length]);

  // Hàm chuyển đến slide trước đó
  const prevSlide = useCallback(() => {
    if (isTransitioning || movies.length <= 1) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
      );
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, movies.length]);

  const handleBookingClick = () => {
    if (!user) {
      navigate("/login");
    } else if (currentMovie) {
      navigate(`/booking/${currentMovie.id}`);
    }
  };

  if (!currentMovie) return null;

  // Sử dụng backdrop hoặc poster nếu không có backdrop
  const backdropPath = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : currentMovie.poster_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.poster_path}`
    : "/images/default-backdrop.jpg";

  const trailerKey = trailerMap[currentMovie.id];

  return (
    <div className="relative w-full h-[70vh] mb-12 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={backdropPath || "/placeholder.svg"}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div
          className={`max-w-2xl transition-all duration-500 ${
            isTransitioning
              ? "opacity-0 translate-y-10"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {currentMovie.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8 line-clamp-3">
            {currentMovie.overview}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleBookingClick}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all transform hover:scale-105"
            >
              Đặt vé ngay
            </button>
            <button
              onClick={() => navigate(`/movies/${currentMovie.id}`)}
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

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-all"
            aria-label="Previous slide"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-all"
            aria-label="Next slide"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 500);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index
                  ? "bg-orange-500 w-6"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={() => setShowTrailer(false)}
          title={`Trailer: ${currentMovie.title}`}
        />
      )}
    </div>
  );
};

export default HeroCarousel;
