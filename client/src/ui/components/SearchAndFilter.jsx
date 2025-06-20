import React from "react";

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  isDropdownOpen,
  setIsDropdownOpen,
}) {
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="flex justify-between w-[577px]">
      {/* Search */}
      <div className="relative w-[530px]">
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

      {/* Filter*/}
      <div className="flex items-center mr-3">
        {/* Notifikasi */}
        {/* <a href="/notifikasi-user">
          <span className="cursor-pointer relative">
            <span className="absolute z-50 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
            <ion-icon className="text-xl mt-2" name="notifications"></ion-icon>
          </span>
        </a> */}

        {/* Filter Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown}>
            <div className="cursor-pointer rounded-lg flex items-center gap-2 mt-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0l-2.01-2.01a.99.99 0 0 1-.29-.83V12h-.03L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L14.03 12z"
                />
              </svg>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 z-20 mt-2 w-46 bg-white shadow rounded">
              <ul className="text-sm text-gray-700">
                {[
                  "Semua",
                  "Mendekati Tenggat (❌)",
                  "Disetujui",
                  "Dipinjam",
                  "Dikembalikan",
                  "Ditolak",
                  "Telat",
                ].map((label) => (
                  <li key={label}>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedFilter === label
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter(label);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

