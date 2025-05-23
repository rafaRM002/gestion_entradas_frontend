"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 6

export default function Establecimientos() {
  const [establecimientos, setEstablecimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(establecimientos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentEstablecimientos = establecimientos.slice(startIndex, endIndex)

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

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  if (loading) {
    return <EstablecimientosLoading />
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-semibold">Error al cargar los establecimientos</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con información de paginación */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Establecimientos</h2>
          <p className="text-gray-600 mt-1">
            Mostrando {startIndex + 1}-{Math.min(endIndex, establecimientos.length)} de {establecimientos.length}{" "}
            establecimientos
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Página {currentPage} de {totalPages}
        </Badge>
      </div>

      {/* Grid de establecimientos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEstablecimientos.map((establecimiento) => (
          <EstablecimientoCard key={establecimiento.id} establecimiento={establecimiento} />
        ))}
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function EstablecimientoCard({ establecimiento }) {
  const navigate = useNavigate()

  const handleClick = () => {
    localStorage.setItem("establecimiento", establecimiento.id.toString())
    navigate("/home")
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer bg-white border-gray-200"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Store className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{establecimiento.nombre}</h3>
            <p className="text-sm text-gray-500 mt-1">ID: #{establecimiento.id.toString().padStart(3, "0")}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{establecimiento.comercio.usuario.username}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end items-center">
          <div className="text-xs text-gray-400">Clic para acceder</div>
        </div>
      </div>
    </Card>
  )
}

function EstablecimientosLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Skeleton className="h-4 w-40" />
              </div>

              <div className="mt-4 flex justify-end">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center space-x-2 pt-6">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-10" />
        <Skeleton className="h-9 w-10" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}