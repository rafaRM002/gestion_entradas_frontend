"use client"
import { useNavigate } from "react-router-dom"

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/") // Navega al inicio después de hacer logout
  }

  return (
    <button onClick={handleLogout} className="block px-4 py-2 text-sm text-black focus:bg-blue-200 focus:outline-none">
      Logout
    </button>
  )
}

export default LogoutButton
