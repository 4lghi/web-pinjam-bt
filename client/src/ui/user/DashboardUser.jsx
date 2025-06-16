import React, { useEffect, useState } from "react";
import SidebarUser from "../components/SidebarUser";
import LoanTable from "../components/LoanTable";
import axiosInstance from "../../utils/axiosInstance";
import getTokenPayload from "../../utils/checkToken";

const DashboardUser = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [btData, setBtData] = useState([]);
  const [suData, setSuData] = useState([]);
  const [loading, setLoading] = useState(true);

  const payload = getTokenPayload();
  const loggedInUserId = payload.username;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [btResponse, suResponse] = await Promise.all([
          axiosInstance.get("http://localhost:3000/peminjaman/bukuTanah"),
          axiosInstance.get("http://localhost:3000/peminjaman/suratUkur"),
        ]);

        const filteredBt = btResponse.data.filter(
          (item) => item.userId === loggedInUserId
        );

        const filteredSu = suResponse.data.filter(
          (item) => item.userId === loggedInUserId
        );

        setBtData(filteredBt);
        setSuData(filteredSu);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

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

  const filteredBTData = filterData(btData);
  const filteredSUData = filterData(suData);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarUser />
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
              <ion-icon
                className="text-2xl"
                name="person-circle-outline"
              ></ion-icon>{" "}
              <span className="font-semibold">User</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            {/* Search */}
            <div className="relative">
              <input
                type="search"
                placeholder="Cari nama peminjam atau nomor dokumen..."
                className="w-full pl-10 px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ion-icon
                className="absolute left-3 top-2 text-black text-xl"
                name="search-outline"
              ></ion-icon>
            </div>

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

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {activeTab === "bukuTanah" && (
                  <LoanTable
                    data={filteredBTData.filter(
                      (row) =>
                        row.status === "diterima" || row.status === "telat"
                    )}
                  />
                )}
                {activeTab === "suratUkur" && (
                  <LoanTable
                    data={filteredSUData.filter(
                      (row) =>
                        row.status == "diterima" || row.status === "telat"
                    )}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardUser;
