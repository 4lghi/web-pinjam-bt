import React, {useState} from "react";
import getTokenPayload from "../../utils/checkToken";

const statusColorMap = {
  menunggu: "bg-yellow-100 text-yellow-700", // Menunggu persetujuan
  disetujui: "bg-blue-100 text-blue-700", // Sudah disetujui, belum diambil
  dipinjam: "bg-purple-100 text-purple-700", // Sedang dipinjam
  telat: "bg-orange-100 text-orange-700", // Melebihi waktu peminjaman
  dikembalikan: "bg-green-100 text-green-700", // Sudah dikembalikan
  ditolak: "bg-red-100 text-red-700", // Tidak disetujui
};

function LoanTable({ data }) {
  const user = getTokenPayload();
  const userRole = user?.role;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-xl overflow-hidden">
        <thead className="bg-white text-gray-800">
          <tr className="border">
            <th className="px-4 py-2 text-left">No</th>
            <th className="px-4 py-2 text-left">Nama Peminjam</th>
            <th className="px-4 py-2 text-left">Jenis Hak</th>
            <th className="px-4 py-2 text-left">Nomor Hak</th>
            <th className="px-4 py-2 text-left">Kecamatan</th>
            <th className="px-4 py-2 text-left">Kelurahan</th>
            <th className="px-4 py-2 text-left">Tanggal Pinjam</th>
            <th className="px-4 py-2 text-left">Durasi</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{indexOfFirstRow + index + 1}</td>
              <td className="px-4 py-2">{row.namaPeminjam}</td>
              <td className="px-4 py-2">{row.jenisHak}</td>
              <td className="px-4 py-2">{row.nomorHak}</td>
              <td className="px-4 py-2">{row.kecamatan}</td>
              <td className="px-4 py-2">{row.kelurahan}</td>
              <td className="px-4 py-2">{row.dateBorrowed}</td>
              <td className="px-4 py-2">{row.fixDurasi}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    statusColorMap[row.status] || ""
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-2 relative">
                <div className="relative inline-block group">
                  <span className="text-lg font-bold cursor-default">!</span>

                  {/* Tooltip muncul saat hover */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 p-2 text-sm bg-gray-800 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-pre-wrap">
                    {row.keperluan}
                  </div>
                </div>

                {userRole === "admin" && (
                  <div className="inline-block relative group">
                    <button className="text-black text-lg">⋮</button>
                    <div className="dropdown-menu hidden group-hover:block absolute bg-white border rounded shadow-md right-0 mt-2 z-10">
                      <ul>
                        <li>
                          <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
                            ✏️ Edit
                          </button>
                        </li>
                        <li>
                          <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
                            🗑️ Hapus
                          </button>
                        </li>
                        <li>
                          <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
                            🔄 Edit Status
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-2 py-1 rounded border bg-white hover:bg-[#022B3A] hover:text-white cursor-pointer"
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {(() => {
          const pages = [];
          const maxVisible = 10;
          const currentGroup = Math.floor((currentPage - 1) / maxVisible);
          const start = currentGroup * maxVisible + 1;
          const end = Math.min(start + maxVisible - 1, totalPages);

          // Tombol ... sebelum (grup sebelumnya)
          if (start > 1) {
            pages.push(
              <button
                key="prevGroup"
                onClick={() => handlePageChange(start - 1)}
                className="px-3 py-1 rounded-full border bg-white hover:bg-gray-100 cursor-pointer"
              >
                ...
              </button>
            );
          }

          // Tombol-tombol nomor halaman
          for (let i = start; i <= end; i++) {
            pages.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1 rounded-full border ${
                  i === currentPage ? "bg-[#022B3A] text-white cursor-pointer" : "bg-white hover:bg-[#022B3A] hover:text-white cursor-pointer"
                }`}
              >
                {i}
              </button>
            );
          }

          // Tombol ... sesudah (grup selanjutnya)
          if (end < totalPages) {
            pages.push(
              <button
                key="nextGroup"
                onClick={() => handlePageChange(end + 1)}
                className="px-3 py-1 rounded-full border bg-white hover:bg-gray-100 cursor-pointer"
              >
                ...
              </button>
            );
          }

          return pages;
        })()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-2 py-1 rounded border bg-white hover:bg-[#022B3A] hover:text-white cursor-pointer"
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>



    </div>
  );
}

export default LoanTable;
