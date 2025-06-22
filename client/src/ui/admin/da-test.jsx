import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { UserIcon } from "lucide-react";
import SidebarAdmin from "../components/SidebarAdmin";
import UserTable from "../components/UserTable";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

const initialUsers = [
  { id: 1, username: "TU", role: "user", password: "TU123" },
  { id: 2, username: "1", role: "user", password: "1123" },
  { id: 3, username: "2", role: "User", password: "2123" },
  { id: 4, username: "3", role: "User", password: "3123" },
  { id: 5, username: "4", role: "User", password: "4123" },
  { id: 6, username: "5", role: "User", password: "5123" },
  { id: 7, username: "Admin", role: "Admin", password: "admin123" },
];

export default function DaftarPengguna() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    role: "user",
    password: "",
  });

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      role: user.role,
      password: user.password,
    });
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteUserId) {
      setUsers(users.filter((user) => user.id !== deleteUserId));
      setShowDeleteModal(false);
      setDeleteUserId(null);
    }
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        )
      );
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
    }
  };

  const handleAddUser = () => {
    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      ...formData,
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      username: "",
      role: "User",
      password: "",
    });
  };

  return (
    <div className="font-sans bg-gray-100 text-sm text-gray-800 min-h-screen">
      <div className="flex">
        <SidebarAdmin />

        <main className="flex-1 lg:ml-60 p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Cari nama pengguna atau role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              />
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 font-semibold transition-colors"
              >
                <Plus className="h-4 w-4" />
                Tambah
              </button>
              <div className="flex items-center gap-2">
                <ion-icon
                  className="text-2xl"
                  name="person-circle-outline"
                ></ion-icon>{" "}
                <span className="font-semibold">Admin</span>
              </div>
            </div>
          </div>

          <UserTable
            data={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
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
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Pengguna</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Seksi
                    </label>
                    <select
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="">Pilih Seksi</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="TU">TU</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Tambah Pengguna</h2>
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="Masukkan username"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="Masukkan password"
                    />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={handleAddUser}
                    disabled={!formData.username || !formData.password}
                    className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah
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
