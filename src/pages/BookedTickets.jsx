"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { motion } from "framer-motion";
import axios from "axios";

const BookedTickets = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming"); // Cho phép thay đổi tab
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLoading(false); // Không có user, dừng loading
    }
  }, []);

  // Fetch bookings and tickets
  useEffect(() => {
    if (user) {
      const fetchBooking = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/booking/getAllBookingsByUserId/${user.phone}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          const bookings = response.data;

          // Lấy tickets cho mỗi booking
          const updatedBookings = await Promise.all(
            bookings.map(async (booking) => {
              try {
                const ticketResponse = await axios.get(
                  `http://localhost:5000/api/tickets/getTicketByBookingId/${booking.bookingId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                  }
                );

                const tickets = ticketResponse.data;
                return {
                  ...booking,
                  tickets,
                  status: tickets[0]?.status || "unknown",
                  seats: tickets.map((t) => t.seat_id),
                  total_price: tickets.reduce((sum, t) => sum + t.ticket_price, 0),
                };
              } catch (error) {
                console.error(`Lỗi khi lấy tickets cho booking ${booking.bookingId}:`, error);
                return booking;
              }
            })
          );

          setBookedTickets(updatedBookings);
        } catch (err) {
          console.error("Lỗi khi lấy bookings hoặc tickets:", err);
          alert("Không thể tải danh sách vé. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [user]);

  // Hủy booking
  const handleCancelTicket = async (bookingId) => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy vé này?");
    if (!confirmCancel) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Bạn cần đăng nhập lại!");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/booking/cancelBooking/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Làm mới danh sách bookings thay vì xóa trực tiếp
      const updatedBookings = await axios.get(
        `http://localhost:5000/api/booking/getAllBookingsByUserId/${user.phone}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const bookings = updatedBookings.data;
      const refreshedBookings = await Promise.all(
        bookings.map(async (booking) => {
          try {
            const ticketResponse = await axios.get(
              `http://localhost:5000/api/tickets/getTicketByBookingId/${booking.bookingId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );

            const tickets = ticketResponse.data;
            return {
              ...booking,
              tickets,
              status: tickets[0]?.status || "unknown",
              seats: tickets.map((t) => t.seat_id),
              total_price: tickets.reduce((sum, t) => sum + t.ticket_price, 0),
            };
          } catch (error) {
            console.error(`Lỗi khi lấy tickets cho booking ${booking.bookingId}:`, error);
            return booking;
          }
        })
      );

      setBookedTickets(refreshedBookings);
      alert("Hủy vé thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy vé:", error.response?.data || error);
      alert(
        error.response?.data?.message || "Hủy vé thất bại. Vui lòng thử lại."
      );
    }
  };

  const toggleExpandBooking = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  // Lọc bookings theo order_status thay vì ticket.status
  const filteredTickets = bookedTickets.filter(
    (booking) =>
      (activeTab === "upcoming" && booking.order_status === "ordered") ||
      (activeTab === "canceled" && booking.order_status === "canceled")
  );

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Bạn chưa đăng nhập
            </h2>
            <p className="text-gray-400 mb-6">
              Vui lòng đăng nhập để xem vé đã đặt của bạn.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Nếu đang loading
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Vé đã đặt</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "upcoming"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Vé sắp tới
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "canceled"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("canceled")}
          >
            Vé đã hủy
          </button>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Không có vé nào
            </h2>
            <p className="text-gray-400 mb-6">
              Bạn chưa đặt vé xem phim nào {activeTab === "upcoming" ? "sắp tới" : "đã hủy"}.
            </p>
            <button
              onClick={() => navigate("/theaters")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all"
            >
              Đặt vé ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTickets.map((booking) => (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Movie Poster */}
                    <div className="w-full md:w-1/5 flex-shrink-0">
                      <img
                        src={
                          booking.poster_path ||
                          "/placeholder.svg?height=300&width=200"
                        }
                        alt={booking.movieTitle}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>

                    <div className="w-full md:w-4/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-white mb-1">
                            {booking.movieTitle}
                          </h2>
                          <p className="text-gray-400 text-sm">
                            Mã đặt vé: {booking.bookingId}
                          </p>
                        </div>
                        {booking.order_status === "ordered" && (
                          <button
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-all"
                            onClick={() => handleCancelTicket(booking.bookingId)}
                          >
                            Hủy vé
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 mb-1">
                            <span className="font-medium">Rạp:</span>{" "}
                            {booking.address}
                          </p>
                          <p className="text-gray-400 mb-1">
                            <span className="font-medium">Ngày:</span>{" "}
                            {booking.date}
                          </p>
                          <p className="text-gray-400">
                            <span className="font-medium">Giờ:</span>{" "}
                            {booking.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">
                            <span className="font-medium">Ghế:</span>{" "}
                            {booking.seats.join(", ")}
                          </p>
                          <p className="text-gray-400 mb-1">
                            <span className="font-medium">Tổng tiền:</span>{" "}
                            {booking.total_price.toLocaleString("vi-VN")} VNĐ
                          </p>
                          <p className="text-gray-400">
                            <span className="font-medium">Ngày đặt:</span>{" "}
                            {new Date(booking.booking_time).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                        <button
                          onClick={() => toggleExpandBooking(booking.bookingId)}
                          className="text-orange-500 hover:text-orange-400 flex items-center transition-colors"
                        >
                          {expandedBooking === booking.bookingId
                            ? "Ẩn chi tiết vé"
                            : "Xem chi tiết vé"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ml-1 transition-transform ${
                              expandedBooking === booking.bookingId
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded ticket details */}
                  {expandedBooking === booking.bookingId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-700"
                    >
                      <h3 className="text-lg font-bold text-white mb-3">
                        Chi tiết vé
                      </h3>
                      <div className="space-y-4">
                        {booking.tickets.map((ticket) => (
                          <div
                            key={ticket.ticket_id}
                            className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between"
                          >
                            <div className="flex items-center mb-2 md:mb-0">
                              <div className="bg-orange-500 text-white font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                {ticket.seat_id}
                              </div>
                              <div>
                                <h4 className="text-white font-medium">
                                  {booking.movieTitle}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                  {booking.address} • {booking.date} • {booking.time}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-white font-bold">
                                {ticket.ticket_price.toLocaleString("vi-VN")} VNĐ
                              </span>
                              <span className="text-gray-400 text-sm">
                                Mã vé: {ticket.ticket_id}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Concessions details */}
                      {booking.foods && booking.foods.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-bold text-white mb-3">
                            Bắp nước
                          </h3>
                          <div className="bg-gray-700 p-4 rounded-lg">
                            {booking.foods.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between py-2 border-b border-gray-600 last:border-0"
                              >
                                <div className="text-white">
                                  {item.food_name} x{item.quantity}
                                </div>
                                <div className="text-white font-medium">
                                  {(item.food_price * item.quantity).toLocaleString("vi-VN")} VNĐ
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BookedTickets;