"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import TrailerModal from "../components/TrailerModal";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Thêm state cho trailer
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Kiểm tra đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Thêm vào useEffect để fetch trailer
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN&append_to_response=credits,videos`
        );
        const data = await response.json();
        setMovie(data);

        // Tìm trailer
        if (data.videos && data.videos.results) {
          const trailer = data.videos.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setTrailer(trailer);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleBookingClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/booking/${id}`);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!movie) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Không tìm thấy phim
          </h2>
          <p className="text-gray-400 mb-6">
            Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all"
          >
            Quay lại trang chủ
          </button>
        </div>
      </MainLayout>
    );
  }

  // Format release date
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Chưa xác định";

  // Get backdrop or poster
  const backdropPath = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/images/default-backdrop.jpg";

  // Get poster
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/images/no-poster.jpg";

  return (
    <MainLayout>
      {/* Movie Backdrop */}
      <div className="relative w-full h-[50vh] mb-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={backdropPath || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img
                src={posterPath || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-gray-300 text-xl italic mb-4">
                {movie.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-400 text-2xl mr-1">★</span>
                <span className="text-white">
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </span>
              </div>

              <div className="text-gray-300">
                {movie.runtime ? `${movie.runtime} phút` : "Chưa xác định"}
              </div>

              <div className="text-gray-300">{releaseDate}</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Nội dung</h2>
              <p className="text-gray-300">
                {movie.overview || "Chưa có thông tin."}
              </p>
            </div>

            {/* Thêm nút xem trailer sau nút đặt vé */}
            <button
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md transition-all transform hover:scale-105 text-lg"
              onClick={handleBookingClick}
            >
              Đặt vé ngay
            </button>
            {trailer && (
              <button
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-md transition-all transform hover:scale-105 text-lg ml-4 flex items-center"
                onClick={() => setShowTrailer(true)}
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

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Diễn viên</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 6).map((person) => (
                <div
                  key={person.id}
                  className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                          : "/images/no-profile.jpg"
                      }
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-medium text-sm line-clamp-1">
                      {person.name}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-1">
                      {person.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {movie.videos?.results?.length > 0 && (
          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Trailer & Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.videos.results.slice(0, 2).map((video) => (
                <div
                  key={video.id}
                  className="aspect-video rounded-lg overflow-hidden"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Thêm modal trailer */}
      {showTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          onClose={() => setShowTrailer(false)}
          title={`Trailer: ${movie.title}`}
        />
      )}
    </MainLayout>
  );
};

export default MovieDetail;
