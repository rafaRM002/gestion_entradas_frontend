"use client"

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
  const [userRole, setUserRole] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null)

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("authToken")
      if (token) {
        try {
          const headers = { Authorization: `Bearer ${token}` }
          // Simulamos la respuesta de la API
          const mockUserInfo = {
            id: 1,
            username: "admin",
            rol: "SUPERADMIN", // Cambia esto para probar: CLIENTE, ADMIN, SUPERADMIN
            comercio_id: 1,
            comercio: {
              nombre: "Restaurante El Buen Sabor",
            },
          }
          setUserInfo(mockUserInfo)
          setUserRole(mockUserInfo.rol)
        } catch (error) {
          console.error("Error al obtener información del usuario:", error)
          localStorage.removeItem("authToken")
        }
      }
      setLoading(false)
    }

    fetchUserInfo()
  }, [isAuthenticated])

  // Función para determinar la ruta inicial según el rol
  const getInitialRoute = () => {
    if (!userRole) return "/"

    switch (userRole) {
      case "SUPERADMIN":
      case "ADMIN":
        return "/dashboard"
      case "CLIENTE":
        return "/establecimiento"
      default:
        return "/"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  // Determinar si mostrar navbar/footer
  const isClientView = userRole === "CLIENTE" && selectedEstablecimiento
  const isDashboardView = location.pathname === "/dashboard"
  const isEstablecimientoSelection = location.pathname === "/establecimiento"
  const isAuthPage = location.pathname === "/" || location.pathname === "/registro"
  const isPreviewPage = location.pathname.startsWith("/preview/")

  const shouldShowNavbar = (isClientView || isPreviewPage) && !isAuthPage
  const shouldShowFooter = (isClientView || isPreviewPage) && !isAuthPage

  // Datos mock para preview
  const mockEstablecimientoData = {
    id: 1,
    nombre: "Establecimiento Demo",
    comercio: { nombre: "Tienda de Ropa Moderna" },
  }

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          userRole={userRole}
          userInfo={userInfo}
          selectedEstablecimiento={isPreviewPage ? mockEstablecimientoData : selectedEstablecimiento}
          isPreview={isPreviewPage}
        />
      )}

      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to={getInitialRoute()} replace />} />
        <Route
          path="/registro"
          element={!isAuthenticated ? <Registro /> : <Navigate to={getInitialRoute()} replace />}
        />

        {/* Dashboard para SUPERADMIN y ADMIN */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <Dashboard userInfo={userInfo} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Selección de establecimiento para CLIENTES */}
        <Route
          path="/establecimiento"
          element={
            isAuthenticated && userRole === "CLIENTE" ? (
              <Establecimiento setSelectedEstablecimiento={setSelectedEstablecimiento} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* RUTAS DE PREVIEW para ADMIN/SUPERADMIN */}
        <Route
          path="/preview/:establecimientoId"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <Home userInfo={userInfo} selectedEstablecimiento={mockEstablecimientoData} isPreview={true} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/preview/:establecimientoId/entradas"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <Entradas userInfo={userInfo} selectedEstablecimiento={mockEstablecimientoData} isPreview={true} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/preview/:establecimientoId/productos"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <Productos userInfo={userInfo} selectedEstablecimiento={mockEstablecimientoData} isPreview={true} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/preview/:establecimientoId/tickets"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <Tickets userInfo={userInfo} selectedEstablecimiento={mockEstablecimientoData} isPreview={true} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/preview/:establecimientoId/carrito"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <Carrito
                cart={cart}
                setCart={setCart}
                userInfo={userInfo}
                selectedEstablecimiento={mockEstablecimientoData}
                isPreview={true}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/preview/:establecimientoId/detalle-entrada/:id"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <DetalleEntrada
                cart={cart}
                setCart={setCart}
                userInfo={userInfo}
                selectedEstablecimiento={mockEstablecimientoData}
                isPreview={true}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/preview/:establecimientoId/detalle-producto/:id"
          element={
            isAuthenticated && (userRole === "SUPERADMIN" || userRole === "ADMIN") ? (
              <DetalleProducto
                cart={cart}
                setCart={setCart}
                userInfo={userInfo}
                selectedEstablecimiento={mockEstablecimientoData}
                isPreview={true}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Rutas de la tienda (solo para CLIENTES con establecimiento seleccionado) */}
        <Route
          path="/home"
          element={
            isAuthenticated && userRole === "CLIENTE" && selectedEstablecimiento ? (
              <Home userInfo={userInfo} selectedEstablecimiento={selectedEstablecimiento} />
            ) : (
              <Navigate to="/establecimiento" replace />
            )
          }
        />
        <Route
          path="/entradas"
          element={
            isAuthenticated && userRole === "CLIENTE" && selectedEstablecimiento ? (
              <Entradas userInfo={userInfo} selectedEstablecimiento={selectedEstablecimiento} />
            ) : (
              <Navigate to="/establecimiento" replace />
            )
          }
        />
        <Route
          path="/productos"
          element={
            isAuthenticated && userRole === "CLIENTE" && selectedEstablecimiento ? (
              <Productos userInfo={userInfo} selectedEstablecimiento={selectedEstablecimiento} />
            ) : (
              <Navigate to="/establecimiento" replace />
            )
          }
        />
        <Route
          path="/detalle-entrada/:id"
          element={
            isAuthenticated && userRole === "CLIENTE" && selectedEstablecimiento ? (
              <DetalleEntrada
                cart={cart}
                setCart={setCart}
                userInfo={userInfo}
                selectedEstablecimiento={selectedEstablecimiento}
              />
            ) : (
              <Navigate to="/establecimiento" replace />
            )
          }
        />
        <Route
          path="/detalle-producto/:id"
          element={
            isAuthenticated && userRole === "CLIENTE" && selectedEstablecimiento ? (
              <DetalleProducto
                cart={cart}
                setCart={setCart}
                userInfo={userInfo}
                selectedEstablecimiento={selectedEstablecimiento}
              />
            ) : (
              <Navigate to="/establecimiento" replace />
            )
          }
        />
        <Route
          path="/carrito"
          element={
            isAuthenticated && userRole === "CLIENTE" && selectedEstablecimiento ? (
              <Carrito
                cart={cart}
                setCart={setCart}
                userInfo={userInfo}
                selectedEstablecimiento={selectedEstablecimiento}
              />
            ) : (
              <Navigate to="/establecimiento" replace />
            )
          }
        />
        <Route
          path="/tickets"
          element={
            isAuthenticated && userRole === "CLIENTE" && selectedEstablecimiento ? (
              <Tickets userInfo={userInfo} selectedEstablecimiento={selectedEstablecimiento} />
            ) : (
              <Navigate to="/establecimiento" replace />
            )
          }
        />
        <Route
          path="/perfil"
          element={isAuthenticated ? <Perfil userInfo={userInfo} /> : <Navigate to="/" replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {shouldShowFooter && (
        <Footer
          userInfo={userInfo}
          selectedEstablecimiento={isPreviewPage ? mockEstablecimientoData : selectedEstablecimiento}
        />
      )}
    </>
  )
}

export default App
