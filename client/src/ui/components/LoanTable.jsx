import React from "react";
import getTokenPayload from "../../utils/checkToken";

const statusColorMap = {
  menunggu: "bg-yellow-100 text-yellow-700", // Menunggu persetujuan
  disetujui: "bg-blue-100 text-blue-700", // Sudah disetujui, belum diambil
  diterima: "bg-purple-100 text-purple-700", // Sedang dipinjam
  telat: "bg-orange-100 text-orange-700", // Melebihi waktu peminjaman
  dikembalikan: "bg-green-100 text-green-700", // Sudah dikembalikan
  ditolak: "bg-red-100 text-red-700", // Tidak disetujui
};

function LoanTable({ data }) {
  const user = getTokenPayload();
  const userRole = user?.role;
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
          {data.map((row, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{index + 1}</td>
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
                <button
                  onClick={() => alert(row.keperluan || "Tidak ada info")}
                  className="text-lg font-bold mr-2"
                >
                  !
                </button>
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
    </div>
  );
}

export default LoanTable;
