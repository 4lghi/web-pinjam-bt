import { Clock, Eye } from "lucide-react";
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
      <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-start gap-3">
          <Clock className="text-amber-600 mt-1 w-5 h-5" />
          <div>
            <h2 className="font-semibold text-amber-800">
              {warningList.length > 0
                ? `${warningList.length} Peminjaman Dokumen Akan Jatuh Tempo`
                : "Tidak ada dokumen yang akan jatuh tempo"}
            </h2>
            <p className="text-sm text-amber-700">
              {warningList.length > 0
                ? `${previewDocs.join(", ")}${
                    remaining > 0 ? ` dan ${remaining} lainnya` : ""
                  }`
                : "Kamu tidak memiliki dokumen yang mendekati jatuh tempo saat ini."}
            </p>
          </div>
        </div>

        {warningList.length > 0 && (
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-sm px-3 py-1.5 rounded-lg"
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
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Detail Dokumen Akan Jatuh Tempo
            </h3>
            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {warningList
                .sort(
                  (a, b) => new Date(a.jatuhTempo) - new Date(b.jatuhTempo)
                )
                .map((doc, idx) => (
                  <li
                    key={idx}
                    className="border-b border-gray-200 pb-2 text-sm text-gray-700"
                  >
                    <span className="font-semibold">
                      {doc.jenis} No. {doc.nomor}
                    </span>{" "}
                    – Jatuh tempo:{" "}
                    <span className="text-red-600 font-medium">
                      {doc.jatuhTempo}
                    </span>
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EarlyWarningCard;
