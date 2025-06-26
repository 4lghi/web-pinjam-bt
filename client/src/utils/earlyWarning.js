// utils/earlyWarning.js

export const isEarlyWarning = (borrowedDateISO, fixDurasi) => {
  const deadline = new Date(borrowedDateISO);
  deadline.setDate(deadline.getDate() + fixDurasi);

  const now = new Date();
  const diffInMs = deadline - now;
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (fixDurasi === 1 && diffInHours <= 6) return true;
  if ((fixDurasi === 3 || fixDurasi === 7) && diffInHours <= 24) return true;

  return false;
};

export const getEarlyWarningList = (data) => {
  return data
    .filter((item) => {
      const jatuhTempo = new Date(
        new Date(item.dateBorrowed).getTime() + item.fixDurasi * 86400000
      );
      const now = new Date();
      const diff = (jatuhTempo - now) / (1000 * 60 * 60 * 24);
      return item.status === "dipinjam" && diff <= 3 && diff >= 0;
    })
    .map((item) => {
      const jatuhTempoDate = new Date(
        new Date(item.dateBorrowed).getTime() + item.fixDurasi * 86400000
      );
      return {
        jenis: item.jenis,
        nomor: item.nomorHak,
        jatuhTempo: jatuhTempoDate.toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Jakarta",
        }),
      };
    });
};
