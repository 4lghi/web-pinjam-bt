import React, { useEffect, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import LoanTable from "../components/LoanTable";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import wilayah from "../../assets/wilayah-medan.json";

function DaftarPeminjaman() {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredBTData = filterData(btData);
  const filteredSUData = filterData(suData);

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
          {/* Search */}
          <div className="relative w-[550px]">
            <input
              type="search"
              placeholder="Cari peminjaman"
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
            <a href="/notifikasi-admin">
              <span className="cursor-pointer relative">
                <span className="absolute z-50 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
                <ion-icon
                  className="text-xl mt-2 ml-2"
                  name="notifications"
                ></ion-icon>
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
                    name="filter"
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-400 font-semibold cursor-pointer"
            >
              Export
            </button>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 font-semibold cursor-pointer"
            >
              + Tambah
            </button>

            {/* Admin Info */}
            <div className="flex items-center gap-2">
              <ion-icon
                className="text-2xl"
                name="person-circle-outline"
              ></ion-icon>
              <span className="font-semibold">Admin</span>
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
                      <label>Tanggal Peminjaman</label>
                      <input
                        type="date"
                        className="w-full border rounded-lg px-3 py-2"
                        name="dateBorrowed"
                        value={formData.dateBorrowed}
                        onChange={handleChange}
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
