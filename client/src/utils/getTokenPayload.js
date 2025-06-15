// utils/checkToken.js
import jwt_decode from "jwt-decode"; // <== library (khusus frontend)

const getTokenPayload = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwt_decode(token); // decode tanpa verify
  } catch (err) {
    return null;
  }
};

export default getTokenPayload;
