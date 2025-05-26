"use client"

// Actualizar las rutas y componentes para el sistema de museo
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Entradas from "./pages/Entradas"
import Productos from "./pages/Productos"
import DetalleEntrada from "./pages/DetalleEntrada"
import DetalleProducto from "./pages/DetalleProducto"
import Carrito from "./pages/Carrito"
import NotFound from "./pages/NotFound"
import Tickets from "./pages/Tickets"
import Perfil from "./pages/Perfil"
import Registro from "./pages/Register"
import Establecimiento from "./pages/Establecimiento"
import Dashboard from "./pages/DashBoard"
import { API_URL } from "./utilities/apirest"
import axios from "axios"

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const isAuthenticated = localStorage.getItem("authToken")
  const [cart, setCart] = useState([])
  const [admin, setAdmin] = useState()
  

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart))
      console.log("Carrito actualizado:", cart)
    }
  }, [cart]) // Se activa cada vez que el carrito cambia

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token != null) {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      axios
        .get(API_URL + "api/isAdmin", { headers })
        .then((response) => {
          console.log(response)
          if (response.status === 200) setAdmin(response.data.is_admin)
          else setAdmin(false)
        })
        .catch((error) => {
          console.error("Error al verificar rol de administrador:", error)
          setAdmin(false)
        })
    }
  }, [isAuthenticated])

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/registro" && location.pathname !== "/establecimiento" && <Navbar admin={admin} />}

      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/establecimiento" replace />} />
        <Route path="/registro" element={!isAuthenticated ? <Registro /> : <Navigate to="/establecimiento" replace />} />

    
        <Route path="/establecimiento" element={isAuthenticated ? <Establecimiento /> : <Navigate to="/" replace />} />


        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" replace />} />
        <Route path="/notFound" element={isAuthenticated ? <NotFound /> : <Navigate to="/" replace />} />
        <Route path="/entradas" element={isAuthenticated ? <Entradas /> : <Navigate to="/" replace />} />
        <Route path="/productos" element={isAuthenticated ? <Productos /> : <Navigate to="/" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route
          path="/detalle-entrada/:id"
          element={isAuthenticated ? <DetalleEntrada cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/detalle-producto/:id"
          element={isAuthenticated ? <DetalleProducto cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/carrito"
          element={isAuthenticated ? <Carrito cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        <Route path="/tickets" element={isAuthenticated ? <Tickets /> : <Navigate to="/" replace />} />
        <Route path="/perfil" element={isAuthenticated ? <Perfil /> : <Navigate to="/" replace />} />
        

        <Route path="*" element={<NotFound />} />
      </Routes>

      {location.pathname !== "/" && location.pathname !== "/registro" && location.pathname !== "/establecimiento" && <Footer />}
    </>
  )
}

export default App
