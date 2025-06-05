import React, { useState } from "react";
import SidebarAdmin from "./components/SidebarAdmin";
import LoanTable from "./components/LoanTable";

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState("bukuTanah");

  const dummyData = [
    {
      userId: "user_001",
      namaPeminjam: "Andi Prasetyo",
      status: "disetujui",
      dateApproved: new Date("2025-05-25T09:00:00Z"),
      dateRequested: new Date("2025-05-24T08:00:00Z"),
      dateBorrowed: "01/06/2025",
      dateReturned: null,
      reasonIfRejected: null,
      fixDurasi: 3,
      jenisHak: "Hak Milik",
      kecamatan: "Kecamatan A",
      kelurahan: "Kelurahan A",
      keperluan: "Penelitian skripsi",
      nomorHak: 12345,
      requestDurasi: 5,
    },
    {
      userId: "user_002",
      namaPeminjam: "Budi Santoso",
      status: "menunggu",
      dateApproved: null,
      dateRequested: new Date("2025-05-26T11:00:00Z"),
      dateBorrowed: null,
      dateReturned: null,
      reasonIfRejected: null,
      fixDurasi: 1,
      jenisHak: "HGB",
      kecamatan: "Kecamatan B",
      kelurahan: "Kelurahan B",
      keperluan: "Pengurusan Sertifikat",
      nomorHak: 67890,
      requestDurasi: 2,
    },
    {
      userId: "user_003",
      namaPeminjam: "Citra Lestari",
      status: "disetujui",
      dateApproved: new Date("2025-05-20T13:00:00Z"),
      dateRequested: new Date("2025-05-19T10:00:00Z"),
      dateBorrowed: "21/05/2025",
      dateReturned: new Date("2025-05-24T16:00:00Z"),
      reasonIfRejected: null,
      fixDurasi: 3,
      jenisHak: "Hak Pakai",
      kecamatan: "Kecamatan C",
      kelurahan: "Kelurahan C",
      keperluan: "Keperluan pribadi",
      nomorHak: 54321,
      requestDurasi: 3,
    },
  ];

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
          <div className="p-4 font-semibold text-lg text-gray-800">
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

            <LoanTable data={dummyData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
