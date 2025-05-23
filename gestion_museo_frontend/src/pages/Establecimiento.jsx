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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Gestión de Establecimientos
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Selecciona el establecimiento al que deseas acceder para gestionar tus operaciones comerciales
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <EstablecimientosLoading />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
            <p className="font-semibold">Error al cargar los establecimientos</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Establecimientos Disponibles
              </h2>
              <p className="text-gray-600 text-lg">
                Mostrando {startIndex + 1}-{Math.min(endIndex, establecimientos.length)} de {establecimientos.length} establecimientos
              </p>
            </div>

            {/* Grid de establecimientos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentEstablecimientos.map((establecimiento) => (
                <EstablecimientoCard key={establecimiento.id} establecimiento={establecimiento} />
              ))}
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="lg"
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
                      size="lg"
                      onClick={() => handlePageChange(page)}
                      className="w-12"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
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
      className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-white border-gray-200 h-full"
      onClick={handleClick}
    >
      <div className="p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-xl">
            <Store className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">
              {establecimiento.nombre}
            </h3>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-sm">
            {establecimiento.comercio.nombre}
          </Badge>
          <div className="text-sm text-blue-600 font-medium">
            Acceder →
          </div>
        </div>
      </div>
    </Card>
  )
}

function EstablecimientosLoading() {
  return (
    <div className="space-y-12">
      {/* Section Title Loading */}
      <div className="text-center">
        <Skeleton className="h-10 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto" />
      </div>

      {/* Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden h-full">
            <div className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Loading */}
      <div className="flex justify-center space-x-2">
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-12" />
        <Skeleton className="h-12 w-12" />
        <Skeleton className="h-12 w-24" />
      </div>
    </div>
  )
}