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

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachmentFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setAttachmentPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("status", selectedStatus);
      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      // Determine the endpoint based on active tab
      const endpoint =
        activeTab === "bukuTanah"
          ? `http://localhost:3000/peminjaman/bukuTanah/${selectedItem.id}/status`
          : `http://localhost:3000/peminjaman/suratUkur/${selectedItem.id}/status`;

      await axiosInstance.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local data
      if (activeTab === "bukuTanah") {
        setBtData((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, status: selectedStatus }
              : item
          )
        );
      } else {
        setSuData((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, status: selectedStatus }
              : item
          )
        );
      }

      // Show success message (you can implement toast notification here)
      console.log("Status berhasil diupdate!");
      alert("Status berhasil diupdate!");

      closeAllModals();
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
      alert("Gagal mengupdate status!");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {selectedItem && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-sm text-gray-600">Data yang akan dihapus:</p>
                <p className="font-medium">
                  {selectedItem.namaPeminjam || selectedItem.nama_peminjam}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedItem.nomorHak || selectedItem.nomor_hak}
                </p>
              </div>
            )}
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
      {showEditStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Status Peminjaman
              </h2>
              <button
                onClick={closeAllModals}
                className="text-gray-500 hover:text-red-500 text-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selected Item Info */}
            {selectedItem && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-2">
                  Data Peminjaman:
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Peminjam:</span>
                    <p className="font-medium">
                      {selectedItem.namaPeminjam ||
                        selectedItem.nama_peminjam ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nomor Hak:</span>
                    <p className="font-medium">
                      {selectedItem.nomorHak || selectedItem.nomor_hak || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status Saat Ini:</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                        statusColorMap[selectedItem.status] ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {selectedItem.status || "Unknown"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Jenis:</span>
                    <p className="font-medium">
                      {activeTab === "bukuTanah" ? "Buku Tanah" : "Surat Ukur"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="space-y-6">
              {/* Status Dropdown */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ubah Status
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    disabled={isSubmitting}
                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        selectedStatus === "dikembalikan"
                          ? "bg-green-100 text-green-700"
                          : selectedStatus === "diterima"
                          ? "bg-blue-100 text-blue-700"
                          : selectedStatus === "telat"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedStatus}
                    </span>
                    <ChevronLeft
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        statusDropdownOpen ? "rotate-90" : "-rotate-90"
                      }`}
                    />
                  </button>

                  {/* Dropdown Options */}
                  {statusDropdownOpen && (
                    <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-50">
                      {["dikembalikan", "diterima", "telat"].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleSelectStatus(status)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              status === "dikembalikan"
                                ? "bg-green-100 text-green-700"
                                : status === "diterima"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Lampiran Bukti (Opsional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="attachment"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="attachment"
                    className={`cursor-pointer ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Klik untuk upload atau drag & drop file
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF, DOC hingga 10MB
                    </p>
                  </label>
                </div>

                {/* File Preview */}
                {attachmentFile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Upload className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {attachmentFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(attachmentFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAttachmentFile(null);
                          setAttachmentPreview(null);
                        }}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    {attachmentPreview && (
                      <div className="mt-3">
                        <img
                          src={attachmentPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 gap-3">
              <button
                onClick={closeAllModals}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batalkan
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-[#022B3A] text-white hover:bg-[#033649] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
