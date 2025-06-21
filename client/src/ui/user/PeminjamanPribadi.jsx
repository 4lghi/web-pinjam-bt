import React, { useEffect, useState } from "react";
import SidebarUser from "../components/SidebarUser";
import LoanTable from "../components/LoanTable2";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import getTokenPayload from "../../utils/checkToken";
import wilayah from "../../assets/wilayah-medan.json";
import SearchAndFilter from "../components/SearchAndFilter";
import User from "../components/User";

function PeminjamanPribadi() {

  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState("bukuTanah");

  const [selectedFilter, setSelectedFilter] = useState("Semua"); 

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
    dateBorrowed: "",
    durasi: "",
    keperluan: "",
  });

  const [btData, setBtData] = useState([]);
  const [suData, setSuData] = useState([]);
  const [loading, setLoading] = useState(true);

  const payload = getTokenPayload();
  const loggedInUserId = payload.username;
 
  useEffect(() => {
    const payload = getTokenPayload();
    if (payload) {
      setFormData((prev) => ({ ...prev, userId: payload.username }));
    }
  }, []);


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
      case "Menunggu":
        return data.filter((item) => item.status?.toLowerCase() === selectedFilter.toLowerCase());
      default:
        return data;
    }
  };


  const filteredBTData = applyStatusFilter(filterData(btData));
  const filteredSUData = applyStatusFilter(filterData(suData));

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
      <SidebarUser />

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
            {/* Tambah */}
            <button
              onClick={openModal}
              className="w-24 px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 font-semibold cursor-pointer"
            >
              + Tambah
            </button>

            {/* User Info */}
            <User />
          </div>

          {/* Modal Tambah Peminjaman */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[700px] relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">Tambah Peminjaman</h2>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Kolom kiri */}
                  <div className="space-y-3">
                    <div>
                      <label>Jenis Peminjaman</label>
                      <select
                        name="jenisPeminjaman"
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.jenisPeminjaman}
                        onChange={handleChange}
                      >
                        <option value="">-- Pilih --</option>
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
                        name="jenisHak"
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.jenisHak}
                        onChange={handleChange}
                      >
                        <option value="">-- Pilih --</option>
                        <option value="Hak Milik">Hak Milik</option>
                        <option value="Hak Guna Bangunan">
                          Hak Guna Bangunan
                        </option>
                        <option value="Hak Pakai">Hak Pakai</option>
                        <option value="Hak Wakaf">Hak Wakaf</option>
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
                      <label>Keperluan</label>
                      <textarea
                        name="keperluan"
                        className="w-full border rounded-lg px-3 py-2"
                        rows="2"
                        value={formData.keperluan}
                        onChange={handleChange}
                      />
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
                        name="durasi"
                        className="w-full border rounded-lg px-3 py-2"
                        value={formData.durasi}
                        onChange={handleChange}
                      >
                        <option value="">-- Pilih Durasi --</option>
                        <option value="1 Hari">1 Hari</option>
                        <option value="3 Hari">3 Hari</option>
                        <option value="1 Minggu">1 Minggu</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={closeModalForm}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-sky-900 text-white rounded-lg"
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
      </main>
    </div>
  );
}

export default PeminjamanPribadi;
