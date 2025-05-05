"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueManagement = ({ searchQuery }) => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0,
  });
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch revenue data from API
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("http://kkts-moviebackend.onrender.com/api/booking/revenue", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Lỗi khi tải dữ liệu doanh thu: ${response.status}`);
        }

        const data = await response.json();
        console.log("Revenue API response:", data);

        setRevenueData({
          totalRevenue: data.totalRevenue || 0,
          monthlyRevenue: data.monthlyRevenue || 0,
          weeklyRevenue: data.weeklyRevenue || 0,
          dailyRevenue: data.dailyRevenue || 0,
        });
        setMonthlyRevenueData(data.monthlyRevenueData || []);
      } catch (error) {
        console.error("Error fetching revenue data:", error.message);
        setError(error.message || "Không thể tải dữ liệu doanh thu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Chart data and options
  const chartData = {
    labels: monthlyRevenueData.map((item) => item.month),
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: monthlyRevenueData.map((item) => (item.revenue / 1000000).toFixed(1)),
        backgroundColor: "rgba(249, 115, 22, 0.6)", // Orange-500 with opacity
        borderColor: "rgba(249, 115, 22, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(249, 115, 22, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} triệu VND`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#d1d5db", // Gray-300
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#d1d5db",
          font: {
            size: 12,
          },
          callback: (value) => `${value}M`,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        title: {
          display: true,
          text: "Doanh thu (triệu VND)",
          color: "#fff",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
        <div>
          <p className="mt-2 text-gray-600">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  // Hiển thị loading nếu đang tải
  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý doanh thu</h1>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100">Tổng doanh thu</p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {revenueData.totalRevenue.toLocaleString("vi-VN")} VND
              </h2>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100">Doanh thu tháng</p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {revenueData.monthlyRevenue.toLocaleString("vi-VN")} VND
              </h2>
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100">Doanh thu tuần</p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {revenueData.weeklyRevenue.toLocaleString("vi-VN")} VND
              </h2>
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-100">Doanh thu ngày</p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {revenueData.dailyRevenue.toLocaleString("vi-VN")} VND
              </h2>
            </div>
            <div className="bg-red-400 bg-opacity-30 p-3 rounded-full">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Biểu đồ doanh thu theo tháng</h2>
          {monthlyRevenueData.length === 0 ? (
            <p className="text-gray-400">Không có dữ liệu doanh thu</p>
          ) : (
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;