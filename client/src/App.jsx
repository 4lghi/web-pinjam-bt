import { Routes, Route } from 'react-router-dom';
import Login from './ui/Login';
import DashboardAdmin from './ui/DashboardAdmin';
import SidebarAdmin from './ui/SidebarAdmin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
      <Route path="/sidebarAdmin" element={<SidebarAdmin />} />
    </Routes>
  );
}

export default App;
