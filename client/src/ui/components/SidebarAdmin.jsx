import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SidebarAdmin = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogout(false);
    navigate('/'); // redirect ke halaman login
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sidebar fixed top-0 bottom-0 left-0 w-60 bg-[#bfdbf7] text-black h-screen rounded-tr-3xl rounded-br-3xl flex flex-col">
        <Link to="/dashboardAdmin" className="text-center mt-4">
          <img src="/logo.png" alt="Logo Pinjam BT/SU" className="mx-auto h-32 w-auto mb-2" />
        </Link>

        <nav className="flex flex-col text-sm font-medium mt-10 px-4">
          <Link to="/dashboardAdmin" className="flex items-center p-2 rounded-md hover:bg-[#022B3A] hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z" />
            </svg>
            <span className="ml-4">Beranda</span>
          </Link>

          <Link to="/daftarPeminjaman" className="flex items-center p-2 rounded-md hover:bg-[#022B3A] hover:text-white mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 9V7h14v2zm0 4v-2h14v2zm0 4v-2h14v2zM4 9q-.425 0-.712-.288T3 8t.288-.712T4 7t.713.288T5 8t-.288.713T4 9m0 4q-.425 0-.712-.288T3 12t.288-.712T4 11t.713.288T5 12t-.288.713T4 13m0 4q-.425 0-.712-.288T3 16t.288-.712T4 15t.713.288T5 16t-.288.713T4 17" />
            </svg>
            <span className="ml-4">Daftar Peminjaman</span>
          </Link>

          <Link to="/daftarPengajuan" className="flex items-center p-2 rounded-md hover:bg-[#022B3A] hover:text-white mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="M704 192h160v736H160V192h160v64h384zM288 512h448v-64H288zm0 256h448v-64H288zm96-576V96h256v96z" />
            </svg>
            <span className="ml-4">Daftar Pengajuan</span>
          </Link>

          <Link to="/daftarPengguna" className="flex items-center p-2 rounded-md hover:bg-[#022B3A] hover:text-white mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6 7.5a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M11.75 22H2v-2a6 6 0 0 1 6-6h3.75zm2-8h8.5v2h-8.5zm0 3h8.5v2h-8.5zm0 3h8.5v2h-8.5z" />
            </svg>
            <span className="ml-4">Daftar Pengguna</span>
          </Link>

          {/* Logout Button */}
          <button onClick={() => setShowLogout(true)} className="mt-36 flex items-center p-2 rounded-md hover:bg-[#022B3A] hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30">
              <path fill="currentColor" d="M24.7917 11.6667L22.7354 13.7229L25.0396 16.0417H13.125V18.9583H25.0396L22.7354 21.2625L24.7917 23.3333L30.625 17.5L24.7917 11.6667ZM7.29167 7.29167H17.5V4.375H7.29167C5.6875 4.375 4.375 5.6875 4.375 7.29167V27.7083C4.375 29.3125 5.6875 30.625 7.29167 30.625H17.5V27.7083H7.29167V7.29167Z" />
            </svg>
            <span className="ml-4 font-semibold">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Apakah Anda yakin ingin logout?</h2>
            <p className="text-gray-500 mb-6">
              Setelah logout, Anda perlu login kembali untuk mengakses akun Anda.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogout(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                Batalkan
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarAdmin;
