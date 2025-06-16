import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import SidebarAdmin from "../components/SidebarAdmin";


function NotifikasiAdmin() {

  return (
    <div className="font-sans bg-gray-100 text-sm text-gray-800 min-h-screen flex">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 ml-60 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          {/* Search */}
          <div className="relative w-[550px]">
            <input
              type="search"
              placeholder="Cari notifikasi"
              className="w-full pl-10 pr-5 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <ion-icon className="absolute left-3 top-2 text-black text-xl" name="search-outline"></ion-icon>
          </div>

          {/* Notifikasi & Admin */}
          <div className="flex items-center gap-4">
            <a href="/src/notif_admin.html">
              <span className="cursor-pointer relative">
                <span className="absolute z-50 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
                <ion-icon class="text-xl mt-2" name="notifications"></ion-icon>
              </span>
            </a>
            <div className="flex items-center gap-2">
              <ion-icon className="text-2xl" name="person-circle-outline"></ion-icon>
              <span className="font-semibold">User</span>
            </div>
          </div>
        </div>

        {/* Notifikasi Title */}
        <h2 className="text-2xl font-bold mb-4">Notifikasi</h2>

        {/* Card Notifikasi */}
        <div className="bg-white rounded-lg p-4 shadow flex gap-4 items-start">
          <span className="text-2xl">📢</span>
          <div>
            <h3 className="font-bold">Telat pengembalian!!!</h3>
            <p className="text-sm">
                Buku tanah M.121 kelurahan Tanjung Selamat telat dikembalikan, segera minta konfirmasi pengguna.
            </p>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {[1, 2, 3, "…"].map((page, idx) => (
            <button
              key={idx}
              className="w-8 h-8 rounded-full bg-white border hover:bg-gray-100"
            >
              {page}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default NotifikasiAdmin;
