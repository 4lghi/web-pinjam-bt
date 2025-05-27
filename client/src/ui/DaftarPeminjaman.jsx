import React, { useEffect, useState } from "react";
import SidebarAdmin from "./components/SidebarAdmin";
import LoanTable from "./components/LoanTable";

function DaftarPeminjaman() {
  const [activeTab, setActiveTab] = useState("bukuTanah");

  const showStatusModal = () => {
    alert("Fungsi ubah status belum diimplementasikan");
  };

  const toggleMenu = (e) => {
    const menu = e.currentTarget.nextElementSibling;
    menu.classList.toggle("hidden");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModalForm = () => setIsModalOpen(false);

  const exportToExcel = () => {
    // tambahkan logika export di sini
  };

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
      status: "menunggu persetujuan",
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
      dateBorrowed:"21/05/2025",
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
    <div className="flex min-h-screen font-sans bg-gray-100 text-sm text-gray-800">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 ml-60 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Search */}
          <div className="relative w-[550px]">
            <input
              type="text"
              placeholder="Cari peminjaman"
              className="w-full pl-10 pr-20 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <i className="bi bi-search absolute left-3 top-2.5 text-gray-400"></i>
            <button className="h-full absolute right-[0.5px] top-[0.5px] bottom-1 px-4 bg-transparent text-black rounded-full hover:bg-slate-200 transition">
              Search
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifikasi */}
            <a href="/src/notif_admin.html">
              <span className="cursor-pointer relative">
                <span className="absolute z-50 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
                <ion-icon class="text-xl mt-2" name="notifications"></ion-icon>
              </span>
            </a>

            {/* Filter Dropdown */}
            <div className="relative">
              <button onClick={toggleDropdown}>
                <div className="cursor-pointer rounded-lg flex items-center gap-2 mt-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0l-2.01-2.01a.99.99 0 0 1-.29-.83V12h-.03L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L14.03 12z"
                    />
                  </svg>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-2 w-32 bg-white shadow rounded">
                  <ul className="text-sm text-gray-700">
                    {[
                      "Terbaru",
                      "Terlama",
                      "Tenggat Waktu",
                      "Dipinjam",
                      "Dikembalikan",
                      "Ditolak",
                      "Telat",
                    ].map((label, index) => (
                      <li key={index}>
                        <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox text-green-500 mr-2"
                            defaultChecked={["Terbaru", "Terlama"].includes(
                              label
                            )}
                          />
                          {label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Export & Tambah */}
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Export
            </button>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-sky-900 text-white rounded-lg"
            >
              + Tambah
            </button>

            {/* Admin Info */}
            <div className="flex items-center gap-2">
              <i className="bi bi-person-circle text-xl"></i> <span>Admin</span>
            </div>
          </div>

          {/* Modal Tambah Peminjaman */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[700px] relative">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">Tambah Peminjaman</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Kolom kiri */}
                  <div className="space-y-3">
                    <div>
                      <label>Jenis Peminjaman</label>
                      <select className="w-full border rounded-lg px-3 py-2">
                        <option>Buku Tanah</option>
                        <option>Surat Ukur</option>
                      </select>
                    </div>
                    <div>
                      <label>Nama Peminjam</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label>Jenis Hak</label>
                      <select className="w-full border rounded-lg px-3 py-2">
                        <option>Hak Milik</option>
                        <option>Hak Guna Bangunan</option>
                        <option>Hak Pakai</option>
                        <option>Hak Wakaf</option>
                        <option>Hak Tanggungan</option>
                        <option>Hak Pengelolaan</option>
                      </select>
                    </div>
                    <div>
                      <label>Nomor Hak</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label>Pilih Seksi</label>
                      <select className="w-full border rounded-lg px-3 py-2">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>TU</option>
                      </select>
                    </div>
                  </div>

                  {/* Kolom kanan */}
                  <div className="space-y-3">
                    <div>
                      <label>Kecamatan</label>
                      <select className="w-full border rounded-lg px-3 py-2">
                        <option>...</option>
                      </select>
                    </div>
                    <div>
                      <label>Kelurahan</label>
                      <select className="w-full border rounded-lg px-3 py-2">
                        <option>...</option>
                      </select>
                    </div>
                    <div>
                      <label>Tanggal Peminjaman</label>
                      <input
                        type="date"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label>Durasi Peminjaman</label>
                      <select className="w-full border rounded-lg px-3 py-2">
                        <option>1 Hari</option>
                        <option>3 Hari</option>
                        <option>1 Minggu</option>
                      </select>
                    </div>
                    <div>
                      <label>Keperluan</label>
                      <textarea
                        className="w-full border rounded-lg px-3 py-2"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={closeModalForm}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batalkan
                  </button>
                  <button className="px-4 py-2 bg-sky-900 text-white rounded-lg">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
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
            onClick={() => setActiveTab("suratUkur").then}
            className={`px-4 py-2 rounded-xl shadow font-semibold ${
              activeTab === "suratUkur"
                ? "bg-[#022B3A] text-white"
                : "bg-white text-gray-800 hover:bg-[#022B3A] hover:text-white"
            }`}
          >
            Surat Ukur
          </button>
        </div>

        {/* Table Buku Tanah */}
        {activeTab === "bukuTanah" && <LoanTable data={dummyData} />}

        {/* Table Surat Ukur */}
        {activeTab === "suratUkur" && <LoanTable data={dummyData} />}

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3, "…"].map((page, index) => (
            <button
              key={index}
              className="w-8 h-8 rounded-full bg-white border"
            >
              {page}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DaftarPeminjaman;
