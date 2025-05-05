"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");// Quản lý lỗi


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Kiểm tra mật khẩu và xác nhận mật khẩu
    if(formData.password !== formData.confirmPassword){
      setError("Mật khẩu không khớp");
      return;
    }

    try{
      //Gửi yêu cầu đăng ký tới backend
      const response = await fetch("http://kkts-moviebackend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
        },
        body: JSON.stringify(formData), // Chuyển đổi dữ liệu thành JSON
      });

      if(response.status === 201){
        //Đăng ký thành công
        console.log("Đăng ký thành công", response.data);
        
        navigate("/login");
      }
    }catch(err){
      // Xử lý lỗi khi gửi yêu cầu (lỗi từ backend)
      setError(err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  return (
    <AuthLayout title="Đăng ký">
      <form onSubmit={handleSubmit}>
        <InputField
          type="text"
          name="name"
          placeholder="Tên của bạn"
          value={formData.name}
          onChange={handleChange}
        />

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

        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPasswordToggle={true}
        />

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeToTerms}
            onChange={() => setAgreeToTerms(!agreeToTerms)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="agreeTerms" className="ml-2 text-sm text-white">
            Đồng ý với điều khoản của KKTMovieTicket
          </label>
        </div>

        <Button type="submit" variant="primary" fullWidth={true}>
          Đăng ký
        </Button>

        <div className="mt-6 text-center text-white">
          <p>
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Đăng nhập
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

export default Register;
