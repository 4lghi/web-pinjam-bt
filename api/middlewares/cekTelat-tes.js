const { db, admin } = require("../firebase");

const cekTelat = async (req, res) => {
  try {
    const snapshot = await db
      .collection("bukuTanah")
      .where("status", "==", "dipinjam")
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "Tidak ada data yang sedang dipinjam." });
    }

    const now = new Date();
    const batch = db.batch();
    let count = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const { dateBorrowed, fixDurasi } = data;

      if (!dateBorrowed || !fixDurasi) return;

      const borrowedDate = new Date(dateBorrowed); // dateBorrowed harus ISO string
      const deadline = new Date(borrowedDate);
      deadline.setDate(deadline.getDate() + fixDurasi);

      if (now > deadline) {
        const docRef = db.collection("bukuTanah").doc(doc.id);
        batch.update(docRef, {
          status: "telat",
        });
        count++;
      }
    });

    await batch.commit();

    return res.status(200).json({
      message: `Status diperbarui: ${count} dokumen menjadi 'telat'`,
    });
  } catch (error) {
    console.error("Gagal mengecek status telat:", error);
    return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

module.exports = cekTelat;
