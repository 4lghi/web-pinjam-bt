
import { useState, useEffect } from "react"
import { Info, Check, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

const RequestTable = ({
  data,
  handleRejectModal = (id) => console.log("Default reject", id),
  handleDelete = (id) => console.log("Default delete", id),
  handleAccept = (id) => {
    console.log("Default accept", id)
  },
  jenis,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [tooltipOpen, setTooltipOpen] = useState(null)

  // Pagination calculations
  const totalItems = data?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data?.slice(startIndex, endIndex) || []

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setTooltipOpen(null)
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const toggleTooltip = (index) => {
    setTooltipOpen(tooltipOpen === index ? null : index)
  }

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setTooltipOpen(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

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
        <div className="text-gray-400 text-xl mb-2">📋</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Tidak ada data</h3>
        <p className="text-sm text-gray-500">Belum ada permintaan peminjaman yang tersedia.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4 relative z-10">
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
        <div className="text-sm text-gray-600">{totalItems} total</div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="rounded-lg border bg-white shadow-sm overflow-visible">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="w-[4%] px-2 py-2 text-center text-sm font-semibold text-gray-900">No</th>
                <th className="w-[15%] px-2 py-2 text-left text-sm font-semibold text-gray-900">Nama Peminjam</th>
                <th className="w-[8%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Seksi</th>
                <th className="w-[12%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Jenis Hak</th>
                <th className="w-[12%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Nomor Hak</th>
                <th className="w-[15%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Lokasi</th>
                <th className="w-[10%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Tgl Pinjam</th>
                <th className="w-[8%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Durasi</th>
                <th className="w-[6%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Info</th>
                <th className="w-[10%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Proses</th>
                <th className="w-[6%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.map((item, index) => {
                const actualIndex = startIndex + index

                return (
                  <tr key={item.id || actualIndex} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-2 text-center text-sm text-gray-600">{actualIndex + 1}</td>
                    <td className="px-2 py-2">
                      <div className="text-sm font-medium text-gray-900 truncate text-left">
                        {item.namaPeminjam || "N/A"}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-sm text-gray-700 truncate inline-block">{item.seksi || "N/A"}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-sm text-gray-700 truncate inline-block">{item.jenisHak || "N/A"}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800 inline-block">
                        {item.nomorHak || "N/A"}
                      </code>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 truncate text-xs">{item.kelurahan || "N/A"}</div>
                        <div className="text-gray-500 truncate text-xs">{item.kecamatan || "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-sm text-gray-600 inline-block truncate">{item.tglPinjam || "N/A"}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-sm font-medium text-gray-900 inline-block truncate">
                        {item.durasi || "N/A"} Hari
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <div className="relative inline-block">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTooltip(actualIndex)
                          }}
                        >
                          <Info className="h-4 w-4 text-gray-600" />
                        </button>
                        {tooltipOpen === actualIndex && (
                          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-64 p-3 text-sm bg-white border border-gray-200 text-gray-800 rounded-lg shadow-lg z-[9998] whitespace-normal">
                            {item.keperluan || "Tidak ada keterangan"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => handleAccept(item.id, jenis)}
                          className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                          title="Terima"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectModal(item.id, jenis)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                          title="Tolak"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => handleDelete(item.id, jenis)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
        {currentData.map((item, index) => {
          const actualIndex = startIndex + index

          return (
            <div key={item.id || actualIndex} className="rounded-lg border bg-white shadow-sm p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.namaPeminjam || "N/A"}</h3>
                  <p className="text-xs text-gray-500">
                    #{actualIndex + 1} • {item.seksi || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAccept(item.id, jenis)}
                      className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                      title="Terima"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleRejectModal(item.id)}
                      className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Tolak"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Jenis Hak:</span>
                  <p className="font-medium text-sm">{item.jenisHak || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Nomor Hak:</span>
                  <p className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded mt-1">{item.nomorHak || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Lokasi:</span>
                  <p className="font-medium text-sm">{item.kelurahan || "N/A"}</p>
                  <p className="text-gray-600 text-xs">{item.kecamatan || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Durasi:</span>
                  <p className="font-medium text-sm">{item.durasi || "N/A"} Hari</p>
                </div>
                <div>
                  <span className="text-gray-500">Tgl Pinjam:</span>
                  <p className="font-medium text-sm">{item.tglPinjam || "N/A"}</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-gray-500 text-xs">Keperluan:</span>
                    <p className="text-xs mt-1 text-gray-700">{item.keperluan || "Tidak ada keterangan"}</p>
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
                            ? "z-10 bg-[#022B3A] text-white"
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

export default RequestTable
