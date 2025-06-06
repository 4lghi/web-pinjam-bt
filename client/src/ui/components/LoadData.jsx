import React, { useEffect, useState } from "react";
import LoanTable from "./LoanTable"; // pastikan path-nya sesuai

function LoanPage() {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const response = await fetch("http://localhost:3000/peminjaman"); // ganti URL kalau beda
      const data = await response.json();
      setLoanData(data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Peminjaman</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LoanTable data={loanData} />
      )}
    </div>
  );
}

export default LoanPage;
