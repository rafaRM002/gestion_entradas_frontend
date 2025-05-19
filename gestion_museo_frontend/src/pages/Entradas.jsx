"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Search, Calendar, X } from "lucide-react"

export default function Entradas() {
  const [entradas, setEntradas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    cargarEntradas(currentPage)
  }, [currentPage])

  function cargarEntradas(pagina) {
    setLoading(true)
    // Simulamos la carga de datos desde la API
    // En un entorno real, esto se conectaría a tu backend
    setTimeout(() => {
      const mockEntradas = [
        {
          id: 1,
          nombre: "Entrada General",
          precio: 12,
          tipo: "general",
          fecha: "2025-06-01",
          descripcion: "Acceso a todas las exposiciones permanentes del museo.",
          imagen:
            "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          nombre: "Entrada Reducida",
          precio: 8,
          tipo: "reducida",
          fecha: "2025-06-01",
          descripcion: "Para estudiantes, jubilados y personas con discapacidad.",
          imagen:
            "https://images.unsplash.com/photo-1577083288073-40892c0860a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          nombre: "Exposición Temporal: Arte Moderno",
          precio: 15,
          tipo: "temporal",
          fecha: "2025-07-15",
          descripcion: "Acceso a la exposición temporal de Arte Moderno.",
          imagen:
            "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 4,
          nombre: "Pase Anual",
          precio: 50,
          tipo: "anual",
          fecha: "2025-12-31",
          descripcion: "Acceso ilimitado durante un año a todas las exposiciones.",
          imagen:
            "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          id: 5,
          nombre: "Visita Guiada",
          precio: 20,
          tipo: "guiada",
          fecha: "2025-06-15",
          descripcion: "Recorrido con guía experto por las principales obras del museo.",
          imagen:
            "https://images.unsplash.com/photo-1566159266269-2d7b3c7c9e44?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        },
        {
          id: 6,
          nombre: "Taller de Arte",
          precio: 25,
          tipo: "taller",
          fecha: "2025-06-20",
          descripcion: "Taller práctico de técnicas artísticas para todas las edades.",
          imagen:
            "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
      ]

      setEntradas(mockEntradas)
      setTotalPages(1)
      setLoading(false)
    }, 800)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (filter) => {
    setFilterDate(filter)
    setIsFilterOpen(false)
  }

  const handleReset = () => {
    setSearchTerm("")
    setFilterDate("")
    cargarEntradas(1)
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

  const entradasFiltradas = entradas.filter((entrada) => {
    const coincideBusqueda = entrada.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const coincideFecha = filtrarPorFecha(entrada.fecha)
    return coincideBusqueda && coincideFecha
  })

  const handleClick = (entrada) => {
    navigate(`/detalle-entrada/${entrada.id}`, { state: { entrada } })
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("es-ES", options)
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Entradas al Museo</h1>
          <p className="text-gray-500 text-sm">Selecciona el tipo de entrada que deseas adquirir</p>
        </div>

        {/* Buscador */}
        <div className="w-full mb-8 transition-all duration-300">
          <div className="flex items-center gap-3">
            {/* Buscador minimalista */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full py-2 pl-10 pr-10 text-sm bg-white border-b border-gray-200 focus:border-gray-400 focus:outline-none transition-all duration-200"
                placeholder="Buscar entradas..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtro de fecha minimalista */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  filterDate ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:bg-gray-50"
                }`}
                title="Filtrar por fecha"
              >
                <Calendar className="w-5 h-5" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10 border border-gray-100">
                  <div className="py-1">
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filterDate === "" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("")}
                    >
                      Todas las fechas
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filterDate === "today" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("today")}
                    >
                      Hoy
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filterDate === "week" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("week")}
                    >
                      Esta semana
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filterDate === "month" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("month")}
                    >
                      Este mes
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filterDate === "year" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("year")}
                    >
                      Este año
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de reset minimalista, solo visible cuando hay filtros activos */}
            {(searchTerm || filterDate) && (
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors" onClick={handleReset}>
                Limpiar
              </button>
            )}
          </div>

          {/* Indicador de filtros activos */}
          {filterDate && (
            <div className="mt-3 flex items-center">
              <span className="text-xs text-gray-500 mr-2">Filtrado por:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {filterDate === "today"
                  ? "Hoy"
                  : filterDate === "week"
                    ? "Esta semana"
                    : filterDate === "month"
                      ? "Este mes"
                      : "Este año"}
                <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setFilterDate("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {entradasFiltradas.length > 0 ? (
                entradasFiltradas.map((entrada) => (
                  <div key={entrada.id} className="group relative cursor-pointer" onClick={() => handleClick(entrada)}>
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-90 transition-opacity">
                      <img
                        src={entrada.imagen || "/placeholder.svg"}
                        alt={entrada.nombre}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{entrada.nombre}</h3>
                        <p className="mt-1 text-sm text-gray-500">{formatDate(entrada.fecha)}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{entrada.precio} €</p>
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

            {/* Pagination controls */}
            {!loading && totalPages > 1 && (
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
