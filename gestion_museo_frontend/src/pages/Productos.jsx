"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    cargarProductos(currentPage)
  }, [currentPage])

  function cargarProductos(pagina) {
    setLoading(true)
    // Simulamos la carga de datos desde la API
    // En un entorno real, esto se conectaría a tu backend
    setTimeout(() => {
      const mockProductos = [
        {
          id: 1,
          nombre: "Catálogo de Exposición",
          precio: 25,
          stock: 50,
          descripcion: "Catálogo completo de la exposición temporal de Arte Moderno.",
          imagen:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          nombre: "Póster Enmarcado",
          precio: 35,
          stock: 30,
          descripcion: "Reproducción de alta calidad de obras maestras del museo.",
          imagen:
            "https://images.unsplash.com/photo-1581337544116-e3abac50aa13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          nombre: "Taza de Cerámica",
          precio: 12,
          stock: 100,
          descripcion: "Taza con diseños inspirados en las obras del museo.",
          imagen:
            "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 4,
          nombre: "Libreta de Notas",
          precio: 8,
          stock: 75,
          descripcion: "Libreta con diseños artísticos en la portada.",
          imagen:
            "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 5,
          nombre: "Lámina Decorativa",
          precio: 18,
          stock: 40,
          descripcion: "Lámina de alta calidad lista para enmarcar.",
          imagen:
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 6,
          nombre: "Set de Postales",
          precio: 10,
          stock: 60,
          descripcion: "Colección de 10 postales con las obras más emblemáticas.",
          imagen:
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
      ]

      setProductos(mockProductos)
      setTotalPages(1)
      setLoading(false)
    }, 800)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleReset = () => {
    setSearchTerm("")
    cargarProductos(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const productosFiltrados = productos.filter((producto) => {
    return producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleClick = (producto) => {
    navigate(`/detalle-producto/${producto.id}`, { state: { producto } })
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Tienda del Museo</h1>
          <p className="text-gray-500 text-sm">Descubre nuestra selección de productos exclusivos</p>
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
                placeholder="Buscar productos..."
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

            {/* Botón de reset minimalista, solo visible cuando hay filtros activos */}
            {searchTerm && (
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors" onClick={handleReset}>
                Limpiar
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="group relative cursor-pointer"
                    onClick={() => handleClick(producto)}
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-90 transition-opacity">
                      <img
                        src={producto.imagen || "/placeholder.svg"}
                        alt={producto.nombre}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{producto.nombre}</h3>
                        <p className="mt-1 text-sm text-gray-500">Stock: {producto.stock} unidades</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{producto.precio} €</p>
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
