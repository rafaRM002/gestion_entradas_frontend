"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utilities/apirest"
import axios from "axios"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function realizarSolicitud(event) {
    event.preventDefault()
    setLoading(true)
    const url = API_URL + "login"

    axios
      .post(url, { username: username, password: password })
      .then((response) => {
        if (response.status == 200) {
          const token = response.data.token
          localStorage.setItem("authToken", token)
          localStorage.setItem("username", username) // Guardamos el username para futuras consultas
          setErrorMessage(null)

          // Redirigir según el rol después del login
          navigate("/dashboard")
        }
      })
      .catch((error) => {
        setLoading(false)
        if (error.response) {
          setErrorMessage("Credenciales incorrectas. Inténtalo de nuevo.")
        } else {
          setErrorMessage("Error de conexión. Por favor, intenta más tarde.")
        }
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-24 h-auto mb-4" />
        </div>

        <h2 className="text-center text-2xl font-medium text-gray-800 mb-6">INICIAR SESIÓN</h2>

        {errorMessage && (
          <div className="text-sm text-center text-red-700 bg-red-50 rounded py-2 mb-4">{errorMessage}</div>
        )}

        <form onSubmit={realizarSolicitud} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-800"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <span className="underline cursor-pointer hover:text-gray-800">
            <a href="/registro">Regístrate</a>
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login