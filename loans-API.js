module.exports = function(app) {
  const { admin, db } = require('./firebase');

  // Endpoint POST /pinjam-buku
  app.post('/pinjam-buku', async (req, res) => {
    const data = req.body;
    console.log('Data diterima:', data);

    if (!data.nomorHak || !data.namaPeminjam) {
      return res.status(400).json({
        status: 'error',
        message: 'Data tidak lengkap!'
      });
    }

    const docData = {
      userId: data.userId,
      namaPeminjam: data.namaPeminjam,
      status: 'menunggu persetujuan',
      dateRequested: admin.firestore.Timestamp.now(),
      dateApproved: null,
      dateBorrowed: null,
      dateReturned: null,
      reasonIfRejected: null,
      fixDurasi: data.fixDurasi || 1,
      jenisHak: data.jenisHak || "",
      kecamatan: data.kecamatan || "",
      kelurahan: data.kelurahan || "",
      keperluan: data.keperluan || "",
      nomorHak: data.nomorHak || 0,
      requestDurasi: data.requestDurasi || 1,
    };

    try {
      const docRef = await db.collection('loans').add(docData);
      res.status(200).json({
        status: 'sukses',
        id: docRef.id,
        data: docData
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Gagal menyimpan data ke Firestore.'
      });
    }
  });

  // Endpoint GET /peminjaman
  app.get('/peminjaman', async (req, res) => {
    try {
      const snapshot = await db.collection('loans').get();
      const hasil = [];

      snapshot.forEach(doc => {
        hasil.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json(hasil);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data peminjaman.'
      });
    }
  });
};
