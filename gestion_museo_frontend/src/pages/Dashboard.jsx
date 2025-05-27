"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Dashboard({ userInfo }) {
  const [activeSection, setActiveSection] = useState("usuarios")
  const [selectedComercio, setSelectedComercio] = useState(null)
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null)
  const navigate = useNavigate()

  // Datos mock de comercios para SUPERADMIN
  const comercios = [
    { id: 1, nombre: "Restaurante El Buen Sabor" },
    { id: 2, nombre: "Cafetería Central" },
    { id: 3, nombre: "Tienda de Ropa Moderna" },
  ]

  // Si es ADMIN, establecer automáticamente su comercio
  useEffect(() => {
    if (userInfo?.rol === "ADMIN" && userInfo?.comercio_id) {
      setSelectedComercio(userInfo.comercio_id)
    }
  }, [userInfo])

  const handlePreviewEstablecimiento = (establecimientoId) => {
    navigate(`/preview/${establecimientoId}`)
  }

  const handleComercioSelect = (comercioId) => {
    setSelectedComercio(Number(comercioId))
    // Si estamos en la sección de comercios, cambiar a establecimientos
    if (activeSection === "comercios") {
      setActiveSection("establecimientos")
    }
  }

  const getComercioNombre = (comercioId) => {
    const comercio = comercios.find((c) => c.id === comercioId)
    return comercio?.nombre || "Selecciona un comercio"
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con selector de comercio para SUPERADMIN */}
      {userInfo?.rol === "SUPERADMIN" && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600 ml-60" />
                <span className="font-medium text-gray-900">Comercio Seleccionado:</span>
              </div>
              <Select value={selectedComercio?.toString() || ""} onValueChange={handleComercioSelect}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Selecciona un comercio">
                    {selectedComercio ? getComercioNombre(selectedComercio) : "Selecciona un comercio"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {comercios.map((comercio) => (
                    <SelectItem key={comercio.id} value={comercio.id.toString()}>
                      {comercio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard principal */}
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar
            currentUser={userInfo}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            selectedComercio={selectedComercio}
            setSelectedComercio={setSelectedComercio}
            setSelectedEstablecimiento={setSelectedEstablecimiento}
            onPreviewEstablecimiento={handlePreviewEstablecimiento}
            comercios={comercios}
            onLogout={handleLogout}
          />
          <main className="flex-1 p-6 overflow-auto">
            {/* Mostrar mensaje si SUPERADMIN no ha seleccionado comercio y no está en la sección comercios */}
            {userInfo?.rol === "SUPERADMIN" && !selectedComercio && activeSection !== "comercios" ? (
              <Card className="max-w-2xl mx-auto mt-20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Building2 className="h-6 w-6" />
                    Selecciona un Comercio
                  </CardTitle>
                  <CardDescription>
                    Para comenzar a gestionar, selecciona un comercio en el selector superior o ve a la sección de
                    Comercios
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Como SUPERADMIN puedes gestionar todos los comercios del sistema. Selecciona uno para ver y editar
                    sus establecimientos, productos y más.
                  </p>
                  <button
                    onClick={() => setActiveSection("comercios")}
                    className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Ir a Comercios
                  </button>
                </CardContent>
              </Card>
            ) : (
              <DashboardContent
                currentUser={userInfo}
                activeSection={activeSection}
                selectedComercio={selectedComercio}
                selectedEstablecimiento={selectedEstablecimiento}
                setSelectedComercio={setSelectedComercio}
                setSelectedEstablecimiento={setSelectedEstablecimiento}
                onPreviewEstablecimiento={handlePreviewEstablecimiento}
                comercios={comercios}
                onComercioSelect={handleComercioSelect}
              />
            )}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
