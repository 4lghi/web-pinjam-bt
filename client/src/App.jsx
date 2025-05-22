import { useState } from "react";

function App() {
  const [nama, setNama] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data dikirim:", { nama});

    // Contoh POST ke backend
    fetch("http://localhost:3000/pinjam-buku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        namaPeminjam: nama }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response dari server:", data);
        alert("Data berhasil dikirim!");
      })
      .catch((err) => {
        console.error("Gagal kirim:", err);
        alert("Terjadi kesalahan saat mengirim data.");
      });
    // Di sini nanti kamu bisa fetch POST ke backend
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          Form Sederhana
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nama" className="block text-gray-700 font-medium">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          {/* <div>
            <label htmlFor="nama" className="block text-gray-700 font-medium">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div> */}
          {/* <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
