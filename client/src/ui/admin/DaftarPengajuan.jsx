import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import RequestTable from "../components/RequestTable";
import axiosInstance from "../../utils/axiosInstance";

function DaftarPengajuan() {
  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [loading, setLoading] = useState(true);

  const [btData, setBtData] = useState([]);
  const [suData, setSuData] = useState([]);

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

  const handleRejectModal = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/peminjaman/${id}`,
        {
          status: "ditolak",
        }
      );

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
          <RequestTable
            data={btData.filter((row) => row.status === "menunggu")}
            handleAccept={handleAccept}
            handleRejectModal={handleRejectModal}
            jenis="bt"
          />
        )}
        {activeTab === "suratUkur" && (
          <RequestTable
            data={suData.filter((row) => row.status === "menunggu")}
            handleAccept={handleAccept}
            handleRejectModal={handleRejectModal}
            jenis="su"
          />
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
