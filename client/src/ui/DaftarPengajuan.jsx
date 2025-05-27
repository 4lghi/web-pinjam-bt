import React, { useEffect, useState } from "react";
import SidebarAdmin from "./SidebarAdmin";

function DaftarPengajuan() {
  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleInfoClick = (info) => {
    alert(info);
  };

  const handleDelete = () => {
    alert("Data dihapus!");
  };

  const handleRejectModal = () => {
    // kamu bisa ganti ini dengan membuka modal di React state
    alert("Tolak modal dibuka");
  };

  const dataBukuTanah = [
    [
      "Ucok",
      1,
      "HGB",
      121,
      "Medan Sunggal",
      "Binjai",
      "12/03/2025",
      "3 Hari",
      "Data tidak lengkap",
      "",
      "",
    ],
    [
      "Ani",
      2,
      "HM",
      212,
      "Medan Baru",
      "Suka Maju",
      "10/03/2025",
      "2 Hari",
      "Siap diambil",
      "",
      "",
    ],
    [
      "Budi",
      3,
      "HW",
      111,
      "Medan Tembung",
      "Sari Rejo",
      "08/03/2025",
      "4 Hari",
      "Sedang diproses",
      "",
      "",
    ],
    [
      "Citra",
      4,
      "HGB",
      433,
      "Medan Denai",
      "Teladan",
      "07/03/2025",
      "1 Hari",
      "Akan dikonfirmasi",
      "",
      "",
    ],
    [
      "Doni",
      5,
      "HM",
      500,
      "Medan Timur",
      "Pahlawan",
      "05/03/2025",
      "3 Hari",
      "Berkas tidak sah",
      "",
      "",
    ],
    [
      "Eka",
      "Tu",
      "HW",
      777,
      "Medan Helvetia",
      "Padang Bulan",
      "04/03/2025",
      "2 Hari",
      "Masih diverifikasi",
      "",
      "",
    ],
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

            {/* Admin Info */}
            <div className="flex items-center gap-2">
              <i className="bi bi-person-circle text-xl"></i> <span>Admin</span>
            </div>
          </div>
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

        {/* Table */}
        {activeTab === "bukuTanah" && (
          <div id="bukuTanahTable" className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden">
              <thead className="bg-white text-gray-800">
                <tr className="border">
                  <th className="px-4 py-2 text-left">No</th>
                  <th className="px-4 py-2 text-left">Nama Peminjam</th>
                  <th className="px-4 py-2 text-left">Seksi</th>
                  <th className="px-4 py-2 text-left">Jenis Hak</th>
                  <th className="px-4 py-2 text-left">Nomor Hak</th>
                  <th className="px-4 py-2 text-left">Kecamatan</th>
                  <th className="px-4 py-2 text-left">Kelurahan</th>
                  <th className="px-4 py-2 text-left">Tgl Pinjam</th>
                  <th className="px-4 py-2 text-left">Durasi</th>
                  <th className="px-4 py-2 text-left">Info</th>
                  <th className="px-4 py-2 text-left">Proses</th>
                  <th className="px-4 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataBukuTanah.map((data, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{data[0]}</td>
                    <td className="px-4 py-2">{data[1]}</td>
                    <td className="px-4 py-2">{data[2]}</td>
                    <td className="px-4 py-2">{data[3]}</td>
                    <td className="px-4 py-2">{data[4]}</td>
                    <td className="px-4 py-2">{data[5]}</td>
                    <td className="px-4 py-2">{data[6]}</td>
                    <td className="px-4 py-2">{data[7]}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleInfoClick(data[8])}
                        className="text-lg font-bold"
                      >
                        !
                      </button>
                    </td>
                    <td className="px-4 py-4 flex gap-2 items-center">
                      {data[9]}
                      <span className="cursor-pointer bg-green-200 text-green-600 rounded-full w-7 h-7 hover:bg-green-100 flex items-center justify-center">
                        <ion-icon
                          class="text-xl mt-1"
                          name="checkmark"
                        ></ion-icon>
                      </span>
                      <span className="bg-red-200 text-red-600 rounded-full w-7 h-7 hover:bg-red-100 flex items-center justify-center">
                        <button
                          onClick={handleRejectModal}
                          className="rounded-full w-7 h-7"
                        >
                          <ion-icon
                            class="text-xl mt-1"
                            name="close"
                          ></ion-icon>
                        </button>
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {data[10]}
                      <button onClick={handleDelete}>
                        <span className="hover:bg-teal-950 hover:text-white pt-1 px-0.5 rounded-md cursor-pointer text-xl mx-2">
                          <ion-icon
                            class="text-xl mt-1"
                            name="trash"
                          ></ion-icon>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

export default DaftarPengajuan;
