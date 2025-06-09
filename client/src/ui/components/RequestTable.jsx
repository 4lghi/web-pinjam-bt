import React from "react";

const RequestTable = ({
  data,
  handleRejectModal = (id) => console.log("Default reject", id),
  handleInfoClick = (loan) => console.log("Default info", loan),
  handleDelete = (id) => console.log("Default delete", id),
  handleAccept = (id) => {console.log("Default accept", id)}
}) => {
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-xl overflow-hidden">
        <thead className="bg-white text-gray-800">
          <tr className="border">
            <th className="px-4 py-2 text-left">No</th>
            <th className="px-4 py-2 text-left">Nama Peminjam</th>
            <th className="px-4 py-2 text-left">Seksi</th>
            <th className="px-4 py-2 text-left">Jenis Hak</th>
            <th className="px-4 py-2 text-left">Nomor Hak</th>
            <th className="px-4 py-2 text-left">Kecamatan</th>
            <th className="px-4 py-2 text-left">Kelurahan</th>
            <th className="px-4 py-2 text-left">Tgl Pinjam</th>
            <th className="px-4 py-2 text-left">Durasi</th>
            <th className="px-4 py-2 text-left">Info</th>
            <th className="px-4 py-2 text-left">Proses</th>
            <th className="px-4 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.namaPeminjam}</td>
              <td className="px-4 py-2">{item.seksi}</td>
              <td className="px-4 py-2">{item.jenisHak}</td>
              <td className="px-4 py-2">{item.nomorHak}</td>
              <td className="px-4 py-2">{item.kecamatan}</td>
              <td className="px-4 py-2">{item.kelurahan}</td>
              <td className="px-4 py-2">{item.tglPinjam}</td>
              <td className="px-4 py-2">{item.durasi}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleInfoClick(item.keperluan)}
                  className="text-lg font-bold"
                >
                  !
                </button>
              </td>
              <td className="px-4 py-4 flex gap-2 items-center">
                <span className="cursor-pointer bg-green-200 text-green-600 rounded-full w-7 h-7 hover:bg-green-100 flex items-center justify-center">
                  <button onClick={() => handleAccept(item.id)}>
                    <ion-icon class="text-xl mt-1" name="checkmark"></ion-icon>
                  </button>
                </span>
                <span className="bg-red-200 text-red-600 rounded-full w-7 h-7 hover:bg-red-100 flex items-center justify-center">
                  <button
                    onClick={() => handleRejectModal(item.id)}
                    className="rounded-full w-7 h-7"
                  >
                    <ion-icon class="text-xl mt-1" name="close"></ion-icon>
                  </button>
                </span>
              </td>
              <td className="px-4 py-2">
                <button onClick={() => handleDelete(item.id)}>
                  <span className="hover:bg-teal-950 hover:text-white pt-1 px-0.5 rounded-md cursor-pointer text-xl mx-2">
                    <ion-icon class="text-xl mt-1" name="trash"></ion-icon>
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
