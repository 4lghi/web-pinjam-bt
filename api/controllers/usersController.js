const { admin, db } = require("../firebase");
// const { isAdmin, isUser } = require("../middlewares/auth");

const getUser = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = [];

    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal mengambil data user." });
  }
};

const createUser = async (req, res) => {
  const data = req.body;

  if (!data.username || !data.password) {
    return res.status(400).json({
      status: "error",
      message: "Nama dan email wajib diisi.",
    });
  }

  const userData = {
    username: data.username,
    password: data.password,
    role: data.role || "pengguna",
    createdAt: admin.firestore.Timestamp.now(),
  };

  try {
    const userRef = await db.collection("users").add(userData);
    res.status(201).json({ status: "sukses", id: userRef.id, data: userData });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal menambahkan user." });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const dataUpdate = req.body;

  try {
    await db.collection("users").doc(id).update(dataUpdate);
    res
      .status(200)
      .json({ status: "sukses", message: "User berhasil diupdate." });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Gagal update user." });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection("users").doc(id).delete();
    res
      .status(200)
      .json({ status: "sukses", message: "User berhasil dihapus." });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Gagal hapus user." });
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
