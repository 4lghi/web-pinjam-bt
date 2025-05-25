import React, { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState("bukuTanah");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarAdmin />
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 ml-60">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold">Pinjam BT/SU</h1>
          <div className="flex items-center space-x-4">
            <a href="/src/notif_user.html" className="relative cursor-pointer">
              <span className="absolute z-50 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
              <ion-icon class="text-xl mt-2" name="notifications"></ion-icon>
            </a>
            <div className="flex items-center gap-2">
              <i className="bi bi-person-circle text-xl"></i>{" "}
              <span className="font-semibold">User</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-4 bg-yellow-100 p-6 rounded-lg shadow">
            <div className="text-yellow-800 text-3xl">⚠️</div>
            <div>
              <div className="text-gray-700">Terlambat</div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-red-100 p-6 rounded-lg shadow">
            <div className="text-red-800 text-3xl">❌</div>
            <div>
              <div className="text-gray-700">Belum Dikembalikan</div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>
        </div>

        {/* Borrow Table Section */}
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="p-4 font-semibold text-lg border-b text-gray-800">
            Daftar Peminjaman Belum Dikembalikan
          </div>

          <div className="p-4">
            <input
              type="text"
              placeholder="Cari nama peminjam atau nomor dokumen..."
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setActiveTab("bukuTanah")}
                className={`px-4 py-2 rounded-xl shadow font-semibold ${
                  activeTab === "bukuTanah"
                    ? "bg-[#022B3A] text-white"
                    : "bg-white text-gray-800 hover:bg-[#022B3A] hover:text-white"
                }`}
              >
                Buku Tanah
              </button>
              <button
                onClick={() => setActiveTab("suratUkur")}
                className={`px-4 py-2 rounded-xl shadow font-semibold ${
                  activeTab === "suratUkur"
                    ? "bg-[#022B3A] text-white"
                    : "bg-white text-gray-800 hover:bg-[#022B3A] hover:text-white"
                }`}
              >
                Surat Ukur
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-xl overflow-hidden">
                <thead className="bg-white text-gray-800">
                  <tr className="border border-gray-300">
                    {[
                      "No",
                      "Nama",
                      "Seksi",
                      "Jenis Hak",
                      "Nomor Hak",
                      "Kecamatan",
                      "Kelurahan",
                      "Tgl Pinjam",
                      "Durasi",
                      "Status",
                      "Info",
                    ].map((header, i) => (
                      <th key={i} className="px-4 py-2 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {/* Data kosong, akan diisi dari API */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
