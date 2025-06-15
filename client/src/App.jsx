import { Routes, Route } from "react-router-dom";
import Login from "./ui/Login";
import DashboardAdmin from "./ui/admin/DashboardAdmin";
import DaftarPeminjaman from "./ui/admin/DaftarPeminjaman";
import DaftarPengajuan from "./ui/admin/DaftarPengajuan";
import DaftarPengguna from "./ui/admin/DaftarPengguna";
import DashboardUser from "./ui/user/DashboardUser";
import PeminjamanUser from "./ui/user/PeminjamanUser";
// import PeminjamanPribadi from "./ui/user/PeminjamanPribadi";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/dashboardAdmin"
        element={
          <ProtectedRoute element={DashboardAdmin} allowedRoles={["admin"]} />
        }
      />

      <Route
        path="/daftarPeminjaman"
        element={
          <ProtectedRoute element={DaftarPeminjaman} allowedRoles={["admin"]} />
        }
      />

      <Route
        path="/daftarPengajuan"
        element={
          <ProtectedRoute element={DaftarPengajuan} allowedRoles={["admin"]} />
        }
      />

      <Route
        path="/daftarPengguna"
        element={
          <ProtectedRoute element={DaftarPengguna} allowedRoles={["admin"]} />
        }
      />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute element={DashboardUser} allowedRoles={["user"]} />
        }
      />

      <Route
        path="/peminjaman"
        element={
          <ProtectedRoute element={PeminjamanUser} allowedRoles={["user"]} />
        }
      />

      {/* <Route
        path="/peminjaman-seksi"
        element={
          <ProtectedRoute element={PeminjamanPribadi} allowedRoles={["user"]} />
        }
      /> */}
    </Routes>
  );
}

export default App;
