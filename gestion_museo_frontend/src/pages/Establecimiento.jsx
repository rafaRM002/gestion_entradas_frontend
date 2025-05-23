"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Building2, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"

export default function Establecimientos() {
  const [establecimientos, setEstablecimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("authToken")

        if (!token) {
          throw new Error("No se encontró el token de autenticación")
        }

        const response = await fetch("http://localhost:8080/api/establecimiento", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.status}`)
        }

        const data = await response.json()
        setEstablecimientos(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEstablecimientos()
  }, [])

  if (loading) {
    return <EstablecimientosLoading />
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error al cargar los establecimientos</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {establecimientos.map((establecimiento) => (
        <EstablecimientoCard key={establecimiento.id} establecimiento={establecimiento} />
      ))}
    </div>
  )
}

function EstablecimientoCard({ establecimiento }) {
    const navigate = useNavigate()
  const handleClick = () => {
    // Guardar el ID del establecimiento en localStorage
    localStorage.setItem("establecimiento", establecimiento.id.toString())
    // Redirigir a /home
    navigate("/home")
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-2">{establecimiento.nombre}</h3>
          <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
            <User className="h-4 w-4" />
            <span>{establecimiento.comercio.usuario.username}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function EstablecimientosLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
