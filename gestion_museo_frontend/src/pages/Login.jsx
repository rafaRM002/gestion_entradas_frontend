"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import API_URL from "../utilities/apirest"

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

          // Forzar recarga para obtener datos del usuario
          window.location.href = "/"
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <form onSubmit={realizarSolicitud}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Usuario
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
