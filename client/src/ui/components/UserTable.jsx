import { useState } from "react"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

const UserTable = ({ data, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Pagination calculations
  const totalItems = data?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data?.slice(startIndex, endIndex) || []

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  // Validasi data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-xl mb-2">⚠️</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Data tidak tersedia</h3>
        <p className="text-sm text-gray-500">Data belum dimuat atau terjadi kesalahan.</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-xl mb-2">👥</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Tidak ada pengguna</h3>
        <p className="text-sm text-gray-500">Belum ada pengguna yang terdaftar dalam sistem.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Items per page selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">per halaman</span>
        </div>
        <div className="text-sm text-gray-600">{totalItems} total pengguna</div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="w-[10%] px-4 py-3 text-left text-sm font-semibold text-gray-900">No</th>
                <th className="w-[25%] px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama Seksi</th>
                <th className="w-[20%] px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="w-[25%] px-4 py-3 text-left text-sm font-semibold text-gray-900">Password</th>
                <th className="w-[20%] px-4 py-3 text-center text-sm font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.map((user, index) => {
                const actualIndex = startIndex + index

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600">{actualIndex + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "Admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-800">
                        {user.password}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onEdit?.(user)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete?.(user.id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {currentData.map((user, index) => {
          const actualIndex = startIndex + index

          return (
            <div key={user.id} className="rounded-lg border bg-white shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{user.namaSeksi}</h3>
                  <p className="text-xs text-gray-500">#{actualIndex + 1}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(user)}
                    className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDelete?.(user.id)}
                    className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Role:</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "Admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Password:</span>
                  <div className="mt-1">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-800">
                      {user.password}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {startIndex + 1}-{Math.min(endIndex, totalItems)} dari {totalItems}
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === currentPage
                            ? "z-10 bg-sky-900 text-white"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700 ring-1 ring-inset ring-gray-300"
                      >
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTable
