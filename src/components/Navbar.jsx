"use client";

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component được tải
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/home");
  };

  const handleTheaterClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/theaters");
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="KKT Logo"
            className="w-20 h-14 mr-2"
          />
          <span className="text-xl font-bold text-orange-500">
            KKTMovieTicket
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/home"
            className="text-white hover:text-orange-500 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            to="/now-showing"
            className="text-white hover:text-orange-500 transition-colors"
          >
            Phim đang chiếu
          </Link>
          <Link
            to="/coming-soon"
            className="text-white hover:text-orange-500 transition-colors"
          >
            Phim sắp chiếu
          </Link>
          <button
            onClick={handleTheaterClick}
            className="text-white hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer"
          >
            Rạp chiếu
          </button>
          <Link
            to="/promotions"
            className="text-white hover:text-orange-500 transition-colors"
          >
            Khuyến mãi
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-white hover:text-orange-500 focus:outline-none"
              >
                <img
                  src={user.avatar || "/images/user.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline">
                  {user.name || "Tài khoản"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
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

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>
                  <Link
                    to="/booked-tickets"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Vé đã đặt
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md transition-all transform hover:scale-105"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden md:block px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-md transition-all transform hover:scale-105"
              >
                Đăng ký
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link
              to="/home"
              className="text-white hover:text-orange-500 py-2 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/now-showing"
              className="text-white hover:text-orange-500 py-2 transition-colors"
            >
              Phim đang chiếu
            </Link>
            <Link
              to="/coming-soon"
              className="text-white hover:text-orange-500 py-2 transition-colors"
            >
              Phim sắp chiếu
            </Link>
            <button
              onClick={handleTheaterClick}
              className="text-white hover:text-orange-500 py-2 transition-colors text-left bg-transparent border-none cursor-pointer"
            >
              Rạp chiếu
            </button>
            <Link
              to="/promotions"
              className="text-white hover:text-orange-500 py-2 transition-colors"
            >
              Khuyến mãi
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-orange-500 py-2 transition-colors"
                >
                  Thông tin tài khoản
                </Link>
                <Link
                  to="/booked-tickets"
                  className="text-white hover:text-orange-500 py-2 transition-colors"
                >
                  Vé đã đặt
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-orange-500 py-2 transition-colors text-left bg-transparent border-none"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-md transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
