import React, { useEffect, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import LoanTable from "../components/LoanTable2";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import wilayah from "../../assets/wilayah-medan.json";
import SearchAndFilter from "../components/SearchAndFilter";
import User from "../components/User";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function DaftarPeminjaman() {
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  // export to excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    // Styling function
    const styleWorksheet = (worksheet) => {
      // Bold + background header
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FF000000" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D3D3D3" },
        };
      });

      // All borders
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
    };

    //styling status
    const styleStatusCells = (worksheet) => {
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header

        const statusCell = row.getCell("status");

        const status = statusCell.value?.toLowerCase();

        let fillColor = null;
        switch (status) {
          case "menunggu":
            fillColor = "FFFFF9C4";
            break;
          case "disetujui":
            fillColor = "FFBBDEFB";
            break;
          case "dipinjam":
            fillColor = "FFE1BEE7";
            break;
          case "telat":
            fillColor = "FFFFE0B2";
            break;
          case "dikembalikan":
            fillColor = "FFC8E6C9";
            break;
          case "ditolak":
            fillColor = "FFFFCDD2";
            break;
          default:
            fillColor = null;
        }

        if (fillColor) {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fillColor },
          };
        }
      });
    };

    // --- Sheet Buku Tanah ---
    const sheetBT = workbook.addWorksheet("Buku Tanah");
    sheetBT.columns = [
      { header: "No.", key: "no", width: 5 },
      { header: "Nama Peminjam", key: "namaPeminjam", width: 25 },
      { header: "Seksi", key: "userId", width: 15 },
      { header: "Jenis Hak", key: "jenisHak", width: 20 },
      { header: "Nomor Hak", key: "nomorHak", width: 15 },
      { header: "Kecamatan", key: "kecamatan", width: 25 },
      { header: "Kelurahan", key: "kelurahan", width: 25 },
      { header: "Tanggal Pinjam", key: "dateBorrowed", width: 20 },
      { header: "Durasi", key: "fixDurasi", width: 10 },
      { header: "Status", key: "status", width: 15 },
    ];
    filteredBTData.forEach((item, index) => {
      sheetBT.addRow({
        no: index + 1,
        namaPeminjam: item.namaPeminjam,
        userId: item.userId,
        jenisHak: item.jenisHak,
        nomorHak: item.nomorHak,
        kecamatan: item.kecamatan,
        kelurahan: item.kelurahan,
        dateBorrowed: item.dateBorrowed?.split("T")[0] || "",
        fixDurasi: item.fixDurasi + " hari" || "",
        status: item.status || "",
      });
    });
    styleWorksheet(sheetBT);
    styleStatusCells(sheetBT);

    // --- Sheet Surat Ukur ---
    const sheetSU = workbook.addWorksheet("Surat Ukur");
    sheetSU.columns = [
      { header: "No.", key: "no", width: 5 },
      { header: "Nama Peminjam", key: "namaPeminjam", width: 25 },
      { header: "Seksi", key: "userId", width: 15 },
      { header: "Jenis Hak", key: "jenisHak", width: 20 },
      { header: "Nomor Hak", key: "nomorHak", width: 15 },
      { header: "Kecamatan", key: "kecamatan", width: 25 },
      { header: "Kelurahan", key: "kelurahan", width: 25 },
      { header: "Tanggal Pinjam", key: "dateBorrowed", width: 20 },
      { header: "Durasi", key: "fixDurasi", width: 10 },
      { header: "Status", key: "status", width: 15 },
    ];
    filteredSUData.forEach((item, index) => {
      sheetSU.addRow({
        no: index + 1,
        namaPeminjam: item.namaPeminjam,
        userId: item.userId,
        jenisHak: item.jenisHak,
        nomorHak: item.nomorHak,
        kecamatan: item.kecamatan,
        kelurahan: item.kelurahan,
        dateBorrowed: item.dateBorrowed?.split("T")[0] || "",
        fixDurasi: item.fixDurasi + " hari" || "",
        status: item.status || "",
      });
    });
    styleWorksheet(sheetSU);
    styleStatusCells(sheetSU);

    // --- Save File ---
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "data_peminjaman.xlsx"
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const endpoint =
      formData.jenisPeminjaman === "Buku Tanah"
        ? "http://localhost:3000/peminjaman/bukuTanah"
        : "http://localhost:3000/peminjaman/suratUkur";

    try {
      await axiosInstance.post(endpoint, formData);
      alert("Data berhasil disimpan!");
      closeModalForm();
      // Reload data jika perlu
    } catch (error) {
      console.error("Gagal simpan data:", error);
      alert("Gagal menyimpan data.");
    }
  };

  // Modal handlers
  const handleAction = (action, item) => {
    setSelectedItem(item);
    console.log("Selected Item:", item);

    switch (action) {
      case "edit":
        setShowEditModal(true);
        break;
      case "status":
        // setSelectedStatus(item?.status || "Dikembalikan")
        setShowEditStatusModal(true);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      default:
        console.warn(`Aksi "${action}" tidak dikenali.`);
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
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [formData, setFormData] = useState({
    jenisPeminjaman: "Buku Tanah",
    namaPeminjam: "",
    jenisHak: "",
    nomorHak: "",
    seksi: "",
    kecamatan: "",
    kelurahan: "",
    tanggalPeminjaman: "",
    durasi: "",
    keperluan: "",
    userId: "",
  });

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
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return diffDays >= 0 && diffDays <= 1; //h-1 tenggat
        });
      case "Disetujui":
      case "Dipinjam":
      case "Dikembalikan":
      case "Ditolak":
      case "Telat":
        return data.filter(
          (item) => item.status?.toLowerCase() === selectedFilter.toLowerCase()
        );
      default:
        return data;
    }
  };

  const filteredBTData = applyStatusFilter(filterData(btData));
  const filteredSUData = applyStatusFilter(filterData(suData));

  const [seksiOptions, setSeksiOptions] = useState([]);
  console.log("Seksi Options:", seksiOptions);
  useEffect(() => {
    const fetchSeksiOptions = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/users");

        // Ambil seksi unik dari users dengan role "user"
        const seksiUnik = [
          ...new Set(
            response.data
              .filter((user) => user.role === "user")
              .map((user) => user.username)
          ),
        ];

        setSeksiOptions(seksiUnik);
      } catch (error) {
        console.error("Gagal ambil user:", error);
      }
    };

    fetchSeksiOptions();
  }, []);

  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [kelurahanOptions, setKelurahanOptions] = useState([]);

  const handleKecamatanChange = (e) => {
    const selected = e.target.value;
    setSelectedKecamatan(selected);
    setKelurahanOptions(wilayah[selected] || []);
    setFormData((prev) => ({ ...prev, kecamatan: selected, kelurahan: "" }));
  };

  const handleKelurahanChange = (e) => {
    setFormData((prev) => ({ ...prev, kelurahan: e.target.value }));
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-100 text-sm text-gray-800">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 ml-60 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
          <div className="flex items-center gap-4">
            {/* Export & Tambah */}
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-400 font-semibold cursor-pointer"
            >
              Export
            </button>
            <button
              onClick={openModal}
              className="w-24 px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 font-semibold cursor-pointer"
            >
              + Tambah
            </button>

            {/* Admin Info */}
            <User />
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
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        name="jenisPeminjaman"
                        value={formData.jenisPeminjaman}
                        onChange={handleChange}
                      >
                        <option value="Buku Tanah">Buku Tanah</option>
                        <option value="Surat Ukur">Surat Ukur</option>
                      </select>
                    </div>
                    <div>
                      <label>Nama Peminjam</label>
                      <input
                        type="text"
                        name="namaPeminjam"
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.namaPeminjam}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label>Jenis Hak</label>
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        name="jenisHak"
                        value={formData.jenisHak}
                        onChange={handleChange}
                      >
                        <option value="Hak Milik">Hak Milik</option>
                        <option value="Hak Guna Bangunan">
                          Hak Guna Bangunan
                        </option>
                        <option value="Hak Pakai">Hak Pakai</option>
                        <option value="Hak Pakai">Hak Wakaf</option>
                        <option value="Hak Tanggungan">Hak Tanggungan</option>
                        <option value="Hak Pengelolaan">Hak Pengelolaan</option>
                      </select>
                    </div>
                    <div>
                      <label>Nomor Hak</label>
                      <input
                        type="text"
                        name="nomorHak"
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.nomorHak}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label>Pilih Seksi</label>
                      <select
                        name="userId"
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.userId}
                        onChange={handleChange}
                      >
                        <option value="">-- Pilih Seksi --</option>
                        {seksiOptions.map((seksi, idx) => (
                          <option key={idx} value={seksi}>
                            {seksi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Kolom kanan */}
                  <div className="space-y-3">
                    <div>
                      <label>Kecamatan</label>
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.kecamatan || ""}
                        onChange={handleKecamatanChange}
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        {Object.keys(wilayah).map((kec) => (
                          <option key={kec} value={kec}>
                            {kec}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Kelurahan</label>
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.kelurahan || ""}
                        onChange={handleKelurahanChange}
                        disabled={!selectedKecamatan}
                      >
                        <option value="">-- Pilih Kelurahan --</option>
                        {kelurahanOptions.map((kel) => (
                          <option key={kel} value={kel}>
                            {kel}
                          </option>
                        ))}
                      </select>
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
                        name="keperluan"
                        value={formData.keperluan}
                        onChange={handleChange}
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
                  <button
                    className="px-4 py-2 bg-sky-900 text-white rounded-lg"
                    onClick={handleSubmit}
                  >
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

        {/* Conditional Table Rendering */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === "bukuTanah" && <LoanTable data={filteredBTData} onAction={handleAction} />}
            {activeTab === "suratUkur" && <LoanTable data={filteredSUData} onAction={handleAction} />}
          </>
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

export default DaftarPeminjaman;
