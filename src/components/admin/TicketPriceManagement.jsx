"use client";

import { useState, useEffect } from "react";

const TicketPriceManagement = ({ searchQuery }) => {
  const [ticketPrices, setTicketPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách phim từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("https://kkts-moviebackend.onrender.com/api/movies");
        if (!response.ok) {
          throw new Error(`HTTP error fetching movies! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Movies API response:", data);
        // Đảm bảo dữ liệu hợp lệ
        const validMovies = data.map((movie) => ({
          id: movie.id,
          movieName: movie.movieName || "Unknown Title",
          type: movie.type || "Unknown Genre",
          price: movie.ticket_price || 60000,
          isEditing: false,
        }));
        setTicketPrices(validMovies);
      } catch (error) {
        console.error("Error fetching movies:", error.message);
        setError("Không thể tải danh sách phim");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter ticket prices based on search query
  const filteredTicketPrices = ticketPrices.filter((ticket) => {
    const movieName = ticket.movieName || "";
    const type = ticket.type || "";
    const query = searchQuery ? searchQuery.toLowerCase() : "";
    return (
      movieName.toLowerCase().includes(query) ||
      type.toLowerCase().includes(query)
    );
  });

  const handleEditPrice = (id) => {
    setTicketPrices((prevPrices) =>
      prevPrices.map((price) => (price.id === id ? { ...price, isEditing: true } : price))
    );
  };

  const handleSavePrice = (id, newPrice) => {
    const savePrice = async () => {
      try {
        if (!newPrice || newPrice <= 0) {
          setError("Giá vé phải là số dương");
          return;
        }

        const response = await fetch(`https://kkts-moviebackend.onrender.com/api/movies/${id}/price`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticket_price: Number.parseInt(newPrice) }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error updating price! status: ${response.status}`);
        }

        const updatedMovie = await response.json();
        console.log("Updated movie price:", updatedMovie);

        // Cập nhật state với giá mới
        setTicketPrices((prevPrices) =>
          prevPrices.map((price) =>
            price.id === id
              ? {
                  ...price,
                  price: updatedMovie.ticket_price,
                  isEditing: false,
                }
              : price
          )
        );
      } catch (error) {
        console.error("Error updating price:", error.message);
        setError(error.message);
      }
    };

    savePrice();
  };

  const handleCancelEdit = (id) => {
    setTicketPrices((prevPrices) =>
      prevPrices.map((price) => (price.id === id ? { ...price, isEditing: false } : price))
    );
  };

  const handlePriceChange = (id, newPrice) => {
    setTicketPrices((prevPrices) =>
      prevPrices.map((price) =>
        price.id === id ? { ...price, price: Number.parseInt(newPrice) || 0 } : price
      )
    );
  };

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Hiển thị loading nếu đang tải
  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý giá vé</h1>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
          Thêm loại vé mới
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Phim</th>
                  <th className="pb-3 pr-4">Thể loại</th>
                  <th className="pb-3 pr-4">Giá vé</th>
                  <th className="pb-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTicketPrices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">
                      Không có phim nào khớp với tìm kiếm
                    </td>
                  </tr>
                ) : (
                  filteredTicketPrices.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-700 text-white">
                      <td className="py-4 pr-4">{ticket.movieName}</td>
                      <td className="py-4 pr-4">{ticket.type}</td>
                      <td className="py-4 pr-4">
                        {ticket.isEditing ? (
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => handlePriceChange(ticket.id, e.target.value)}
                            className="bg-gray-700 text-white px-3 py-1 rounded-md w-24"
                            min="0"
                          />
                        ) : (
                          `${ticket.price.toLocaleString("vi-VN")} VND`
                        )}
                      </td>
                      <td className="py-4">
                        {ticket.isEditing ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSavePrice(ticket.id, ticket.price)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => handleCancelEdit(ticket.id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md transition-colors"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditPrice(ticket.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
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
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPriceManagement;