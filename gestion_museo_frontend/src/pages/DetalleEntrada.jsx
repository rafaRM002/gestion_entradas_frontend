"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Minus, Plus, ShoppingCart, Check } from "lucide-react"

export default function DetalleEntrada({ cart, setCart }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(true)
  const [entrada, setEntrada] = useState(null)
  const [añadido, setAñadido] = useState(false)
  const [precioTotal, setPrecioTotal] = useState(0)

  useEffect(() => {
    if (location.state && location.state.entrada) {
      setEntrada(location.state.entrada)
      setPrecioTotal(location.state.entrada.precio * cantidad)
      setLoading(false)
    } else {
      // Si no hay estado, cargar la entrada desde la API usando el ID
      // Simulamos la carga para este ejemplo
      setTimeout(() => {
        const mockEntrada = {
          id: Number.parseInt(id),
          nombre: "Entrada General",
          precio: 12,
          tipo: "general",
          fecha: "2025-06-01",
          descripcion: "Acceso a todas las exposiciones permanentes del museo.",
          imagen:
            "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        }
        setEntrada(mockEntrada)
        setPrecioTotal(mockEntrada.precio * cantidad)
        setLoading(false)
      }, 800)
    }
  }, [id, location.state])

  useEffect(() => {
    if (entrada) {
      setPrecioTotal(entrada.precio * cantidad)

      // Verificar si ya está en el carrito
      const existeEnCarrito = cart.some((item) => {
        return item.id === entrada.id && item.tipo === "entrada"
      })

      setAñadido(existeEnCarrito)
    }
  }, [cantidad, entrada, cart])

  const handleDecrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  const handleIncrementarCantidad = () => {
    setCantidad(cantidad + 1)
  }

  const handleAddToCart = () => {
    if (entrada) {
      const nuevoItem = {
        id: entrada.id,
        nombre: entrada.nombre,
        precio: entrada.precio,
        cantidad: cantidad,
        tipo: "entrada",
        imagen: entrada.imagen,
        precioTotal: precioTotal,
      }

      setCart((prevCart) => [...prevCart, nuevoItem])
      setAñadido(true)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("es-ES", options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!entrada) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Entrada no encontrada</h1>
        <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md" onClick={() => navigate("/entradas")}>
          Volver a entradas
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={entrada.imagen || "/placeholder.svg"}
              alt={entrada.nombre}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{entrada.nombre}</h1>

            <div className="mb-6">
              <p className="text-2xl font-semibold text-gray-900">{entrada.precio} €</p>
              <p className="text-sm text-gray-500 mt-1">Precio por entrada</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Descripción</h2>
              <p className="text-gray-600">{entrada.descripcion}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Detalles</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-32">Tipo:</span>
                  <span className="capitalize">{entrada.tipo}</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32">Fecha válida:</span>
                  <span>{formatDate(entrada.fecha)}</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Cantidad</h2>
              <div className="flex items-center">
                <button
                  onClick={handleDecrementarCantidad}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                  disabled={cantidad <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="px-4 py-1 border-t border-b border-gray-300 min-w-[60px] text-center">{cantidad}</div>
                <button
                  onClick={handleIncrementarCantidad}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-gray-900">{precioTotal} €</span>
              </div>

              {añadido ? (
                <button
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-md flex items-center justify-center gap-2"
                  disabled
                >
                  <Check className="h-5 w-5" />
                  Añadido al carrito
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Añadir al carrito
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
