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
import { X, ChevronLeft, Printer, CircleAlert } from "lucide-react";
import { Download } from "lucide-react";
import getTokenPayload from "../../utils/getTokenPayload";

function DaftarPeminjaman() {
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [selectedFilter, setSelectedFilter] = useState("Semua");

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintOption, setshowPrintOption] = useState(false);

  // Status modal states
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const payload = getTokenPayload();
  const loggedInUserId = payload.username;
  useEffect(() => {
    if (selectedItem?.status) {
      setSelectedStatus(selectedItem.status);
    }
  }, [selectedItem]);

  const statusColorMap = {
    "menunggu persetujuan": "bg-yellow-100 text-yellow-700",
    dipinjam: "bg-purple-100 text-purple-700",
    dikembalikan: "bg-green-100 text-green-700",
    telat: "bg-orange-100 text-orange-700",
    disetujui: "bg-blue-100 text-blue-700",
    ditolak: "bg-red-100 text-red-700", // untuk data sample
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

  const openModal = () => {
    setFormData(initialFormData);
    setIsModalOpen(true);
    setSubmitFailed("");
  };

  const closeModalForm = () => {
    setFormData(initialFormData);
    setIsModalOpen(false);
    setSubmitFailed("");
  };

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
          case "menunggu persetujuan":
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

  const initialFormData = {
    jenisPeminjaman: activeTab === "bukuTanah" ? "Buku Tanah" : "Surat Ukur",
    namaPeminjam: "",
    jenisHak: "Hak Milik",
    nomorHak: "",
    userId: "",
    kecamatan: "",
    kelurahan: "",
    fixDurasi: "",
    keperluan: "",
  };

  const [submitFailed, setSubmitFailed] = useState("");

  const handleSubmit = async () => {
    setSubmitFailed("");

    const endpoint =
      formData.jenisPeminjaman === "Buku Tanah"
        ? "/peminjaman/bukuTanah"
        : "/peminjaman/suratUkur";

    try {
      const res = await axiosInstance.post(endpoint, formData);
      const newItem = { id: res.data.id, ...res.data.data }; // ← Format respons kamu sebelumnya

      // ✅ Update data lokal
      if (formData.jenisPeminjaman === "Buku Tanah") {
        setBtData((prev) => [...prev, newItem]);
      } else {
        setSuData((prev) => [...prev, newItem]);
      }

      // alert("Data berhasil disimpan!");
      closeModalForm();
    } catch (error) {
      console.error(
        "Gagal simpan data:",
        error.response?.data || error.message
      );
      setSubmitFailed(
        "Gagal menyimpan data. Harap lengkapi semua kolom yang wajib diisi sebelum menyimpan."
      );
    }
  };

  const closeSubmitFailed = () => {
    setSubmitFailed("");
  };

  // Modal handlers
  const handleAction = (action, item) => {
    setSelectedItem(item);
    console.log("Selected Item:", item);

    switch (action) {
      case "edit":
        setFormData({
          jenisPeminjaman: item.jenisPeminjaman || "Buku Tanah",
          namaPeminjam: item.namaPeminjam || "",
          jenisHak: item.jenisHak || "Hak Milik",
          nomorHak: item.nomorHak || "",
          userId: item.userId || "",
          kecamatan: item.kecamatan || "",
          kelurahan: item.kelurahan || "",
          keperluan: item.keperluan || "",
          fixDurasi: item.fixDurasi || 1,
        });
        setSelectedKecamatan(item.kecamatan || "");
        setShowEditModal(true); // modal edit
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
      // alert("Data berhasil dihapus!");

      closeAllModals();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);
  };

  const handleSaveStatus = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      // Determine the endpoint based on active tab
      const endpoint =
        activeTab === "bukuTanah"
          ? `http://localhost:3000/peminjaman/bukuTanah/${selectedItem.id}/status`
          : `http://localhost:3000/peminjaman/suratUkur/${selectedItem.id}/status`;

      await axiosInstance.patch(endpoint, {
        newStatus: selectedStatus,
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
      // alert("Status berhasil diupdate!");

      closeAllModals();
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
      alert("Gagal mengupdate status!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const endpoint =
        activeTab === "bukuTanah"
          ? `/peminjaman/bukuTanah/${selectedItem.id}`
          : `/peminjaman/suratUkur/${selectedItem.id}`;

      await axiosInstance.patch(endpoint, formData); // Kirim update

      setShowEditModal(false);

      // ✅ Update data lokal
      if (activeTab === "bukuTanah") {
        setBtData((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id ? { ...item, ...formData } : item
          )
        );
      } else {
        setSuData((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id ? { ...item, ...formData } : item
          )
        );
      }
    } catch (err) {
      console.error("Gagal edit:", err.response?.data || err.message);
    }
  };

  const closeAllModals = () => {
    setShowEditModal(false);
    setShowEditStatusModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setStatusDropdownOpen(false);
  };

  const [formData, setFormData] = useState({
    jenisPeminjaman: "Buku Tanah",
    namaPeminjam: "",
    jenisHak: "",
    nomorHak: "",
    seksi: "",
    kecamatan: "",
    kelurahan: "",
    dateBorrowed: "",
    keperluan: "",
    fixDurasi: "",
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
      case "Menunggu Persetujuan":
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

  const handleDurasiChange = (e) => {
    const durasi = Number(e.target.value); // konversi ke number
    setFormData((prev) => ({
      ...prev,
      fixDurasi: durasi,
    }));
  };

  // print (cetak bon)
  const [selectedRows, setSelectedRows] = useState([]);
  const [dataUntukCetak, setDataUntukCetak] = useState([]);
  const allSelectedData =
    activeTab === "bukuTanah"
      ? filteredBTData.filter((item) => selectedRows.includes(item.id))
      : filteredSUData.filter((item) => selectedRows.includes(item.id));

  // Hanya ambil yang statusnya "dipinjam"
  const selectedRowsValid = allSelectedData.filter(
    (item) => item.status === "dipinjam"
  );

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
          <div className="flex items-center gap-2">
            {/* Export, Tambah & print */}
            <button
              onClick={() => {
                setDataUntukCetak(selectedRowsValid);
                setTimeout(() => {
                  window.print();
                }, 500);
              }}
              disabled={selectedRowsValid.length === 0}
              className="flex items-center px-2 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-400 font-semibold cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Printer className="mr-2 h-4 w-4" />
              Cetak Bon ({selectedRowsValid.length})
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-400 font-semibold cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
            <button
              onClick={openModal}
              className="flex items-center w-24 px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 font-semibold cursor-pointer"
            >
              + Tambah
            </button>

            {/* Admin Info */}
            <div className="flex items-center gap-2">
              <ion-icon
                className="text-2xl"
                name="person-circle-outline"
              ></ion-icon>
              <span className="font-semibold">{loggedInUserId}</span>
            </div>
          </div>

          {/* Modal Tambah dan edit Peminjaman */}
          {(isModalOpen || showEditModal) && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[700px] relative">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">
                    {showEditModal ? "Edit Peminjaman" : "Tambah Peminjaman"}
                  </h2>
                </div>

                {/* submit failed alert */}
                <div className="flex space-y-4 ">
                  {submitFailed && (
                    <div
                      variant="destructive"
                      className="flex relative border-2 border-red-300 text-red-400 rounded-lg mb-4 px-3 py-2"
                    >
                      <CircleAlert className="mr-2 items-center h-5 w-5" />
                      <div className="pr-8">{submitFailed}</div>
                      <button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-5 w-5 rounded-xl hover:bg-red-100"
                        onClick={closeSubmitFailed}
                      >
                        <X className="h-3 w-3 m-auto" />
                      </button>
                    </div>
                  )}
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
                        type="number"
                        name="nomorHak"
                        className="w-full border rounded-lg px-3 py-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&-moz-appearance]:textfield"
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
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.fixDurasi || ""}
                        onChange={handleDurasiChange}
                      >
                        <option value={1}>1 Hari</option>
                        <option value={3}>3 Hari</option>
                        <option value={7}>1 Minggu</option>
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
                    onClick={
                      showEditModal
                        ? () => {
                            setShowEditModal(false);
                            setFormData(initialFormData);
                            setSubmitFailed("");
                          }
                        : closeModalForm
                    }
                    className="px-4 py-2 border rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 cursor-pointer"
                    onClick={showEditModal ? handleEditSubmit : handleSubmit}
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
            {activeTab === "bukuTanah" && (
              <LoanTable
                data={filteredBTData}
                onAction={handleAction}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                showCheckbox={true}
              />
            )}
            {activeTab === "suratUkur" && (
              <LoanTable
                data={filteredSUData}
                onAction={handleAction}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                showCheckbox={true}
              />
            )}
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

      {/* Modal Edit Status */}
      {showEditStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-visible">
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
            <div className="space-y-6 relative z-10">
              {/* Status Dropdown */}
              <div>
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
                          : selectedStatus === "dipinjam"
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
                    <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-50 overflow-visible">
                      {[
                        "menunggu persetujuan",
                        "disetujui",
                        "ditolak",
                        "dipinjam",
                        "dikembalikan",
                        "telat",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleSelectStatus(status)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColorMap[status]}`}
                          >
                            {status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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

      {/* print */}
      <div className="hidden print:block print-area">
        {dataUntukCetak.map((item) => (
          <div
            key={item.id}
            className="w-[48%] print:w-[48%] p-4 mb-4 text-sm border-2 rounded-xl break-inside-avoid"
          >
            <h2 className="text-lg font-bold mb-2">Bon Peminjaman</h2>
            <p>
              <strong>Tanggal Peminjaman:</strong> {""}
              {new Date(item.dateBorrowed).toLocaleDateString("id-ID")}
            </p>
            <p>
              <strong>Nama Peminjam:</strong> {item.namaPeminjam}
            </p>
            <p>
              <strong>Seksi:</strong> {item.userId}
            </p>
            <p>
              <strong>Nomor Hak:</strong> {item.nomorHak}
            </p>
            <p>
              <strong>Kelurahan:</strong> {item.kelurahan}
            </p>
            <p>
              <strong>Kecamatan:</strong> {item.kecamatan}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaftarPeminjaman;
