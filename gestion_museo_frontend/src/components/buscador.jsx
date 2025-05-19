"use client"

import { useState } from "react"
import { Search, Calendar, X } from "lucide-react"

export default function Buscador({ onSearch, onFilter, onReset }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilterChange = (e) => {
    const value = e.target.value
    setFilterDate(value)
    onFilter(value)
  }

  const handleReset = () => {
    setSearchTerm("")
    setFilterDate("")
    onReset()
  }

  return (
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
            placeholder="Buscar publicaciones..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setSearchTerm("")
                onSearch("")
              }}
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
                  onClick={() => {
                    setFilterDate("")
                    onFilter("")
                    setIsFilterOpen(false)
                  }}
                >
                  Todas las fechas
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterDate === "today" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFilterDate("today")
                    onFilter("today")
                    setIsFilterOpen(false)
                  }}
                >
                  Hoy
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterDate === "week" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFilterDate("week")
                    onFilter("week")
                    setIsFilterOpen(false)
                  }}
                >
                  Esta semana
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterDate === "month" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFilterDate("month")
                    onFilter("month")
                    setIsFilterOpen(false)
                  }}
                >
                  Este mes
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterDate === "year" ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFilterDate("year")
                    onFilter("year")
                    setIsFilterOpen(false)
                  }}
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
            <button
              className="ml-1 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setFilterDate("")
                onFilter("")
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  )
}
