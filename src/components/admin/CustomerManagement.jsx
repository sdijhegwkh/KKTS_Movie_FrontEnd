"use client"

import { useState } from "react"

const CustomerManagement = ({ searchQuery }) => {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Triple H", phone: "0123456789", email: "tripleh@gmail.com" },
    { id: 2, name: "UnderTaker", phone: "0123456788", email: "taker@gmail.com" },
    { id: 3, name: "Roman Reigns", phone: "0123456787", email: "weak@gmail.com" },
    { id: 4, name: "RandyOrton", phone: "0123456786", email: "hatesnake@gmail.com" },
    { id: 5, name: "Sheamus", phone: "0123456785", email: "negan@gmail.com" },
    { id: 6, name: "Big Show", phone: "0123456784", email: "small@gmail.com" },
  ])

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
          Thêm khách hàng mới
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Tên khách hàng</th>
                  <th className="pb-3 pr-4">SĐT</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-700 text-white">
                    <td className="py-4 pr-4">{customer.name}</td>
                    <td className="py-4 pr-4">{customer.phone}</td>
                    <td className="py-4 pr-4">{customer.email}</td>
                    <td className="py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewCustomer(customer)}
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
                        <button className="text-green-400 hover:text-green-300 transition-colors">
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
                        <button className="text-red-400 hover:text-red-300 transition-colors">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết khách hàng</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Tên khách hàng</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">{selectedCustomer.name}</div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Số điện thoại</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">{selectedCustomer.phone}</div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">{selectedCustomer.email}</div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Số vé đã đặt</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">12</div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Tổng chi tiêu</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white">2,500,000 VND</div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                  Chỉnh sửa
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerManagement
