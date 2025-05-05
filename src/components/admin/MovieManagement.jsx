"use client";

import { useState, useEffect } from "react";

const MovieManagement = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    overview: "",
    genres: "",
    release_date: "",
    poster_path: "",
    runtime: "",
  });
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);

  // Fetch movies from backend on mount
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://kkts-moviebackend.onrender.com/api/movies');
    
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        // Map MongoDB data to frontend format
        const formattedMovies = data.map((movie) => ({
          id: movie.id,
          title: movie.movieName,
          genre: movie.type,
          releaseDate: movie.release_date,
          status:
            new Date(movie.release_date) <= new Date()
              ? "Đang chiếu"
              : "Sắp chiếu",
          poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.svg?height=300&width=200",
        }));
        setMovies(formattedMovies);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Không thể tải danh sách phim");
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Filter movies based on search query
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewMovie = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      try {
        const response = await fetch(`https://kkts-moviebackend.onrender.com/api/movies/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete movie");
        }
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== id)
        );
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie({
      ...movie,
      genres: movie.genre,
      release_date: movie.releaseDate
        ? new Date(movie.releaseDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMovie) return;

    try {
      const response = await fetch(
        `https://kkts-moviebackend.onrender.com/api/movies/${editingMovie.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingMovie.title,
            genres: editingMovie.genres.split(",").map((g) => g.trim()),
            release_date: editingMovie.release_date,
            poster_path: editingMovie.poster_path.replace(
              "https://image.tmdb.org/t/p/w500",
              ""
            ),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update movie");
      }

      const updatedMovie = await response.json();
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === updatedMovie.id
            ? {
                id: updatedMovie.id,
                title: updatedMovie.movieName,
                genre: updatedMovie.type,
                releaseDate: updatedMovie.release_date,
                status:
                  new Date(updatedMovie.release_date) <= new Date()
                    ? "Đang chiếu"
                    : "Sắp chiếu",
                poster_path: updatedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${updatedMovie.poster_path}`
                  : "/placeholder.svg?height=300&width=200",
              }
            : movie
        )
      );
      setEditingMovie(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingMovie((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setNewMovie({
      title: "",
      overview: "",
      genres: "",
      release_date: "",
      poster_path: "",
      runtime: "",
    });
    setAddError(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddError(null);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate random 8-digit movie_id
  const generateRandomMovieId = () => {
    return Math.floor(Math.random() * 90000000) + 10000000;
  };

  const handleAddMovie = async () => {
    // Client-side validation
    if (
      !newMovie.title ||
      !newMovie.overview ||
      !newMovie.genres ||
      !newMovie.release_date ||
      !newMovie.runtime
    ) {
      setAddError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!/^\d+$/.test(newMovie.runtime) || Number(newMovie.runtime) <= 0) {
      setAddError("Thời lượng phim phải là số dương");
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const movie_id = generateRandomMovieId();

      try {
        const response = await fetch("https://kkts-moviebackend.onrender.com/api/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movie_id,
            title: newMovie.title,
            overview: newMovie.overview,
            genres: newMovie.genres.split(",").map((g) => g.trim()),
            release_date: newMovie.release_date,
            poster_path: newMovie.poster_path,
            runtime: Number(newMovie.runtime),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === "ID phim đã tồn tại") {
            attempts++;
            if (attempts === maxAttempts) {
              throw new Error("Không thể tạo ID phim duy nhất sau nhiều lần thử");
            }
            continue; // Retry with a new movie_id
          }
          throw new Error(errorData.error || "Failed to create movie");
        }

        const createdMovie = await response.json();
        setMovies((prevMovies) => [
          ...prevMovies,
          {
            id: createdMovie.id,
            title: createdMovie.movieName,
            genre: createdMovie.type,
            releaseDate: createdMovie.release_date,
            status:
              new Date(createdMovie.release_date) <= new Date()
                ? "Đang chiếu"
                : "Sắp chiếu",
            poster_path: createdMovie.poster_path
              ? `https://image.tmdb.org/t/p/w500${createdMovie.poster_path}`
              : "/placeholder.svg?height=300&width=200",
          },
        ]);
        setIsAddModalOpen(false);
        setNewMovie({
          title: "",
          overview: "",
          genres: "",
          release_date: "",
          poster_path: "",
          runtime: "",
        });
        setError(null);
        setAddError(null);
        return; // Success, exit loop
      } catch (err) {
        setAddError(err.message);
        return; // Exit on non-duplicate errors
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý phim</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Thêm phim mới
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-3 pr-4">Tên phim</th>
                    <th className="pb-3 pr-4">Thể loại</th>
                    <th className="pb-3 pr-4">Ngày phát hành</th>
                    <th className="pb-3 pr-4">Trạng thái</th>
                    <th className="pb-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.map((movie) => (
                    <tr
                      key={movie.id}
                      className="border-b border-gray-700 text-white"
                    >
                      {editingMovie && editingMovie.id === movie.id ? (
                        <>
                          <td className="py-4 pr-4">
                            <input
                              type="text"
                              name="title"
                              value={editingMovie.title}
                              onChange={handleEditChange}
                              className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                            />
                          </td>
                          <td className="py-4 pr-4">
                            <input
                              type="text"
                              name="genres"
                              value={editingMovie.genres}
                              onChange={handleEditChange}
                              className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                              placeholder="Nhập thể loại, cách nhau bằng dấu phẩy"
                            />
                          </td>
                          <td className="py-4 pr-4">
                            <input
                              type="date"
                              name="release_date"
                              value={editingMovie.release_date}
                              onChange={handleEditChange}
                              className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                            />
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                movie.status === "Đang chiếu"
                                  ? "bg-green-500 bg-opacity-20 text-white"
                                  : "bg-blue-500 bg-opacity-20 text-white"
                              }`}
                            >
                              {movie.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-3">
                              <button
                                onClick={handleSaveEdit}
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
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
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-4 pr-4">{movie.title}</td>
                          <td className="py-4 pr-4">{movie.genre}</td>
                          <td className="py-4 pr-4">
                            {new Date(movie.releaseDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                movie.status === "Đang chiếu"
                                  ? "bg-green-500 bg-opacity-20 text-white"
                                  : "bg-blue-500 bg-opacity-20 text-white"
                              }`}
                            >
                              {movie.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleViewMovie(movie)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Xem chi tiết"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEditMovie(movie)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Chỉnh sửa"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteMovie(movie.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Xóa"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Movie Detail Modal */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết phim</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
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

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={selectedMovie.poster_path}
                  alt={selectedMovie.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <div className="md:w-2/3 space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Tên phim
                  </label>
                  <div className="bg-gray-700 p-3 rounded-lg text-white">
                    {selectedMovie.title}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Thể loại
                  </label>
                  <div className="bg-gray-700 p-3 rounded-lg text-white">
                    {selectedMovie.genre}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Ngày phát hành
                  </label>
                  <div className="bg-gray-700 p-3 rounded-lg text-white">
                    {new Date(selectedMovie.releaseDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Trạng thái
                  </label>
                  <div className="bg-gray-700 p-3 rounded-lg text-white">
                    {selectedMovie.status}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm phim mới</h2>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-400 hover:text-white"
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

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Tên phim
                </label>
                <input
                  type="text"
                  name="title"
                  value={newMovie.title}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập tên phim"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Mô tả phim
                </label>
                <textarea
                  name="overview"
                  value={newMovie.overview}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập mô tả phim"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Thể loại
                </label>
                <input
                  type="text"
                  name="genres"
                  value={newMovie.genres}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập thể loại, cách nhau bằng dấu phẩy"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Ngày phát hành
                </label>
                <input
                  type="date"
                  name="release_date"
                  value={newMovie.release_date}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Đường dẫn poster
                </label>
                <input
                  type="text"
                  name="poster_path"
                  value={newMovie.poster_path}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập đường dẫn poster (tùy chọn)"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Thời lượng phim (phút)
                </label>
                <input
                  type="number"
                  name="runtime"
                  value={newMovie.runtime}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập thời lượng phim (phút)"
                  min="1"
                />
              </div>

              {addError && (
                <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
                  {addError}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCloseAddModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddMovie}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieManagement;