const getTokenPayload = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const exp = payload.exp * 1000; // convert to ms
    const now = Date.now();

    const timeLeftMs = exp - now;

    if (timeLeftMs <= 0) {
      console.log("Token sudah expired.");
      return {
        ...payload,
        remaining: "Expired",
      };
    }

    const seconds = Math.floor((timeLeftMs / 1000) % 60);
    const minutes = Math.floor((timeLeftMs / 1000 / 60) % 60);
    const hours = Math.floor(timeLeftMs / 1000 / 60 / 60);

    const remaining = `${hours} jam ${minutes} menit ${seconds} detik`;

    console.log("Token masih aktif:", token);
    console.log("Role:", payload.role);
    console.log("Waktu tersisa:", remaining);
    console.log("Tanggal Exp:", new Date(exp).toLocaleString());

    return {
      ...payload,
      remaining,
    };

  } catch (err) {
    console.error("Gagal menguraikan token:", err);
    return null;
  }
};

export default getTokenPayload;