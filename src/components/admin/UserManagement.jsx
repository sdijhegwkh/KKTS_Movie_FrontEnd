"use client";

import { useState, useEffect } from "react";

const UserManagement = ({ searchQuery }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Khách hàng",
  });
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);

  // Fetch users from backend on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://kkts-moviebackend.onrender.com/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách người dùng');
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`https://kkts-moviebackend.onrender.com/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingUser.name,
          phone: editingUser.phone,
          role: editingUser.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteConfirmation = (user) => {
    setDeleteConfirmation(user);
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmation) return;

    try {
      const response = await fetch(`https://kkts-moviebackend.onrender.com/api/users/${deleteConfirmation.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deleteConfirmation.id)
      );
      setDeleteConfirmation(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
    setError(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setNewUser({
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "Khách hàng",
    });
    setError(null);
    setAddError(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setError(null);
    setAddError(null);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    // Client-side validation
    if (!newUser.name || !newUser.phone || !newUser.password || !newUser.confirmPassword) {
      setAddError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!/^\d{10}$/.test(newUser.phone)) {
      setAddError('Số điện thoại phải có đúng 10 chữ số');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setAddError('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const response = await fetch('https://kkts-moviebackend.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          phone: newUser.phone,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const createdUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, createdUser]);
      setIsAddModalOpen(false);
      setNewUser({
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "Khách hàng",
      });
      setError(null);
      setAddError(null);
    } catch (err) {
      setAddError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Thêm người dùng mới
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Tên người dùng</th>
                  <th className="pb-3 pr-4">SĐT</th>
                  <th className="pb-3 pr-4">Vai trò</th>
                  <th className="pb-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700 text-white"
                  >
                    {editingUser && editingUser.id === user.id ? (
                      <>
                        <td className="py-4 pr-4">
                          <input
                            type="text"
                            name="name"
                            value={editingUser.name}
                            onChange={handleEditChange}
                            className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                          />
                        </td>
                        <td className="py-4 pr-4">
                          <input
                            type="text"
                            name="phone"
                            value={editingUser.phone}
                            onChange={handleEditChange}
                            className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                          />
                        </td>
                        <td className="py-4 pr-4">
                          <select
                            name="role"
                            value={editingUser.role}
                            onChange={handleEditChange}
                            className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Khách hàng">Khách hàng</option>
                          </select>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-400 hover:text-green-300 transition-colors"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-400 hover:text-red-300 transition-colors"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 pr-4">{user.name}</td>
                        <td className="py-4 pr-4">{user.phone}</td>
                        <td className="py-4 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "Admin"
                                ? "bg-purple-500 bg-opacity-20 text-white"
                                : "bg-blue-500 bg-opacity-20 text-white"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Xem chi tiết"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              title="Chỉnh sửa"
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
                            <button
                              onClick={() => handleDeleteConfirmation(user)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Xóa"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết người dùng</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Tên người dùng
                </label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">
                  {selectedUser.name}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Số điện thoại
                </label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">
                  {selectedUser.phone}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Vai trò
                </label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">
                  {selectedUser.role}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm người dùng mới</h2>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-400 hover:text-white"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập tên người dùng"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Vai trò
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleAddChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full"
                >
                  <option value="Khách hàng">Khách hàng</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {addError && (
                <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
                  {addError}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCloseAddModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Xác nhận xóa</h2>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-white"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-white">
                Bạn có chắc chắn muốn xóa người dùng{" "}
                <span className="font-bold">{deleteConfirmation.name}</span>?
              </p>
              <p className="text-gray-400 text-sm">
                Hành động này không thể hoàn tác.
              </p>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;