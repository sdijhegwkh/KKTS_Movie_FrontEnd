"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminOverview from "../components/admin/AdminOverview";
import MovieManagement from "../components/admin/MovieManagement";
import TicketPriceManagement from "../components/admin/TicketPriceManagement";
import CustomerManagement from "../components/admin/CustomerManagement";
import RevenueManagement from "../components/admin/RevenueManagement";
import UserManagement from "../components/admin/UserManagement";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Check if user is admin
      // In a real app, you would verify this with the backend
      if (userData.isAdmin) {
        setIsAdmin(true);
      } else {
        // Redirect non-admin users
        navigate("/home");
      }
    } else {
      // Redirect to login if not logged in
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If not admin, don't render the page
  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview searchQuery={searchQuery} />;
      case "movies":
        return <MovieManagement searchQuery={searchQuery} />;
      case "ticketPrices":
        return <TicketPriceManagement searchQuery={searchQuery} />;
      case "customers":
        return <CustomerManagement searchQuery={searchQuery} />;
      case "revenue":
        return <RevenueManagement searchQuery={searchQuery} />;
      case "users":
        return <UserManagement searchQuery={searchQuery} />;
      default:
        return <AdminOverview searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">{renderContent()}</main>

        {/* Footer */}
        <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
          <div className="flex justify-between items-center">
            <div>
              <p>
                KKT VietNam © {new Date().getFullYear()} - All rights reserved
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-500 transition-colors">
                Terms and Conditions
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                Contact us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Admin;
