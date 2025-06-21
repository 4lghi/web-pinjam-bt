const cron = require("node-cron");
const { db } = require("./firebase"); // pastikan ini arah ke file firebase.js kamu

// Copas ulang fungsi `hitungDeadline` dan `cekTelat`
const hitungDeadline = (borrowedISO, durasi) => {
  const d = new Date(borrowedISO);
  d.setDate(d.getDate() + durasi);
  return d;
};

const cekTelat = async () => {
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

        console.log("fixDurasi:", fixDurasi);
        console.log("dateBorrowed:", dateBorrowed);

        if (new Date() >= deadline) {
          const docRef = db.collection(koleksi).doc(doc.id);
          batch.update(docRef, {
            status: "telat",
          });
          totalTelat++;
        }
      });
    }

    await batch.commit();
    console.log(`[${new Date().toISOString()}] Telat updated: ${totalTelat} dari ${totalDipinjam}`);
  } catch (error) {
    console.error("Gagal cek telat (CRON):", error);
  }
};

// ⏰ Jadwalkan setiap jam
cron.schedule("* * * * *", () => {
  console.log("⏰ Menjalankan cekTelat (setiap jam)");
  cekTelat();
});

// Tes langsung saat startup, komentar ini jika tidak ingin
console.log(`[${new Date().toISOString()}] Menjalankan cekTelat() langsung saat startup`);
cekTelat();