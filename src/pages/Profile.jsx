"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { EyeIcon, EyeOffIcon } from "../components/Icons";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    if (isEditing && formData.password) {
      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu không khớp");
        return;
      }
    }

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("authToken"); // Sửa từ authToken thành token
      console.log("Token:", token); // Debug
      if (!token) {
        setError("Bạn cần đăng nhập để cập nhật thông tin");
        navigate("/login");
        return;
      }

      // Chuẩn bị dữ liệu gửi lên backend
      const updateData = {
        name: formData.name,
        phone: formData.phone,
      };

      // Chỉ gửi mật khẩu nếu người dùng nhập mật khẩu mới
      if (formData.password && formData.password !== "") {
        updateData.password = formData.password;
        updateData.confirmPassword = formData.confirmPassword;
      }

      console.log("Update data:", updateData); // Debug
      // Gửi yêu cầu tới backend
      const response = await axios.put(
        "https://kkts-moviebackend.onrender.com/api/auth/update",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data); // Debug
      // Cập nhật thông tin người dùng
      const updatedUser = {
        ...user,
        name: response.data.user.name,
        phone: response.data.user.phone,
        isAdmin: response.data.user.isAdmin,
      };

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess(response.data.message || "Cập nhật thông tin thành công");
      setIsEditing(false);

      // Reset mật khẩu sau khi cập nhật
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("Error:", err.response?.data, err.message); // Debug
      setError(
        err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin: " + err.message
      );
    }
  };

  // If user is not logged in, redirect to login
  if (!loading && !user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Bạn chưa đăng nhập
            </h2>
            <p className="text-gray-400 mb-6">
              Vui lòng đăng nhập để xem thông tin tài khoản.
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
        <h1 className="text-3xl font-bold text-white mb-8">
          Thông tin tài khoản
        </h1>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg max-w-3xl mx-auto">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 text-green-500 rounded-md text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-8 mb-6">
                {/* Avatar Section (chỉ hiển thị thông tin, không có upload) */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src="/images/user.png" // Avatar mặc định
                      alt="Avatar"
                      className="w-40 h-40 rounded-full object-cover border-4 border-orange-500"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {user.name}
                  </h2>
                  <p className="text-gray-400">{user.phone}</p>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-2/3">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-400 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-75"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-400 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-75"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-gray-400 mb-2"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)"
                        className="w-full px-4 py-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-75"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-gray-400 mb-2"
                      >
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Xác nhận mật khẩu mới"
                          className="w-full px-4 py-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all"
                    >
                      Lưu thay đổi
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all"
                  >
                    Chỉnh sửa thông tin
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Phần Hoạt động gần đây */}
        <div className="mt-8 bg-gray-800 rounded-lg overflow-hidden shadow-lg max-w-3xl mx-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Hoạt động gần đây
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="bg-gray-700 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">
                      Đặt vé xem phim "Mật Nghị Vatican"
                    </p>
                    <p className="text-gray-400 text-sm">KKT Cinema - Quận 7</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">28/04/2023</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="bg-gray-700 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange-500"
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
                  <div>
                    <p className="text-white">
                      Đặt vé xem phim "Avengers: Endgame"
                    </p>
                    <p className="text-gray-400 text-sm">KKT Cinema - Quận 1</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">27/04/2023</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="bg-gray-700 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">Đăng nhập vào tài khoản</p>
                    <p className="text-gray-400 text-sm">Từ thiết bị mới</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">26/04/2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;