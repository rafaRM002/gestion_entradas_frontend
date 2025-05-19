"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, FileText } from "lucide-react"

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketDetail, setShowTicketDetail] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Cargar tickets desde localStorage (simulando base de datos)
    const cargarTickets = () => {
      setLoading(true)
      setTimeout(() => {
        const ticketsGuardados = JSON.parse(localStorage.getItem("tickets") || "[]")

        // Si no hay tickets guardados, crear algunos de ejemplo
        if (ticketsGuardados.length === 0) {
          const ticketsEjemplo = [
            {
              id: 1001,
              fecha: "2025-05-15T14:30:00.000Z",
              items: [
                {
                  id: 1,
                  nombre: "Entrada General",
                  precio: 12,
                  cantidad: 2,
                  tipo: "entrada",
                  imagen:
                    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  precioTotal: 24,
                },
              ],
              total: 24,
              metodoPago: "tarjeta",
            },
            {
              id: 1002,
              fecha: "2025-05-10T11:15:00.000Z",
              items: [
                {
                  id: 3,
                  nombre: "Catálogo de Exposición",
                  precio: 25,
                  cantidad: 1,
                  tipo: "producto",
                  imagen:
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  precioTotal: 25,
                },
                {
                  id: 2,
                  nombre: "Entrada Reducida",
                  precio: 8,
                  cantidad: 1,
                  tipo: "entrada",
                  imagen:
                    "https://images.unsplash.com/photo-1577083288073-40892c0860a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  precioTotal: 8,
                },
              ],
              total: 33,
              metodoPago: "efectivo",
            },
          ]
          localStorage.setItem("tickets", JSON.stringify(ticketsEjemplo))
          setTickets(ticketsEjemplo)
        } else {
          setTickets(ticketsGuardados)
        }

        setLoading(false)
      }, 800)
    }

    cargarTickets()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setShowTicketDetail(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const ticketsFiltrados = tickets.filter((ticket) => {
    // Filtrar por ID de ticket o fecha
    return (
      ticket.id.toString().includes(searchTerm) ||
      formatDate(ticket.fecha).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mis Tickets</h1>
          <p className="text-gray-500 text-sm">Historial de compras realizadas</p>
        </div>

        {/* Buscador */}
        <div className="w-full mb-8 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full py-2 pl-10 pr-10 text-sm bg-white border-b border-gray-200 focus:border-gray-400 focus:outline-none transition-all duration-200"
                placeholder="Buscar por número de ticket o fecha..."
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
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No hay tickets disponibles</h2>
            <p className="text-gray-500 mb-6">Aún no has realizado ninguna compra</p>
            <button
              onClick={() => navigate("/entradas")}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Explorar entradas
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ticket #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Método de Pago
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ticketsFiltrados.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(ticket.fecha)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {ticket.items.length} {ticket.items.length === 1 ? "item" : "items"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{(ticket.total * 1.21).toFixed(2)} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {ticket.metodoPago === "tarjeta" ? "Tarjeta" : "Efectivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleViewTicket(ticket)} className="text-gray-600 hover:text-gray-900">
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalle de ticket */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Detalle del Ticket #{selectedTicket.id}</h2>
                <button onClick={() => setShowTicketDetail(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{formatDate(selectedTicket.fecha)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="font-medium capitalize">{selectedTicket.metodoPago}</span>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mb-3">Items</h3>
              <div className="space-y-4 mb-6">
                {selectedTicket.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.imagen || "/placeholder.svg"}
                        alt={item.nombre}
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{item.nombre}</h4>
                        <span className="font-medium">{item.precioTotal} €</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {item.tipo === "entrada" ? "Entrada" : "Producto"} | {item.precio} € x {item.cantidad}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{selectedTicket.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span>{(selectedTicket.total * 0.21).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span>Total</span>
                  <span>{(selectedTicket.total * 1.21).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowTicketDetail(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
