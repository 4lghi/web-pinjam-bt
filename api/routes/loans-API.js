// module.exports = function (app) {
//   const { admin, db } = require("../firebase");

//   // Endpoint POST /peminjaman
//   app.post("/peminjaman", async (req, res) => {
//     const data = req.body;
//     console.log("Data diterima:", data);

//     if (!data.namaPeminjam) {
//       return res.status(400).json({
//         status: "error",
//         message: "Data tidak lengkap!",
//       });
//     }

//     const docData = {
//       userId: data.userId || "",
//       namaPeminjam: data.namaPeminjam,
//       status: "menunggu persetujuan",
//       dateRequested: admin.firestore.Timestamp.now(),
//       dateApproved: null,
//       dateBorrowed: null,
//       dateReturned: null,
//       reasonIfRejected: null,
//       fixDurasi: data.fixDurasi || 1,
//       jenisHak: data.jenisHak || "",
//       kecamatan: data.kecamatan || "",
//       kelurahan: data.kelurahan || "",
//       keperluan: data.keperluan || "",
//       nomorHak: data.nomorHak || 0,
//       requestDurasi: data.requestDurasi || 1,
//     };

//     try {
//       const docRef = await db.collection("loans").add(docData);
//       res.status(200).json({
//         status: "sukses",
//         id: docRef.id,
//         data: docData,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         status: "error",
//         message: "Gagal menyimpan data ke Firestore.",
//       });
//     }
//   });

//   // Endpoint GET /peminjaman
//   app.get("/peminjaman", async (req, res) => {
//     try {
//       const snapshot = await db.collection("loans").get();
//       const hasil = [];

//       snapshot.forEach((doc) => {
//         hasil.push({
//           id: doc.id,
//           ...doc.data(),
//         });
//       });

//       res.status(200).json(hasil);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         status: "error",
//         message: "Gagal mengambil data peminjaman.",
//       });
//     }
//   });

//   // PUT untuk update status peminjaman
//   app.put("/peminjaman/:id", async (req, res) => {
//     const { id } = req.params;
//     const dataUpdate = req.body;

//     try {
//       await db.collection("loans").doc(id).update(dataUpdate);
//       res
//         .status(200)
//         .json({ status: "sukses", message: "Data berhasil diperbarui." });
//     } catch (err) {
//       res.status(500).json({ status: "error", message: "Gagal update data." });
//     }
//   });

//   // DELETE permintaan berdasarkan ID
//   app.delete("/peminjaman/:id", async (req, res) => {
//     const { id } = req.params;

//     try {
//       await db.collection("loans").doc(id).delete();
//       res
//         .status(200)
//         .json({ status: "sukses", message: "Data berhasil dihapus." });
//     } catch (err) {
//       res.status(500).json({ status: "error", message: "Gagal hapus data." });
//     }
//   });
// };
