import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Cek apakah role diizinkan
    if (!allowedRoles.includes(payload.role)) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  } catch (err) {
    console.error("Token tidak valid:", err);
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
