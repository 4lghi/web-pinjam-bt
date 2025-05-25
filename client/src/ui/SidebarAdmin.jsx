import { Link } from 'react-router-dom';

const SidebarAdmin = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-gray-100 shadow-lg p-4">
      <h2 className="text-xl font-bold mb-6">My Sidebar</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/peminjaman" className="hover:text-blue-600">Peminjaman</Link>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
