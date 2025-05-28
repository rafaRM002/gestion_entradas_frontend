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

  // Cargar establecimiento desde localStorage al iniciar
  useEffect(() => {
    const storedEstablecimiento = localStorage.getItem("selectedEstablecimiento")
    if (storedEstablecimiento) {
      try {
        const establecimiento = JSON.parse(storedEstablecimiento)
        setSelectedEstablecimiento(establecimiento)
      } catch (error) {
        console.error("Error al cargar establecimiento desde localStorage:", error)
        localStorage.removeItem("selectedEstablecimiento")
      }
    }
  }, [])

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("authToken")
      const username = localStorage.getItem("username")

      if (token && username) {
        try {
          const headers = { Authorization: `Bearer ${token}` }
          const url = `${API_URL}api/usuarios/username?username=${username}`

          const response = await axios.get(url, { headers })

          if (response.status === 200) {
            const userData = response.data

            // Mapear el rol del backend al formato del frontend
            let mappedRole = userData.rol
            if (userData.rol === "VENDEDOR") {
              mappedRole = "CLIENTE"
            }

            const userInfoData = {
              id: userData.id,
              username: userData.username,
              rol: mappedRole,
              comercio_id: userData.comercio_id || null,
              comercio: userData.comercio || null,
            }

            // Si es ADMIN, obtener su comercio asignado
            if (mappedRole === "ADMIN") {
              try {
                const comercioResponse = await axios.get(`${API_URL}api/comercio/usuario/${username}`, { headers })
                if (comercioResponse.status === 200 && comercioResponse.data.length > 0) {
                  const comercioData = comercioResponse.data[0]
                  userInfoData.comercio_id = comercioData.id
                  userInfoData.comercio = comercioData
                }
              } catch (comercioError) {
                console.error("Error al obtener comercio del usuario admin:", comercioError)
              }
            }

            setUserInfo(userInfoData)
            setUserRole(mappedRole)
          }
        } catch (error) {
          console.error("Error al obtener información del usuario:", error)
          // Si hay error, limpiar tokens y redirigir al login
          localStorage.removeItem("authToken")
          localStorage.removeItem("username")
          localStorage.removeItem("selectedEstablecimiento")
          setUserInfo(null)
          setUserRole(null)
          setSelectedEstablecimiento(null)
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
        // Si ya tiene establecimiento seleccionado, ir a home, sino a selección
        return selectedEstablecimiento ? "/home" : "/establecimiento"
      default:
        return "/"
    }
  }

  // Función para manejar la selección de establecimiento
  const handleSetSelectedEstablecimiento = (establecimiento) => {
    setSelectedEstablecimiento(establecimiento)
    localStorage.setItem("selectedEstablecimiento", JSON.stringify(establecimiento))
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

  // No mostrar navbar/footer en selección de establecimiento para clientes
  const shouldShowNavbar = (isClientView || isPreviewPage) && !isAuthPage && !isEstablecimientoSelection
  const shouldShowFooter = (isClientView || isPreviewPage) && !isAuthPage && !isEstablecimientoSelection

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
              <Establecimiento setSelectedEstablecimiento={handleSetSelectedEstablecimiento} />
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
