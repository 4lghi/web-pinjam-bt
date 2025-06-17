import React, { useEffect, useState } from "react";
import SidebarUser from "../components/SidebarUser";
import LoanTable from "../components/LoanTable2";
import axiosInstance from "../../utils/axiosInstance";
import SearchAndFilter from "../components/SearchAndFilter";
import User from "../components/User";

function PeminjamanUser() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("Semua"); 

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [btData, setBtData] = useState([]);
  const [suData, setSuData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      case "Mendekati Tenggat":
        return data.filter((item) => {
          const today = new Date();
          const dateBorrowed = new Date(item.dateBorrowed);
          const tenggat = new Date(dateBorrowed);
          tenggat.setDate(tenggat.getDate() + parseInt(item.fixDurasi));

          const diffTime = tenggat - today;
          const diffDays = Math.ceil(diffTime / (1000 *60 * 60 * 24));

          return diffDays >= 0 && diffDays <= 1; //h-1 tenggat
        });
      case "Disetujui":
      case "Dipinjam":
      case "Dikembalikan":
      case "Ditolak":
      case "Telat":
        return data.filter((item) => item.status?.toLowerCase() === selectedFilter.toLowerCase());
      default:
        return data;
    }
  };


  const filteredBTData = applyStatusFilter(filterData(btData));
  const filteredSUData = applyStatusFilter(filterData(suData));


  return (
    <div className="flex min-h-screen font-sans bg-gray-100 text-sm text-gray-800">
      {/* Sidebar */}
      <SidebarUser />

      {/* Main Content */}
      <main className="flex-1 ml-60 p-6">
        <div className="flex justify-between items-center mb-6"> 
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />

          <User />
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

        {/* Conditional Table Rendering */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === "bukuTanah" && <LoanTable data={filteredBTData} />}
            {activeTab === "suratUkur" && <LoanTable data={filteredSUData} />}
          </>
        )}
      </main>
    </div>
  );
}

export default PeminjamanUser;
