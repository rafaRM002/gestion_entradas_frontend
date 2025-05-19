"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Trash2, ShoppingBag, CreditCard } from "lucide-react"

export default function Carrito({ cart, setCart }) {
  const [loading, setLoading] = useState(false)
  const [metodoPago, setMetodoPago] = useState("tarjeta")
  const [procesandoPago, setProcesandoPago] = useState(false)
  const [ticketCreado, setTicketCreado] = useState(false)
  const navigate = useNavigate()

  const handleEliminarProducto = (index) => {
    const nuevoCart = [...cart]
    nuevoCart.splice(index, 1)
    setCart(nuevoCart)
    localStorage.setItem("cart", JSON.stringify(nuevoCart))
  }

  const calcularTotal = () => {
    return cart.reduce((total, item) => total + item.precioTotal, 0)
  }

  const handleRealizarPedido = async () => {
    setProcesandoPago(true)

    // Simulamos el proceso de pago y creación de ticket
    setTimeout(() => {
      // En un entorno real, aquí se enviaría la información al backend
      // para procesar el pago y actualizar el stock de productos

      // Crear un ticket con los items del carrito
      const ticket = {
        id: Math.floor(Math.random() * 10000),
        fecha: new Date().toISOString(),
        items: [...cart],
        total: calcularTotal(),
        metodoPago: metodoPago,
      }

      // Guardar el ticket en localStorage (simulando base de datos)
      const ticketsGuardados = JSON.parse(localStorage.getItem("tickets") || "[]")
      ticketsGuardados.push(ticket)
      localStorage.setItem("tickets", JSON.stringify(ticketsGuardados))

      // Limpiar el carrito
      setCart([])
      localStorage.setItem("cart", JSON.stringify([]))

      setTicketCreado(true)
      setProcesandoPago(false)
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      {cart.length === 0 && !ticketCreado ? (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between"
          >
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800 mb-2">Carrito Vacío</h2>
              <div className="w-20 h-1 bg-gray-900 mb-6"></div>
              <p className="text-gray-600 mb-8">
                Aún no has añadido ningún producto o entrada al carrito. Explora nuestra tienda o adquiere entradas para
                visitar el museo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/entradas")}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
                >
                  Ver Entradas
                </Button>
                <Button
                  onClick={() => navigate("/productos")}
                  className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 px-6 py-2 rounded-md"
                >
                  Ver Productos
                </Button>
              </div>
            </div>
            <motion.div
              className="md:w-1/2 relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              <ShoppingBag className="h-40 w-40 text-gray-300 mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      ) : ticketCreado ? (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 rounded-xl p-8 md:p-12 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Compra realizada con éxito!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Tu pedido ha sido procesado correctamente. Puedes ver los detalles en la sección de tickets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/tickets")}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
              >
                Ver mis tickets
              </Button>
              <Button
                onClick={() => {
                  setTicketCreado(false)
                  navigate("/home")
                }}
                className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 px-6 py-2 rounded-md"
              >
                Volver al inicio
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contenedor scrollable para productos */}
            <div className="flex-1 max-h-[600px] overflow-y-auto pr-2 space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-6 border-b pb-6">
                  <img
                    src={item.imagen || "/placeholder.svg"}
                    alt={item.nombre}
                    className="h-24 w-24 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h2 className="text-lg font-medium text-gray-900">{item.nombre}</h2>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => handleEliminarProducto(index)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-gray-500">
                      {item.tipo === "entrada" ? "Entrada" : "Producto"} | Cantidad: {item.cantidad}
                    </p>
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-500">
                        {item.precio} € x {item.cantidad}
                      </p>
                      <p className="font-semibold">{item.precioTotal} €</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen y pago */}
            <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{calcularTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-medium">{(calcularTotal() * 0.21).toFixed(2)} €</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{(calcularTotal() * 1.21).toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Método de pago</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={metodoPago === "tarjeta"}
                      onChange={() => setMetodoPago("tarjeta")}
                      className="mr-3"
                    />
                    <span>Tarjeta de crédito/débito</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={metodoPago === "efectivo"}
                      onChange={() => setMetodoPago("efectivo")}
                      className="mr-3"
                    />
                    <span>Efectivo</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleRealizarPedido}
                disabled={procesandoPago}
                className={`w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 ${
                  procesandoPago ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
                } text-white transition-colors`}
              >
                {procesandoPago ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Finalizar compra</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
