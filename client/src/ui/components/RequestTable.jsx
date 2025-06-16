import React, {useState} from "react";

const RequestTable = ({
  data,
  handleRejectModal = (id) => console.log("Default reject", id),
  handleInfoClick = (loan) => console.log("Default info", loan),
  handleDelete = (id) => console.log("Default delete", id),
  handleAccept = (id) => {console.log("Default accept", id);},
  jenis
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
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
          {currentData.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{startIndex + index + 1}</td>
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
                  <button onClick={() => handleAccept(item.id,jenis)}>
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

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-2 py-1 rounded border bg-white hover:bg-[#022B3A] hover:text-white cursor-pointer"
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {(() => {
          const pages = [];
          const maxVisible = 10;
          const currentGroup = Math.floor((currentPage - 1) / maxVisible);
          const start = currentGroup * maxVisible + 1;
          const end = Math.min(start + maxVisible - 1, totalPages);

          if (start > 1) {
            pages.push(
              <button
                key="prevGroup"
                onClick={() => handlePageChange(start - 1)}
                className="px-3 py-1 rounded-full border bg-white hover:bg-gray-100 cursor-pointer"
              >
                ...
              </button>
            );
          }

          for (let i = start; i <= end; i++) {
            pages.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1 rounded-full border ${
                  i === currentPage ? "bg-[#022B3A] text-white" : "bg-white hover:bg-[#022B3A] hover:text-white cursor-pointer"
                }`}
              >
                {i}
              </button>
            );
          }

          if (end < totalPages) {
            pages.push(
              <button
                key="nextGroup"
                onClick={() => handlePageChange(end + 1)}
                className="px-3 py-1 rounded-full border bg-white hover:bg-gray-100 cursor-pointer"
              >
                ...
              </button>
            );
          }

          return pages;
        })()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-2 py-1 rounded border bg-white hover:bg-[#022B3A] hover:text-white cursor-pointer"
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

    </div>
  );
};

export default RequestTable;
