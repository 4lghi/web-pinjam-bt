// utils/checkToken.js
import { jwtDecode } from "jwt-decode";// <== library (khusus backend)

const getTokenPayload = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token); // decode tanpa verify
  } catch (err) {
    return null;
  }
};

export default getTokenPayload;
