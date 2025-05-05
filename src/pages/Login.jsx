"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState("");

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

    // Kiểm tra form đơn giản
    if (!formData.phone || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch("https://kkts-moviebackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Đăng nhập thành công", data); // In dữ liệu trả về để kiểm tra

      if (response.status === 200) {
        localStorage.setItem("authToken", data.token); // Lưu token vào localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.user.name,
            phone: data.user.phone,
            isAdmin: data.user.isAdmin, // Thêm các thông tin khác nếu cần
          })
        );
        console.log("Đăng nhập thành công", data);
        if (data.user.isAdmin) navigate("/admin");
        else navigate("/home"); // Chuyển hướng đến trang home
      } else {
        setError(data.message || "Số điện thoại hoặc mật khẩu không chính xác");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      console.error(err);
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        <InputField
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          showPasswordToggle={true}
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberPassword"
              checked={rememberPassword}
              onChange={() => setRememberPassword(!rememberPassword)}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label
              htmlFor="rememberPassword"
              className="ml-2 text-sm text-white"
            >
              Nhớ mật khẩu
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-sm text-white hover:text-orange-400"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth={true}>
          Đăng nhập
        </Button>

        <div className="mt-6 text-center text-white">
          <p>
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Đăng ký
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/home" className="text-sm text-gray-400 hover:text-white">
            Quay lại trang chủ
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
