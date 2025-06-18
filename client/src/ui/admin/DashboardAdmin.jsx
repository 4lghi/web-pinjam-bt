import { useEffect, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import LoanTable from "../components/LoanTable2";
import axiosInstance from "../../utils/axiosInstance";
import User from "../components/User";
import { Upload, X, ChevronLeft } from "lucide-react";

const DashboardAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("bukuTanah");
  const [btData, setBtData] = useState([]);
  const [suData, setSuData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Status modal states
  const [selectedStatus, setSelectedStatus] = useState("Dikembalikan");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusColorMap = {
    Dipinjam: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Dikembalikan: "bg-green-100 text-green-800 border-green-200",
    Terlambat: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-blue-100 text-blue-800 border-blue-200",
    telat: "bg-red-100 text-red-800 border-red-200",
    diterima: "bg-green-100 text-green-800 border-green-200",
    ditolak: "bg-red-100 text-red-800 border-red-200",
  };

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

  // Modal handlers
  const handleAction = (action, item) => {
    setSelectedItem(item)
    console.log("Selected Item:", item);

    switch (action) {
      case "edit":
        setShowEditModal(true)
        break
      case "status":
        // setSelectedStatus(item?.status || "Dikembalikan")
        setShowEditStatusModal(true)
        break
      case "delete":
        setShowDeleteModal(true)
        break
      default:
        console.warn(`Aksi "${action}" tidak dikenali.`)
    }
  }


  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      // Determine the endpoint based on active tab
      const endpoint =
        activeTab === "bukuTanah"
          ? `http://localhost:3000/peminjaman/bukuTanah/${selectedItem.id}`
          : `http://localhost:3000/peminjaman/suratUkur/${selectedItem.id}`;

      await axiosInstance.delete(endpoint);

      // Update local data
      if (activeTab === "bukuTanah") {
        setBtData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      } else {
        setSuData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      }

      // Show success message
      console.log("Data berhasil dihapus!");
      alert("Data berhasil dihapus!");

      closeAllModals();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAllModals = () => {
    setShowEditModal(false);
    setShowEditStatusModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setAttachmentFile(null);
    setAttachmentPreview(null);
    setSelectedStatus("Dikembalikan");
    setStatusDropdownOpen(false);
  };

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
            <a href="/notifikasi-admin" className="relative cursor-pointer">
              <span className="absolute z-50 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
              <ion-icon class="text-xl mt-2" name="notifications"></ion-icon>
            </a>
            <User />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-4 bg-yellow-100 p-6 rounded-lg shadow">
            <div className="text-yellow-800 text-3xl">⚠️</div>
            <div>
              <div className="text-gray-700">Terlambat</div>
              <div className="text-2xl font-bold">
                {
                  [...filteredBTData, ...filteredSUData].filter(
                    (item) => item.status === "telat"
                  ).length
                }
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-red-100 p-6 rounded-lg shadow">
            <div className="text-red-800 text-3xl">❌</div>
            <div>
              <div className="text-gray-700">Belum Dikembalikan</div>
              <div className="text-2xl font-bold">
                {
                  [...filteredBTData, ...filteredSUData].filter(
                    (item) =>
                      item.status === "diterima" || item.status === "telat"
                  ).length
                }
              </div>
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
                placeholder="Cari peminjam yang belum dikembalikan"
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
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Memuat data...</span>
              </div>
            ) : (
              <>
                {activeTab === "bukuTanah" && (
                  <LoanTable
                    data={filteredBTData.filter(
                      (row) =>
                        row.status === "diterima" || row.status === "telat"
                    )}
                    onAction={handleAction}
                  />
                )}
                {activeTab === "suratUkur" && (
                  <LoanTable
                    data={filteredSUData.filter(
                      (row) =>
                        row.status === "diterima" || row.status === "telat"
                    )}
                    onAction={handleAction}
                  />
                )}
              </>
            )}
          </div>
        </div>
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
                onClick={closeAllModals}
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

      {/* Modal Edit Status */}

    </div>
  );
};

export default DashboardAdmin;
