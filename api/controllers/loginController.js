// controllers/authController.js
require('dotenv').config();
const jwt = require("jsonwebtoken");
const { db } = require("../firebase"); // gunakan firebase-admin

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("username", "==", username)
      .where("password", "==", password)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const userData = snapshot.docs[0].data();

    // Buat token untuk user yang berhasil login
    const token = jwt.sign(
      {
        username: userData.username,
        role: userData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Kirim response dengan token dan role
    return res.status(200).json({
      message: "Login berhasil",
      role: userData.role,
      token: token,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  login,
};
