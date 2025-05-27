import React, { useEffect, useState } from "react";
import SidebarAdmin from "./SidebarAdmin";

const statusClassMap = {
  Ditolak: "bg-red-100 text-red-700",
  Diterima: "bg-green-100 text-green-700",
  Menunggu: "bg-yellow-100 text-yellow-700",
};

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
        {activeTab === "bukuTanah" && (
          <div className="overflow-x-auto">
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
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Info</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* {dataBukuTanah.map((data, index) => (
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
                      <span className={`px-2 py-1 rounded-full text-sm ${statusClassMap[data[8]]}`}>
                        {data[8]}
                      </span>
                    </td>
                    <td className="px-4 py-2 relative">
                      <button onClick={() => alert(data[9])} className="text-lg font-bold mr-2">!</button>
                      <button onClick={toggleMenu} className="text-black text-lg dropdown-toggle">⋮</button>
                      <div className="dropdown-menu hidden absolute bg-white border rounded shadow-md right-0 mt-2 z-10">
                        <ul>
                          <li>
                            <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">✏️ Edit</button>
                          </li>
                          <li>
                            <button onClick={showAlert} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">🗑️ Hapus</button>
                          </li>
                          <li>
                            <button onClick={showStatusModal} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">🔄 Edit Status</button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))} */}
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

export default DaftarPeminjaman;
