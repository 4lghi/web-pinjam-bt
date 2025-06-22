import React from "react";
import { jwtDecode } from "jwt-decode";

export default function User() {
  const token = localStorage.getItem("token");
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username; 
    } catch (error) {
      console.error("Gagal decode token:", error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <ion-icon className="text-2xl" name="person-circle-outline"></ion-icon>
      <span className="font-semibold">{username || "Pengguna"}</span>
    </div>
  );
}
