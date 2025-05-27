import { Routes, Route } from 'react-router-dom';
import Login from './ui/Login';
import DashboardAdmin from './ui/DashboardAdmin';
import SidebarAdmin from './ui/SidebarAdmin';
import DaftarPeminjaman from './ui/DaftarPeminjaman';
import DaftarPengajuan from './ui/DaftarPengajuan';
import DaftarPengguna from './ui/DaftarPengguna';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
      <Route path="/sidebarAdmin" element={<SidebarAdmin />} />
      <Route path="/daftarPeminjaman" element={<DaftarPeminjaman />} />
      <Route path="/daftarPengajuan" element={<DaftarPengajuan />} />
      <Route path="/daftarPengguna" element={<DaftarPengguna />} />
    </Routes>
  );
}

export default App;
