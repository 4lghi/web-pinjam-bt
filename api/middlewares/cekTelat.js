const { db } = require("../firebase");

const hitungDeadline = (borrowedISO, durasi) => {
  const d = new Date(borrowedISO);
  d.setDate(d.getDate() + durasi);
  return d;
};

const cekTelat = async (req, res) => {
  try {
    const now = new Date();
    const koleksiList = ["bukuTanah", "suratUkur"];

    let totalDipinjam = 0;
    let totalTelat = 0;
    const batch = db.batch();

    for (const koleksi of koleksiList) {
      const snapshot = await db
        .collection(koleksi)
        .where("status", "==", "dipinjam")
        .get();

      totalDipinjam += snapshot.size;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const { dateBorrowed, fixDurasi } = data;

        if (!dateBorrowed || !fixDurasi) return;

        const deadline = hitungDeadline(dateBorrowed, fixDurasi);

        if (now > deadline) {
          const docRef = db.collection(koleksi).doc(doc.id);
          batch.update(docRef, {
            status: "telat",
          });
          totalTelat++;
        }
      });
    }

    await batch.commit();

    res.status(200).json({
      message: `Cek selesai. ${totalTelat} dokumen dari ${totalDipinjam} dipinjam telah diubah menjadi 'telat'.`,
    });
  } catch (error) {
    console.error("Gagal cek telat:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

module.exports = cekTelat;
