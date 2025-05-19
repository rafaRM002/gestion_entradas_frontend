"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../utilities/apirest"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Buscador from "../components/buscador"

// First, import the Lucide icons at the top of your file
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Informativos() {
  const [elementos, setElementos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    cargarElementos(currentPage)
  }, [currentPage])

  function cargarElementos(pagina) {
    setLoading(true)
    const url = API_URL + "api/informativosPaginados"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .post(url, { pagina }, { headers })
      .then((response) => {
        if (response.data.success) {
          setElementos(response.data.data)
          setTotalPages(response.data.totalPages)
        }
      })
      .catch((error) => {
        console.error("Error al cargar los informativos:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleClick = (elemento) => {
    navigate("/mostrador", { state: { elemento } })
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("es-ES", options)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleFilter = (dateFilter) => {
    setFilterDate(dateFilter)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleReset = () => {
    setSearchTerm("")
    setFilterDate("")
    setCurrentPage(1) // Reset to first page when clearing filters
    cargarElementos(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filtrarPorFecha = (fechaStr) => {
    if (!filterDate) return true

    const fecha = new Date(fechaStr)
    const hoy = new Date()

    switch (filterDate) {
      case "today":
        return fecha.toDateString() === hoy.toDateString()
      case "week": {
        const primerDiaSemana = new Date(hoy)
        primerDiaSemana.setDate(hoy.getDate() - hoy.getDay())
        const ultimoDiaSemana = new Date(primerDiaSemana)
        ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6)
        return fecha >= primerDiaSemana && fecha <= ultimoDiaSemana
      }
      case "month":
        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
      case "year":
        return fecha.getFullYear() === hoy.getFullYear()
      default:
        return true
    }
  }

  // Apply client-side filtering to the paginated data
  const elementosFiltrados = elementos
    // Primero: filtrar publicaciones futuras o actuales
    .filter((elemento) => {
      const fechaEvento = new Date(elemento.fecha_evento)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0) // para ignorar la hora
      return fechaEvento >= hoy
    })
    // Segundo: aplicar filtro de fecha (mes, semana, etc.)
    .filter((elemento) => {
      const coincideBusqueda = elemento.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      const coincideFecha = filtrarPorFecha(elemento.fecha_evento)
      return coincideBusqueda && coincideFecha
    })

  // If we're filtering, we might need to reload data when no results are found
  useEffect(() => {
    if (searchTerm || filterDate) {
      // If filtering results in empty array and we have more pages, try loading more data
      if (elementosFiltrados.length === 0 && currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
      }
    }
  }, [elementosFiltrados.length])

  // Replace the renderPaginationButtons function with this simpler version
  const renderPaginationButtons = () => {
    return (
      <div className="flex justify-center items-center mt-8 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Publicaciones de Tipo Informativo</h1>
          <p className="text-gray-500 text-sm">Encuentra información actualizada sobre eventos y noticias gratuitos</p>
        </div>

        {/* Buscador */}
        <div className="mb-10">
          <Buscador onSearch={handleSearch} onFilter={handleFilter} onReset={handleReset} />
        </div>

        {/* Esto es para mostrar la animacion de Cargando */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {elementosFiltrados.length > 0 ? (
                elementosFiltrados.map((elemento) => (
                  <div
                    key={elemento.id}
                    className="group relative cursor-pointer"
                    onClick={() => handleClick(elemento)}
                  >
                    <img
                      src={API_URL + "storage/photos/" + elemento.imagen.split(";")[0] || "/placeholder.svg"}
                      alt={elemento.titulo}
                      className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                    />
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">{elemento.titulo}</h3>
                        <p className="mt-1 text-sm text-gray-500">{formatDate(elemento.fecha_evento)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">
                    No se encontraron resultados que coincidan con los criterios de búsqueda.
                  </p>
                </div>
              )}
            </div>

            {/* Replace the pagination controls section with this */}
            {!loading && totalPages > 1 && <div className="mt-10">{renderPaginationButtons()}</div>}
          </>
        )}
      </div>
    </div>
  )
}
