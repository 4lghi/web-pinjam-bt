import React, { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";

const dataBukuTanah = [
  ["TU", "User", "TU123", ""],
  [1, "User", "1123", ""],
  [2, "User", "2123", ""],
  [3, "User", "3123", ""],
  [4, "User", "4123", ""],
  [5, "User", "5123", ""],
  ["", "Admin", "admin123", ""],
];

export default function DaftarPengguna() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDeleteConfirm = () => {
    alert("Data berhasil dihapus.");
    setShowDeleteModal(false);
  };

  return (
    <div className="font-sans bg-gray-100 text-sm text-gray-800">
      <div className="flex min-h-screen">
        <SidebarAdmin />
        <main className="flex-1 ml-60 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="relative w-[550px]">
              <input
                type="text"
                placeholder="Cari nama pengguna"
                className="w-full pl-10 pr-20 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <i className="bi bi-search absolute left-3 top-2.5 text-gray-400"></i>
              <button className="h-full absolute right-[0.5px] top-[0.5px] bottom-1 px-4 bg-transparent text-black rounded-full hover:bg-slate-200 transition">
                Search
              </button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 font-semibold cursor-pointer">
                + Tambah
              </button>
              <div className="flex items-center gap-2">
                <ion-icon className="text-2xl" name="person-circle-outline"></ion-icon>{" "}
                <span className="font-semibold">Admin</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden">
              <thead className="bg-white text-gray-800">
                <tr className="border border-gray-300">
                  <th className="px-4 py-2 text-left">No</th>
                  <th className="px-4 py-2 text-left">Nama Seksi</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Password</th>
                  <th className="px-4 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {dataBukuTanah.map((data, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{data[0]}</td>
                    <td className="px-4 py-2">{data[1]}</td>
                    <td className="px-4 py-2">{data[2]}</td>
                    <td className="flex px-4 gap-2 py-2">
                      <button onClick={() => setShowDeleteModal(true)}>
                        <span className="hover:bg-teal-950 hover:text-white p-0.5 rounded-md cursor-pointer text-xl mx-2">
                          <ion-icon name="trash"></ion-icon>
                        </span>
                      </button>
                      <button onClick={() => setShowEditModal(true)}>
                        <span className="hover:bg-teal-950 hover:text-white p-0.5 rounded-md cursor-pointer text-xl mx-2">
                          <ion-icon name="pencil"></ion-icon>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-2">
                  Apakah Anda yakin?
                </h2>
                <p className="text-gray-500 mb-6">
                  Setelah dihapus, aksi Anda tidak bisa diulang. Data akan
                  terhapus secara permanen.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Logout Modal */}
          {showLogoutModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-2">
                  Apakah Anda yakin ingin logout?
                </h2>
                <p className="text-gray-500 mb-6">
                  Setelah logout, Anda perlu login kembali untuk mengakses akun
                  Anda.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutModal(false);
                      window.location.href = "/login";
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Ya, Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Pengguna</h2>
                <div className="space-y-3">
                  <div>
                    <label>Nama Seksi</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>TU</option>
                    </select>
                  </div>
                  <div>
                    <label>Role</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>User</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label>Password</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batalkan
                  </button>
                  <button className="px-4 py-2 bg-sky-900 text-white rounded-lg">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
