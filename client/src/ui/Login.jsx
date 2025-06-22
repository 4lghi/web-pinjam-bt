import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react";
import { User, Lock, Eye, EyeOff, X, CircleAlert, CircleCheck } from "lucide-react"
import axios from "axios"
import getTokenPayload from "../utils/checkToken"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      })

      const { token, role } = response.data

      // Simpan token ke localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("role", role) // opsional, kalau mau pakai di UI

      setLoginSuccess(true);

      setTimeout(() => {
        setLoginSuccess(false)
    
        if (role === "admin") {
          getTokenPayload()
          navigate("/dashboardAdmin")
        } else if (role === "user") {
          navigate("/dashboard")
        } else {
          alert("Role tidak dikenali")
        }
      }, 1000); 

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Username atau password salah. Silahkan coba lagi.")
      } else if (error.response && error.response.status === 403) {
        alert("Akses ditolak")
      } else {
        alert("Terjadi kesalahan server")
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const closeError = () => {
    setError ("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-r bg-no-repeat from-green-200/70 via-amber-200/70 to-blue-200 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
            <p className="text-gray-600">Silakan masuk ke akun Anda</p>
          </div>

          {/* error alert */}
          <div className="flex space-y-4 ">
            {error && (
              <div variant="destructive" className="flex relative border-2 border-red-300 text-red-400 rounded-lg mb-4 px-3 py-2">
                <CircleAlert className="mr-2 items-center h-5 w-5"/>
                <div className="pr-8">{error}</div>
                <button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-5 w-5 rounded-xl hover:bg-red-100"
                  onClick={closeError}
                >
                  <X className="h-3 w-3 m-auto" />
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-900" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-900" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-sky-900 hover:bg-sky-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Memproses...
                </div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Sistem Manajemen Pengguna</p>
          </div>
        </div>

        {/* Decorative Elements */}
        {/* <div className="absolute -top-4 -left-4 w-24 h-24 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div> */}
      </div>

      {/* Modal login success */}
      {loginSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center transition-all duration-300 ease-in-out">
            <CircleCheck className="w-15 h-15 mx-auto mb-3 text-green-700"/>
            <h2 className="text-xl font-bold text-green-600 mb-2">Login Berhasil!</h2>
            <p className="text-gray-600">Mengalihkan Anda ke dashboard...</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default Login
