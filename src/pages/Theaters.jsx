"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { motion, AnimatePresence } from "framer-motion";

const Theaters = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [concessions, setConcessions] = useState({
    popcorn: 0,
    pepsi: 0,
    combo1: 0,
    combo2: 0,
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookingId, setBookingId] = useState("");

  // Fake theaters - giống với trang Booking
  const theaters = [
    {
      id: 1,
      name: "KKT Cinema - Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    },
    {
      id: 2,
      name: "KKT Cinema - Quận 7",
      address: "456 Nguyễn Thị Thập, Quận 7, TP.HCM",
    },
    {
      id: 3,
      name: "KKT Cinema - Thủ Đức",
      address: "789 Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
    },
  ];

  // Fake showtimes - giống với trang Booking
  const showtimes = [
    { id: 1, time: "10:00" },
    { id: 2, time: "12:30" },
    { id: 3, time: "15:00" },
    { id: 4, time: "17:30" },
    { id: 5, time: "20:00" },
    { id: 6, time: "22:30" },
  ];

  // Generate dates for the next 7 days - giống với trang Booking
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      id: i + 1,
      date: date.toLocaleDateString("vi-VN", {
        weekday: "short",
        month: "numeric",
        day: "numeric",
      }),
      fullDate: date,
    };
  });

  // Generate seats (8 rows x 10 columns) - giống với trang Booking
  const generateSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seats = [];

    // Danh sách ghế đã đặt - bạn có thể thay đổi danh sách này để kiểm soát ghế nào đã được đặt
    // const bookedSeats = ["A1", "A2", "B5", "C7", "D3", "E10", "F4", "G8", "H4"];

    rows.forEach((row) => {
      for (let i = 1; i <= 10; i++) {
        const seatId = `${row}${i}`;
        // Kiểm tra xem ghế có trong danh sách đã đặt không
        const isAvailable = !bookedSeats.includes(seatId);
        seats.push({
          id: seatId,
          row,
          number: i,
          isAvailable,
        });
      }
    });

    return seats;
  };

  const seats = generateSeats();

  // Concession prices - giống với trang Booking
  const prices = {
    popcorn: 70000,
    pepsi: 30000,
    combo1: 150000,
    combo2: 300000,
    ticket: ticketPrice,
  };

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Fetch danh sách phim từ TMDB
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN&page=1"
        );
        const data = await response.json();
  
        // Lấy 5 phim ngẫu nhiên
        const randomMovies = data.results
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
  
        // Fetch giá vé cho từng phim
        const moviesWithPrices = await Promise.all(
          randomMovies.map(async (movie) => {
            try {
              const priceResponse = await fetch(
                `http://kkts-moviebackend.onrender.com/api/movies/${movie.id}/price`
              );
              const priceData = await priceResponse.json();
              return {
                ...movie,
                ticket_price: priceData.ticket_price || 90000 // Fallback nếu không có giá
              };
            } catch (error) {
              console.error(`Error fetching price for movie ${movie.id}:`, error);
              return {
                ...movie,
                ticket_price: 90000 // Fallback nếu có lỗi
              };
            }
          })
        );
  
        setMovies(moviesWithPrices);
        
      } catch (error) {
        console.error("Error fetching movies:", error);
        setTicketPrice(90000); // Fallback nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovies();
  }, []); // Thêm selectedMovie vào dependencies

  const handleSeatClick = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setTicketPrice(movie.ticket_price || 90000); // Cập nhật giá vé khi chọn phim
  };

  const handleConcessionChange = (type, value) => {
    setConcessions((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const calculateTotal = () => {
    const ticketTotal = selectedSeats.length * (selectedMovie?.ticket_price || ticketPrice);
    const concessionsTotal =
      concessions.popcorn * prices.popcorn +
      concessions.pepsi * prices.pepsi +
      concessions.combo1 * prices.combo1 +
      concessions.combo2 * prices.combo2;
  
    return {
      ticketTotal,
      concessionsTotal,
      total: ticketTotal + concessionsTotal,
    };
  };

  const handleNextStep = async (e) => {
    // Validate current step
    if (currentStep === 1 && !selectedTheater) {
      alert("Vui lòng chọn rạp chiếu");
      return;
    }
    if (currentStep === 2 && !selectedDate) {
      alert("Vui lòng chọn ngày");
      return;
    }
    if (currentStep === 3 && !selectedMovie) {
      alert("Vui lòng chọn phim");
      return;
    }
    if (currentStep === 4 && !selectedTime) {
      alert("Vui lòng chọn giờ chiếu");
      return;
    }
    if (currentStep === 4) {
      // Gọi API getBookingSeats khi chuyển từ bước 2 sang bước 3
      try {
        const query = new URLSearchParams({
          movieID: selectedMovie.id,
          date: selectedDate,
          time: selectedTime,
          address: selectedTheater.name,
        }).toString();

        const responseSeats = await fetch(
          `http://kkts-moviebackend.onrender.com/api/booking/getBookingSeats?${query}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!responseSeats.ok) {
          throw new Error(`API error: ${responseSeats.status} ${responseSeats.statusText}`);
        }

        const dataSeats = await responseSeats.json();
        console.log("API response:", dataSeats);

        if (dataSeats.bookingSeats && Array.isArray(dataSeats.bookingSeats)) {
          const bookSeats = dataSeats.bookingSeats.map((seat) => seat.seat_id);
          console.log("Booked seats:", bookSeats);
          setBookedSeats(bookSeats);
        } else {
          console.log("No booked seats or invalid data format");
          setBookedSeats([]);
        }
      } catch (error) {
        console.error("Error fetching booked seats:", error);
        setError("Không thể tải danh sách ghế đã đặt. Vui lòng thử lại.");
        setBookedSeats([]);
        return; // Không chuyển bước nếu lỗi
      }
    }
    if (currentStep === 5 && selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setError("Bạn cần đăng nhập trước khi đặt vé.");
        return;
      }

      // Tạo danh sách thức ăn đã chọn
      const foods = [];
      if (concessions.popcorn > 0)
        foods.push({
          food_id: "popcorn",
          food_name: "Bắp rang",
          food_price: prices.popcorn,
          quantity: concessions.popcorn,
        });
      if (concessions.pepsi > 0)
        foods.push({
          food_id: "pepsi",
          food_name: "Pepsi",
          food_price: prices.pepsi,
          quantity: concessions.pepsi,
        });
      if (concessions.combo1 > 0)
        foods.push({
          food_id: "combo1",
          food_name: "Combo 1",
          food_price: prices.combo1,
          quantity: concessions.combo1,
        });
      if (concessions.combo2 > 0)
        foods.push({
          food_id: "combo2",
          food_name: "Combo 2",
          food_price: prices.combo2,
          quantity: concessions.combo2,
        });

      const total = calculateTotal();
      const maDatVe =
        "KKT" +
        Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0");
      setBookingId(maDatVe);

      const bookingData = {
        bookingId: maDatVe,
        userId: user.phone,
        movieID: selectedMovie.id,
        movieTitle: selectedMovie.title,
        seats: selectedSeats.map((seatId) => ({
          seat_id: seatId,
          status: "booked",
        })),
        address: selectedTheater.name,
        foods: foods,
        total_price: total.total,
        date: selectedDate,
        time: selectedTime,
        booking_time: new Date().toISOString(),
        order_status: "ordered",
        poster_path: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`,
      };

      // Gửi booking
      const bookingRes = await fetch(
        "http://kkts-moviebackend.onrender.com/api/booking/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      const bookingResult = await bookingRes.json();

      if (bookingRes.status !== 201) {
        setError(bookingResult.message || "Có lỗi xảy ra khi đặt vé.");
        return;
      }

      console.log("Đặt vé thành công:", bookingResult.booking);

      // Tạo các vé tương ứng với ghế đã chọn
      const ticketPromises = selectedSeats.map((seatId) => {
        const maVe = maDatVe + "-" + seatId;
        const ticketData = {
          ticket_id: maVe,
          booking_id: maDatVe,
          ticket_price: ticketPrice,
          seat_id: seatId,
          status: "upcoming",
        };

        return fetch("http://kkts-moviebackend.onrender.com/api/tickets/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(ticketData),
        });
      });

      const ticketResponses = await Promise.all(ticketPromises);
      const allTicketsOk = ticketResponses.every((res) => res.status === 201);

      if (allTicketsOk) {
        setBookingComplete(true);
        alert("Đặt vé thành công!");
      } else {
        setError("Một số vé không được tạo thành công. Vui lòng kiểm tra lại.");
      }
    } catch (err) {
      console.error("Lỗi booking:", err);
      setError("Lỗi server hoặc kết nối. Vui lòng thử lại sau.");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading && currentStep === 1) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    );
  }

  // Booking complete screen
  if (bookingComplete) {
    const bookingCode =
      "KKT" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Đặt vé thành công!
            </h2>
            <p className="text-gray-300 mb-6">
              Cảm ơn bạn đã đặt vé xem phim tại KKT Cinema. Thông tin vé của bạn
              đã được lưu, vui lòng kiểm tra tại phần "Vé đã đặt"!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Mã đặt vé:</span>
                <span className="text-white font-medium">{bookingCode}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Phim:</span>
                <span className="text-white font-medium">
                  {selectedMovie?.title}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Rạp:</span>
                <span className="text-white font-medium">
                  {selectedTheater?.name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Ngày:</span>
                <span className="text-white font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Giờ:</span>
                <span className="text-white font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Ghế:</span>
                <span className="text-white font-medium">
                  {selectedSeats.join(", ")}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/home")}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-all"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate("/booked-tickets")}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all"
              >
                Xem vé đã đặt
              </button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const totals = calculateTotal();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            {/* Progress bar */}
            <div className="absolute h-1 bg-gray-700 w-full top-1/2 transform -translate-y-1/2 z-0"></div>
            <div
              className="absolute h-1 bg-orange-500 top-1/2 transform -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            ></div>

            {/* Step circles */}
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  step <= currentStep
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Step labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <div className={currentStep >= 1 ? "text-orange-500" : ""}>Rạp</div>
            <div className={currentStep >= 2 ? "text-orange-500" : ""}>
              Ngày
            </div>
            <div className={currentStep >= 3 ? "text-orange-500" : ""}>
              Phim
            </div>
            <div className={currentStep >= 4 ? "text-orange-500" : ""}>Giờ</div>
            <div className={currentStep >= 5 ? "text-orange-500" : ""}>Ghế</div>
            <div className={currentStep >= 6 ? "text-orange-500" : ""}>
              Bắp nước
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">
          Đặt vé xem phim tại rạp
        </h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Select Theater */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">
                  Chọn rạp chiếu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {theaters.map((theater) => (
                    <motion.div
                      key={theater.id}
                      whileHover={{ scale: 1.03 }}
                      className={`p-6 rounded-lg cursor-pointer transition-all ${
                        selectedTheater?.id === theater.id
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedTheater(theater)}
                    >
                      <h3 className="text-xl font-bold mb-2">{theater.name}</h3>
                      <p className="text-sm opacity-80 mb-4">
                        {theater.address}
                      </p>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Mở cửa: 8:00 - 23:00</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Date */}
            {currentStep === 2 && (
              <div>
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-gray-400">Bạn đã chọn:</div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedTheater?.name}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-6">Chọn ngày</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {dates.map((date) => (
                    <motion.button
                      key={date.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-lg text-center transition-all ${
                        selectedDate === date.date
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedDate(date.date)}
                    >
                      <div className="font-medium">
                        {date.fullDate.toLocaleDateString("vi-VN", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-2xl font-bold my-1">
                        {date.fullDate.getDate()}
                      </div>
                      <div className="text-sm">
                        {date.fullDate.toLocaleDateString("vi-VN", {
                          month: "short",
                        })}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select Movie (đã đổi vị trí với Step 4) */}
            {currentStep === 3 && (
              <div>
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-gray-400">Bạn đã chọn:</div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedTheater?.name}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedDate}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-6">Chọn phim</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {movies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ scale: 1.03 }}
                      className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedMovie?.id === movie.id
                          ? "ring-4 ring-orange-500"
                          : ""
                      }`}
                      onClick={() => handleMovieSelect(movie)}
                    >
                      <div className="aspect-[2/3] relative">
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : "/images/no-poster.jpg"
                          }
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        {selectedMovie?.id === movie.id && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-full">
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                          {movie.title}
                        </h3>
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="text-white">
                            {movie.vote_average?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {movie.overview}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Select Time (đã đổi vị trí với Step 3) */}
            {currentStep === 4 && (
              <div>
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-gray-400">Bạn đã chọn:</div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedTheater?.name}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedDate}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedMovie?.title}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-6">
                  Chọn giờ chiếu
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {showtimes.map((time) => (
                    <motion.button
                      key={time.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-4 px-6 rounded-lg text-center transition-all ${
                        selectedTime === time.time
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedTime(time.time)}
                    >
                      <div className="text-xl font-bold">{time.time}</div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-3">
                    Thông tin phim
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={
                        selectedMovie?.poster_path
                          ? `https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`
                          : "/images/no-poster.jpg"
                      }
                      alt={selectedMovie?.title}
                      className="w-32 h-auto rounded-md"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {selectedMovie?.title}
                      </h4>
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-white">
                          {selectedMovie?.vote_average?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">
                        <span className="font-semibold">Ngày khởi chiếu:</span>{" "}
                        {selectedMovie?.release_date
                          ? new Date(
                              selectedMovie.release_date
                            ).toLocaleDateString("vi-VN")
                          : "Chưa xác định"}
                      </p>
                      <div className="line-clamp-3 text-gray-400 text-sm">
                        {selectedMovie?.overview}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Select Seats */}
            {currentStep === 5 && (
              <div>
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-gray-400">Bạn đã chọn:</div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedTheater?.name}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedDate}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedMovie?.title}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedTime}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-4">Chọn ghế</h2>

                <div className="mb-6 text-center">
                  <div className="w-1/2 h-2 bg-gray-600 mx-auto mb-8 rounded-lg"></div>
                  <div className="text-gray-400 mb-4">Màn hình</div>

                  <div className="flex justify-center gap-4 mb-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-800 rounded-sm mr-2"></div>
                      <span className="text-gray-300 text-sm">Trống</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-sm mr-2"></div>
                      <span className="text-gray-300 text-sm">Đã chọn</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-600 rounded-sm mr-2"></div>
                      <span className="text-gray-300 text-sm">Đã đặt</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-10 gap-2 max-w-3xl mx-auto mb-8">
                  {seats.map((seat) => (
                    <motion.button
                      key={seat.id}
                      disabled={!seat.isAvailable}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                        !seat.isAvailable
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : selectedSeats.includes(seat.id)
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                      onClick={() =>
                        seat.isAvailable && handleSeatClick(seat.id)
                      }
                    >
                      {seat.id}
                    </motion.button>
                  ))}
                </div>

                {selectedSeats.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-3">
                      Thông tin ghế đã chọn
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSeats.map((seatId) => (
                        <div
                          key={seatId}
                          className="bg-orange-500 text-white px-3 py-1 rounded-full"
                        >
                          {seatId}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Số lượng ghế:</span>
                      <span className="text-white font-medium">
                        {selectedSeats.length}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
  <span className="text-gray-300">Giá vé:</span>
  <span className="text-white font-medium">
    {(selectedMovie?.ticket_price || ticketPrice).toLocaleString("vi-VN")} VNĐ x{" "}
    {selectedSeats.length}
  </span>
</div>
                    <div className="flex justify-between mt-2 text-lg font-bold">
                      <span className="text-gray-300">Tổng tiền vé:</span>
                      <span className="text-orange-500">
                        {totals.ticketTotal.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Select Concessions */}
            {currentStep === 6 && (
              <div>
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-gray-400">Bạn đã chọn:</div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedTheater?.name}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedDate}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedMovie?.title}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedTime}
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-white">
                      {selectedSeats.length} ghế: {selectedSeats.join(", ")}
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">Bắp nước</h2>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Đồ ăn & Thức uống
                  </h3>

                  {/* Popcorn */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <div className="flex items-center">
                      <img
                        src="/images/popcorn.png"
                        alt="Bắp rang"
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div>
                        <h4 className="text-white font-bold">Bắp rang</h4>
                        <p className="text-gray-400 text-sm">
                          Bắp rang bơ truyền thống
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-white font-bold mr-4">
                        {prices.popcorn.toLocaleString("vi-VN")} VNĐ
                      </div>
                      <div className="flex items-center">
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-l-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "popcorn",
                              concessions.popcorn - 1
                            )
                          }
                        >
                          <span className="text-white text-lg">-</span>
                        </button>
                        <div className="w-10 h-8 bg-gray-600 flex items-center justify-center text-white">
                          {concessions.popcorn}
                        </div>
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-r-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "popcorn",
                              concessions.popcorn + 1
                            )
                          }
                        >
                          <span className="text-white text-lg">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pepsi */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <div className="flex items-center">
                      <img
                        src="/images/pepsi.png"
                        alt="Pepsi"
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div>
                        <h4 className="text-white font-bold">Pepsi</h4>
                        <p className="text-gray-400 text-sm">Pepsi size L</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-white font-bold mr-4">
                        {prices.pepsi.toLocaleString("vi-VN")} VNĐ
                      </div>
                      <div className="flex items-center">
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-l-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "pepsi",
                              concessions.pepsi - 1
                            )
                          }
                        >
                          <span className="text-white text-lg">-</span>
                        </button>
                        <div className="w-10 h-8 bg-gray-600 flex items-center justify-center text-white">
                          {concessions.pepsi}
                        </div>
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-r-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "pepsi",
                              concessions.pepsi + 1
                            )
                          }
                        >
                          <span className="text-white text-lg">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Combo 1 */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <div className="flex items-center">
                      <img
                        src="/images/combo1.png"
                        alt="Combo 1"
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div>
                        <h4 className="text-white font-bold">Combo 1</h4>
                        <p className="text-gray-400 text-sm">
                          1 bắp, 2 pepsi, 1 gấu bông
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-white font-bold mr-4">
                        {prices.combo1.toLocaleString("vi-VN")} VNĐ
                      </div>
                      <div className="flex items-center">
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-l-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "combo1",
                              concessions.combo1 - 1
                            )
                          }
                        >
                          <span className="text-white text-lg">-</span>
                        </button>
                        <div className="w-10 h-8 bg-gray-600 flex items-center justify-center text-white">
                          {concessions.combo1}
                        </div>
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-r-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "combo1",
                              concessions.combo1 + 1
                            )
                          }
                        >
                          <span className="text-white text-lg">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Combo 2 */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      <img
                        src="/images/combo2.png"
                        alt="Combo 2"
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div>
                        <h4 className="text-white font-bold">Combo 2</h4>
                        <p className="text-gray-400 text-sm">
                          1 bắp, 2 pepsi, 1 gấu bông, 2 cốc nước hình nhân vật
                          anime
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-white font-bold mr-4">
                        {prices.combo2.toLocaleString("vi-VN")} VNĐ
                      </div>
                      <div className="flex items-center">
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-l-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "combo2",
                              concessions.combo2 - 1
                            )
                          }
                        >
                          <span className="text-white text-lg">-</span>
                        </button>
                        <div className="w-10 h-8 bg-gray-600 flex items-center justify-center text-white">
                          {concessions.combo2}
                        </div>
                        <button
                          className="w-8 h-8 bg-gray-700 rounded-r-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                          onClick={() =>
                            handleConcessionChange(
                              "combo2",
                              concessions.combo2 + 1
                            )
                          }
                        >
                          <span className="text-white text-lg">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Tổng cộng
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Vé:</span>
                      <span className="text-white">
                        {totals.ticketTotal.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    {concessions.popcorn > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Bắp rang (x{concessions.popcorn}):
                        </span>
                        <span className="text-white">
                          {(
                            prices.popcorn * concessions.popcorn
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}
                    {concessions.pepsi > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Pepsi (x{concessions.pepsi}):
                        </span>
                        <span className="text-white">
                          {(prices.pepsi * concessions.pepsi).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}
                    {concessions.combo1 > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Combo 1 (x{concessions.combo1}):
                        </span>
                        <span className="text-white">
                          {(prices.combo1 * concessions.combo1).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}
                    {concessions.combo2 > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Combo 2 (x{concessions.combo2}):
                        </span>
                        <span className="text-white">
                          {(prices.combo2 * concessions.combo2).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-300">Tổng cộng:</span>
                        <span className="text-orange-500">
                          {totals.total.toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 rounded-md font-bold text-white text-lg transition-all bg-orange-500 hover:bg-orange-600 transform hover:scale-105"
                    >
                      Xác nhận đặt vé
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousStep}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              currentStep > 1
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            }`}
            disabled={currentStep === 1}
          >
            Quay lại
          </button>
          {currentStep < 6 && (
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all transform hover:scale-105"
            >
              {currentStep === 6 ? "Xác nhận đặt vé" : "Tiếp tục"}
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Theaters;
