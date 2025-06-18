const { admin, db } = require("../firebase"); // pastikan inisialisasi Firebase sudah benar

const updateStatus = async (req, res) => {
  try {
    const { id, collection } = req.params; // <-- ambil nama koleksi dari URL
    const { newStatus } = req.body;

    const docRef = db.collection(collection).doc(id); // <-- gunakan koleksi dinamis
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    const data = docSnap.data();
    const prevStatus = data.status;
    const now = new Date().toISOString();

    const updatePayload = {
      status: newStatus,
    };

    console.log("data:", data);

    // === LOGIKA STATUS ===

    if (
      ["menunggu", "disetujui", "ditolak"].includes(prevStatus) &&
      newStatus === "dipinjam"
    ) {
      updatePayload.dateBorrowed = data.prevDateBorrowed
        ? data.prevDateBorrowed
        : now;
    } else if (
      prevStatus === "dipinjam" &&
      ["menunggu", "disetujui", "ditolak"].includes(newStatus)
    ) {
      updatePayload.prevDateBorrowed = data.dateBorrowed;
      updatePayload.dateBorrowed = null;
      updatePayload.dateReturned = null;
    } else if (prevStatus === "dipinjam" && newStatus === "dikembalikan") {
      updatePayload.dateReturned = now;
    } else if (prevStatus === "dikembalikan" && newStatus === "dipinjam") {
      updatePayload.dateBorrowed =
        data.dateBorrowed || data.prevDateBorrowed || now;
      updatePayload.dateReturned = null;
    } else if (prevStatus === "telat" && newStatus === "dikembalikan") {
      updatePayload.dateReturned = now;
    } else if (
      (prevStatus === "dikembalikan" && newStatus !== "dipinjam") ||
      (prevStatus === "telat" && newStatus !== "dikembalikan")
    ) {
      return res.status(400).json({
        message: `Status tidak valid: ${prevStatus} → ${newStatus}`,
      });
    }

    await docRef.update(updatePayload);
    return res.json({
      message: "Status berhasil diubah",
      updated: updatePayload,
    });
  } catch (error) {
    console.error("Gagal update status:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

module.exports = updateStatus;
