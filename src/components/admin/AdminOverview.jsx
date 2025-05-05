"use client";

import { useState, useEffect } from "react";

const AdminOverview = ({ searchQuery }) => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTickets: 0,
    totalUsers: 0,
  });

  const [topMovies, setTopMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API để lấy thống kê và danh sách top phim
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Lấy tổng số phim
        const moviesResponse = await fetch("https://kkts-moviebackend.onrender.com/api/movies/stats");
        if (!moviesResponse.ok) {
          throw new Error(`HTTP error fetching movies! status: ${moviesResponse.status}`);
        }
        const moviesData = await moviesResponse.json();
        console.log("Movies API response:", moviesData);

        // Lấy tổng số vé
        const ticketsResponse = await fetch("https://kkts-moviebackend.onrender.com/api/tickets/stats");
        if (!ticketsResponse.ok) {
          throw new Error(`HTTP error fetching tickets! status: ${ticketsResponse.status}`);
        }
        const ticketsData = await ticketsResponse.json();
        console.log("Tickets API response:", ticketsData);

        // Lấy tổng số người dùng
        const usersResponse = await fetch("https://kkts-moviebackend.onrender.com/api/users/stats");
        if (!usersResponse.ok) {
          throw new Error(`HTTP error fetching users! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        console.log("Users API response:", usersData);

        // Lấy danh sách top phim
        const topMoviesResponse = await fetch("https://kkts-moviebackend.onrender.com/api/movies/top");
        if (!topMoviesResponse.ok) {
          throw new Error(`HTTP error fetching top movies! status: ${topMoviesResponse.status}`);
        }
        const topMoviesData = await topMoviesResponse.json();
        console.log("Top movies API response:", topMoviesData);

        // Cập nhật stats và topMovies
        setStats((prevStats) => ({
          ...prevStats,
          totalMovies: moviesData.totalMovies || 0,
          totalTickets: ticketsData.totalTickets || 0,
          totalUsers: usersData.totalUsers || 0,
        }));
        setTopMovies(topMoviesData);
      } catch (error) {
        console.error("Error fetching stats:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); // Chạy một lần khi component mount

  // Filter movies based on search query
  const filteredMovies = topMovies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total revenue
  const totalRevenue = filteredMovies.reduce((sum, movie) => sum + movie.revenue, 0);

  // Hiển thị loading nếu đang tải dữ liệu
  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tổng quan</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white">{stats.totalMovies}</h2>
              <p className="text-orange-100">Tổng số phim</p>
              <p className="text-xs text-orange-200 mt-2">Cập nhật mới nhất</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white">{stats.totalTickets}</h2>
              <p className="text-blue-100">Tổng số vé đã bán</p>
              <p className="text-xs text-blue-200 mt-2">Cập nhật mới nhất</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white">{stats.totalUsers}</h2>
              <p className="text-green-100">Tổng số người dùng</p>
              <p className="text-xs text-green-200 mt-2">Cập nhật mới nhất</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top Movies Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Tổng quan phim</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">#</th>
                  <th className="pb-3 pr-4">Tên phim</th>
                  <th className="pb-3 pr-4">Số vé đặt</th>
                  <th className="pb-3">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movie, index) => (
                  <tr key={movie.id} className="border-b border-gray-700 text-white">
                    <td className="py-4 pr-4">{index + 1}</td>
                    <td className="py-4 pr-4">{movie.name}</td>
                    <td className="py-4 pr-4">{movie.ticketsSold}</td>
                    <td className="py-4">{movie.revenue.toLocaleString("vi-VN")} VND</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-white font-bold">
                  <td className="pt-4" colSpan={3}>
                    Tổng doanh thu:
                  </td>
                  <td className="pt-4">{totalRevenue.toLocaleString("vi-VN")} VND</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;