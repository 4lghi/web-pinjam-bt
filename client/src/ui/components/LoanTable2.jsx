
import { useState, useEffect, useRef } from "react"
import { Edit, Info, MoreHorizontal, RotateCcw, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import getTokenPayload from "../../utils/getTokenPayload"

const statusColorMap = {
  menunggu: "bg-yellow-100 text-yellow-700",
  dipinjam: "bg-purple-100 text-purple-700",
  dikembalikan: "bg-green-100 text-green-700",
  telat: "bg-orange-100 text-orange-700",
  disetujui: "bg-blue-100 text-blue-700",
  ditolak: "bg-red-100 text-red-700", // untuk data sample
}

const formatDateTime = (dateString) => {
  if (!dateString || dateString === "N/A") return { date: "N/A", time: "" }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return { date: dateString, time: "" }

    // Format tanggal: DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()

    // Format jam: HH:MM
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`,
    }
  } catch (error) {
    return { date: dateString, time: "" }
  }
}

export default function LoanTable({
  data,
  onAction = () => {
    console.log("Action triggered")
  },
  selectedRows = [],
  setSelectedRows,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [tooltipOpen, setTooltipOpen] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const dropdownRefs = useRef({})
  const user = getTokenPayload()
  const userRole = user?.role

  // Pagination calculations
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handleAction = (action, index) => {
    onAction(action, data[index])
    setDropdownOpen(null)
  }

  const toggleTooltip = (index) => {
    setTooltipOpen(tooltipOpen === index ? null : index)
  }

  const toggleDropdown = (index, isMobile = false) => {
    const key = isMobile ? `mobile-${index}` : index

    if (dropdownOpen === key) {
      setDropdownOpen(null)
      return
    }

    // Calculate position
    const buttonElement = dropdownRefs.current[key]
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const dropdownHeight = 120 // Approximate height of dropdown

      // Check if there's enough space below
      const spaceBelow = viewportHeight - rect.bottom
      const shouldShowAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight

      setDropdownPosition({
        [key]: shouldShowAbove ? "above" : "below",
      })
    }

    setDropdownOpen(key)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setDropdownOpen(null)
    setTooltipOpen(null)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null)
      setTooltipOpen(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Validasi data
  if (!data) {
    console.warn("LoanTable: data is null or undefined")
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-xl mb-2">⚠️</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Data tidak tersedia</h3>
        <p className="text-sm text-gray-500">Data belum dimuat atau terjadi kesalahan.</p>
      </div>
    )
  }

  if (!Array.isArray(data)) {
    console.warn("LoanTable: data is not an array:", typeof data)
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-xl mb-2">⚠️</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Format data salah</h3>
        <p className="text-sm text-gray-500">Data harus berupa array.</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-xl mb-2">📋</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Tidak ada data</h3>
        <p className="text-sm text-gray-500">Belum ada data peminjaman yang tersedia.</p>
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
                <th className="w-[3%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Pilih</th>
                <th className="w-[3%] px-2 py-2 text-center text-sm font-semibold text-gray-900">No</th>
                <th className="w-[8%] px-2 py-2 text-left text-sm font-semibold text-gray-900">Peminjam</th>
                <th className="w-[9%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Seksi</th>
                <th className="w-[11%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Jenis Hak</th>
                <th className="w-[12%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Nomor Hak</th>
                <th className="w-[13%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Lokasi</th>
                <th className="w-[10%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Tanggal Pinjam</th>
                <th className="w-[7%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Durasi</th>
                <th className="w-[9%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Status</th>
                <th className="w-[7%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Keperluan</th>
                {userRole === "admin" && (
                  <th className="w-[5%] px-2 py-2 text-center text-sm font-semibold text-gray-900">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.map((row, index) => {
                // Validasi setiap row
                if (!row) {
                  console.warn(`Row ${index} is null or undefined`)
                  return null
                }

                const actualIndex = startIndex + index
                const isDropdownAbove = dropdownPosition[actualIndex] === "above"

                return (
                  <tr key={row.id || actualIndex} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked
                          const newSelectedRows = isChecked
                            ? [...selectedRows, row.id]
                            : selectedRows.filter((id) => id !== row.id)
                          setSelectedRows(newSelectedRows)
                        }}
                      />
                    </td>
                    <td className="px-2 py-2 text-center text-sm text-gray-600">{actualIndex + 1}</td>
                    <td className="px-2 py-2">
                      <div className="text-sm font-medium text-gray-900 truncate text-left">
                        {row.namaPeminjam || row.nama_peminjam || row.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-sm text-gray-700 truncate inline-block">
                        {row.userId || row.section || "N/A"}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-sm text-gray-700 truncate inline-block">
                        {row.jenisHak || row.jenis_hak || row.type || "N/A"}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800 inline-block">
                        {row.nomorHak || row.nomor_hak || row.number || "N/A"}
                      </code>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 truncate text-xs">{row.kelurahan || "N/A"}</div>
                        <div className="text-gray-500 truncate text-xs">{row.kecamatan || "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {(() => {
                        const { date, time } = formatDateTime(
                          row.dateBorrowed || row.date_borrowed || row.tanggal_pinjam,
                        )

                        if (date === "N/A") {
                          return <span className="text-sm text-gray-600 inline-block truncate">N/A</span>
                        }

                        return (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{date}</div>
                            {time && <div className="text-xs text-gray-500">{time}</div>}
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-sm font-medium text-gray-900 inline-block truncate">
                        {(() => {
                          const durasi = row.fixDurasi || row.fix_durasi || row.durasi || row.duration

                          if (durasi === 7) return "1 Minggu"
                          if (durasi === 3) return "3 Hari"
                          if (durasi === 1) return "1 Hari"
                          return "N/A"
                        })()}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                          statusColorMap[row.status] || "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {row.status || "Unknown"}
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
                        {/* Tooltip dengan click */}
                        {tooltipOpen === actualIndex && (
                          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-64 p-3 text-sm bg-white border border-gray-200 text-gray-800 rounded-lg shadow-lg z-[9998] whitespace-normal">
                            {row.keperluan || row.purpose || row.keterangan || "Tidak ada keterangan"}
                          </div>
                        )}
                      </div>
                    </td>
                    {userRole === "admin" && (
                      <td className="px-2 py-2 text-center">
                        <div className="relative inline-block">
                          <button
                            ref={(el) => (dropdownRefs.current[actualIndex] = el)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleDropdown(actualIndex)
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </button>
                          {dropdownOpen === actualIndex && (
                            <div
                              className={`absolute right-0 ${
                                isDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
                              } min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg z-[9999]`}
                            >
                              <button
                                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors"
                                onClick={() => handleAction("edit", actualIndex)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </button>
                              <button
                                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors"
                                onClick={() => handleAction("status", actualIndex)}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Edit Status
                              </button>
                              <button
                                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 text-red-600 transition-colors"
                                onClick={() => handleAction("delete", actualIndex)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {currentData.map((row, index) => {
          if (!row) return null

          const actualIndex = startIndex + index
          const mobileKey = `mobile-${actualIndex}`
          const isDropdownAbove = dropdownPosition[mobileKey] === "above"

          return (
            <div key={row.id || actualIndex} className="rounded-lg border bg-white shadow-sm p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {row.namaPeminjam || row.nama_peminjam || row.name || "N/A"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    #{actualIndex + 1} • {row.userId || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                      statusColorMap[row.status] || "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {row.status || "Unknown"}
                  </span>
                  {userRole === "admin" && (
                    <div className="relative">
                      <button
                        ref={(el) => (dropdownRefs.current[mobileKey] = el)}
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleDropdown(actualIndex, true)
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </button>
                      {dropdownOpen === mobileKey && (
                        <div
                          className={`absolute right-0 ${
                            isDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
                          } min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg z-50`}
                        >
                          <button
                            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
                            onClick={() => handleAction("edit", actualIndex)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </button>
                          <button
                            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
                            onClick={() => handleAction("status", actualIndex)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Edit Status
                          </button>
                          <button
                            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 text-red-600"
                            onClick={() => handleAction("delete", actualIndex)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Jenis Hak:</span>
                  <p className="font-medium text-sm">{row.jenisHak || row.jenis_hak || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Nomor Hak:</span>
                  <p className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded mt-1">
                    {row.nomorHak || row.nomor_hak || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Lokasi:</span>
                  <p className="font-medium text-sm">{row.kelurahan || "N/A"}</p>
                  <p className="text-gray-600 text-xs">{row.kecamatan || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Durasi:</span>
                  <p className="font-medium text-sm">{row.fixDurasi || row.durasi || "N/A"}</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-gray-500 text-xs">Keperluan:</span>
                    <p className="text-xs mt-1 text-gray-700">
                      {row.keperluan || row.purpose || "Tidak ada keterangan"}
                    </p>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {(() => {
                    const { date, time } = formatDateTime(row.dateBorrowed || row.date_borrowed || row.tanggal_pinjam)

                    if (date === "N/A") {
                      return <>Dipinjam: N/A</>
                    }

                    return (
                      <>
                        Dipinjam: <span className="font-medium text-gray-700">{date}</span>
                        {time && <span className="text-gray-500"> {time}</span>}
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between  px-4 py-3">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            ? "z-10 bg-blue-600 text-white"
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
