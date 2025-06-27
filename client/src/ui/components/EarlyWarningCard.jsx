import { Clock, Eye, FileText, X } from "lucide-react";
import { useState } from "react";

const EarlyWarningCard = ({ warningList = [] }) => {
  const [showModal, setShowModal] = useState(false);

  const previewDocs = warningList
    .slice(0, 2)
    .map((doc) => `${doc.jenis} No. ${doc.nomor}`);
  const remaining = warningList.length - previewDocs.length;

  return (
    <>
      {/* Card */}
      <div className="flex items-center justify-between border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-400 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center">
            <Clock className="text-amber-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900">
              {warningList.length > 0
                ? `${warningList.length} Peminjaman Dokumen Akan Jatuh Tempo`
                : "Tidak ada dokumen yang akan jatuh tempo"}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <FileText className="w-4 h-4" />
              <p className="text-base font-medium">
                {warningList.length > 0
                  ? `${previewDocs.join(", ")}${
                      remaining > 0 ? ` dan ${remaining} lainnya` : ""
                    }`
                  : "Kamu tidak memiliki dokumen yang mendekati jatuh tempo saat ini."}
              </p>
            </div>
          </div>
        </div>

        {warningList.length > 0 && (
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="flex shadow-lg cursor-pointer items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-sm px-3 py-1.5 rounded-lg"
            >
              <Eye className="w-4 h-4" />
              Lihat Detail
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && warningList.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="overflow-y-auto bg-white rounded-lg w-full max-h-[33rem] max-w-md p-4 shadow-lg relative">
            <h3 className=" text-lg font-semibold text-gray-800 mb-5">
              Detail Dokumen Akan Jatuh Tempo
            </h3>
            {/* card detail */}
            <div className="w-full mb-5 h-fit bg-white p-2 rounded-md shadow-md border-l-2 border-t-2 border-l-amber-700 border-t-amber-700">
              <ul className="max-h-48 overflow-y-auto">
                {warningList
                  .sort(
                    (a, b) => new Date(a.jatuhTempo) - new Date(b.jatuhTempo)
                  )
                  .map((doc, idx) => (
                    <div
                      key={idx}
                      className="text-lg"
                    >
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <FileText className="w-4 h-4"/>
                        <h1>{doc.jenis} No. {doc.nomor}</h1>
                      </div>
                      {/* data sample (belum ambil dari database) */}
                      <div className="rounded-full font-semibold text-xs w-fit full bg-amber-100 px-2 py-1 text-amber-800 border border-amber-200">
                        <h1>Sidorejo</h1>
                      </div>
                      <div className="text-sm mt-3 text-gray-600">
                        <div className="flex justify-between mb-1">
                          <h2>Jenis Hak: </h2>
                          <h2 className="text-black font-medium">Hak Milik</h2>
                        </div>
                        <div className="flex justify-between mb-1 ">
                          <h2>Nama Peminjam: </h2>
                          <h2 className="text-black font-medium">Alex</h2>
                        </div>
                        <div className="flex justify-between mb-1">
                          <h2>Seksi: </h2>
                          <h2 className="text-black font-medium">Seksi1</h2>
                        </div>
                        <hr className="text-gray-300 my-3 "/>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 mt-0.5"/>
                            <h2>Jatuh Tempo</h2>
                          </div>
                          <h2 className="text-red-500 font-medium">{doc.jatuhTempo}</h2>
                        </div>
                      </div>
                    </div>
                  ))}
              </ul>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5 m-auto"/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EarlyWarningCard;
