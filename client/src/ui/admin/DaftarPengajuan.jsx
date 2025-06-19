import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import RequestTable from "../components/RequestTable";
import axiosInstance from "../../utils/axiosInstance";
import User from "../components/User";

function DaftarPengajuan() {
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [loading, setLoading] = useState(true);

  const [btData, setBtData] = useState([]);
  const [suData, setSuData] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [btResponse, suResponse] = await Promise.all([
          axiosInstance.get("http://localhost:3000/peminjaman/bukuTanah"),
          axiosInstance.get("http://localhost:3000/peminjaman/suratUkur"),
        ]);

        setBtData(btResponse.data);
        setSuData(suResponse.data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("BT Data:", btData);
    console.log("SU Data:", suData);

    fetchData();
  }, []);

  // search
  const filterData = (data) => {
    const keywords = searchQuery.toLowerCase().split(" ");

    return data.filter((item) => {
      const valuesToSearch = [
        item.namaPeminjam,
        item.jenisHak,
        item.nomorHak,
        item.kecamatan,
        item.kelurahan,
      ];

      const combinedString = valuesToSearch
        .map((val) => String(val).toLowerCase())
        .join(" ");

      return keywords.every((kw) => combinedString.includes(kw));
    });
  };

  const applyStatusFilter = (data) => {
    switch (selectedFilter) {
      case "Terbaru":
        return [...data].sort(
          (a, b) => new Date(b.dateRequested) - new Date(a.dateRequested)
        );
      case "Terlama":
        return [...data].sort(
          (a, b) => new Date(a.dateRequested) - new Date(b.dateRequested)
        );
      default:
        return data;
    }
  };

  const filteredBTData = applyStatusFilter(filterData(btData));
  const filteredSUData = applyStatusFilter(filterData(suData));

  const handleAccept = async (id, jenis) => {
    try {
      // Pilih endpoint berdasarkan jenis
      const endpoint =
        jenis === "bt"
          ? `http://localhost:3000/peminjaman/bukuTanah/${id}`
          : `http://localhost:3000/peminjaman/suratUkur/${id}`;

      const response = await axiosInstance.patch(endpoint, {
        status: "disetujui",
      });

      // Update state sesuai jenis
      if (jenis === "bt") {
        setBtData((prevData) =>
          prevData.map((loan) =>
            loan.id === id ? { ...loan, status: "disetujui" } : loan
          )
        );
      } else {
        setSuData((prevData) =>
          prevData.map((loan) =>
            loan.id === id ? { ...loan, status: "disetujui" } : loan
          )
        );
      }

      console.log("Status berhasil diubah:", response.data);
      console.log(btData);
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  const handleRejectModal = async (id, jenis) => {
    try {
      const endpoint =
        jenis === "bt"
          ? `http://localhost:3000/peminjaman/bukuTanah/${id}`
          : `http://localhost:3000/peminjaman/suratUkur/${id}`;

      const response = await axios.patch(endpoint, {
        status: "ditolak",
      });

      // Update state setelah sukses
      setLoanData((prevData) =>
        prevData.map((loan) =>
          loan.id === id ? { ...loan, status: "ditolak" } : loan
        )
      );

      console.log("Status berhasil diubah:", response.data);
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  const handleDelete = async (id, jenis) => {
    setShowDeleteModal(true);
    setIsSubmitting(true);
    try {
      // Pilih endpoint berdasarkan jenis
      const endpoint =
        jenis === "bt"
          ? `http://localhost:3000/peminjaman/bukuTanah/${id}`
          : `http://localhost:3000/peminjaman/suratUkur/${id}`;

      const response = await axiosInstance.delete(endpoint);

      // Update state sesuai jenis
      if (jenis === "bt") {
        setBtData((prevData) => prevData.filter((loan) => loan.id !== id));
      } else {
        setSuData((prevData) => prevData.filter((loan) => loan.id !== id));
      }

      console.log("Data berhasil dihapus:", response.data);
    } catch (error) {
      console.error("Gagal hapus data:", error);
    }
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
              type="search"
              placeholder="Cari pengajuan peminjaman"
              className="w-full pl-10 pr-5 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ion-icon
              className="absolute left-3 top-2 text-black text-xl"
              name="search-outline"
            ></ion-icon>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifikasi */}
            {/* <a href="/notifikasi-admin">
              <span className="cursor-pointer relative">
                <span className="absolute z-50 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
                <ion-icon class="text-xl mt-2" name="notifications"></ion-icon>
              </span>
            </a> */}

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
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20 mt-2 w-32 bg-white shadow rounded">
                  <ul className="text-sm text-gray-700">
                    {["Semua", "Terbaru", "Terlama"].map((label) => (
                      <li key={label}>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            selectedFilter === label
                              ? "font-semibold text-blue-600"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedFilter(label);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Admin Info */}
            <User />
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
          <RequestTable
            data={filteredBTData.filter(
              (row) => row.status === "menunggu persetujuan"
            )}
            handleAccept={handleAccept}
            handleRejectModal={handleRejectModal}
            handleDelete={handleDelete}
            jenis="bt"
          />
        )}
        {activeTab === "suratUkur" && (
          <RequestTable
            data={filteredSUData.filter(
              (row) => row.status === "menunggu persetujuan"
            )}
            handleAccept={handleAccept}
            handleRejectModal={handleRejectModal}
            handleDelete={handleDelete}
            jenis="su"
          />
        )}
      </main>

      {/* Modal Delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Apakah Anda yakin?</h2>
            <p className="text-gray-500 mb-6">
              Setelah dihapus, aksi Anda tidak bisa diulang. Data akan terhapus
              secara permanen.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Batalkan
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DaftarPengajuan;
