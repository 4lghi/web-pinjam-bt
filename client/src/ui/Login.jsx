import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import getTokenPayload from "../utils/checkToken";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      const { token, role } = response.data;

      // Simpan token ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // opsional, kalau mau pakai di UI

      alert("Login berhasil");

      // Arahkan ke dashboard sesuai role
      if (role === "admin") {
        getTokenPayload();
        navigate("/dashboardAdmin");
      } else if (role === "user") {
        navigate("/dashboard");
      } else {
        alert("Role tidak dikenali");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Username atau password salah");
      } else if (error.response && error.response.status === 403) {
        alert("Akses ditolak");
      } else {
        alert("Terjadi kesalahan server");
        console.error(error);
      }
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-r bg-no-repeat from-green-200/70 via-amber-200/70 to-blue-200 flex items-center justify-center">
      <div className="h-[430px] w-72 md:w-96 md:h-[500px] backdrop-blur-sm bg-gradient-to-b from-white/10 to-gray-300/30 overflow-hidden text-center rounded-[50px] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <h1 className="text-3xl opacity-100 text-teal-950 font-bold p-10">
          Login
        </h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-wrap px-5 opacity-100"
        >
          <div className="w-full">
            <label className="relative block">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input shadow-lg transition duration-200 ease-in-out focus:shadow-indigo-200 mt-1 py-2 px-3 rounded-xl w-full block text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-300"
              />
              <ion-icon
                class="absolute top-1/2 right-3 -translate-y-1/2 text-2xl text-black"
                name="person-circle-outline"
              ></ion-icon>
            </label>
          </div>

          <div className="w-full mt-7">
            <label className="relative block">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input shadow-lg transition duration-200 ease-in-out focus:shadow-indigo-200 mt-1 py-2 px-3 rounded-xl w-full block text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-300"
              />
              <ion-icon
                class="absolute top-1/2 right-3 -translate-y-1/2 text-2xl text-black"
                name="lock-closed"
              ></ion-icon>
            </label>
          </div>

          <button
            type="submit"
            className="mx-auto mt-10 bg-teal-950 rounded-full w-full h-10 md:h-12 text-white text-lg font-bold hover:bg-teal-900 active:bg-teal-900"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
