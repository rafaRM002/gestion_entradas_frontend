"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Minus, Plus, ShoppingCart, Check, AlertCircle } from "lucide-react"

export default function DetalleProducto({ cart, setCart }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(true)
  const [producto, setProducto] = useState(null)
  const [añadido, setAñadido] = useState(false)
  const [precioTotal, setPrecioTotal] = useState(0)
  const [stockDisponible, setStockDisponible] = useState(true)

  useEffect(() => {
    if (location.state && location.state.producto) {
      setProducto(location.state.producto)
      setPrecioTotal(location.state.producto.precio * cantidad)
      setStockDisponible(location.state.producto.stock >= cantidad)
      setLoading(false)
    } else {
      // Si no hay estado, cargar el producto desde la API usando el ID
      // Simulamos la carga para este ejemplo
      setTimeout(() => {
        const mockProducto = {
          id: Number.parseInt(id),
          nombre: "Catálogo de Exposición",
          precio: 25,
          stock: 50,
          descripcion: "Catálogo completo de la exposición temporal de Arte Moderno.",
          imagen:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        }
        setProducto(mockProducto)
        setPrecioTotal(mockProducto.precio * cantidad)
        setStockDisponible(mockProducto.stock >= cantidad)
        setLoading(false)
      }, 800)
    }
  }, [id, location.state])

  useEffect(() => {
    if (producto) {
      setPrecioTotal(producto.precio * cantidad)
      setStockDisponible(producto.stock >= cantidad)

      // Verificar si ya está en el carrito
      const existeEnCarrito = cart.some((item) => {
        return item.id === producto.id && item.tipo === "producto"
      })

      setAñadido(existeEnCarrito)
    }
  }, [cantidad, producto, cart])

  const handleDecrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  const handleIncrementarCantidad = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1)
    }
  }

  const handleAddToCart = () => {
    if (producto && stockDisponible) {
      const nuevoItem = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
        tipo: "producto",
        imagen: producto.imagen,
        precioTotal: precioTotal,
      }

      setCart((prevCart) => [...prevCart, nuevoItem])
      setAñadido(true)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Producto no encontrado</h1>
        <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md" onClick={() => navigate("/productos")}>
          Volver a productos
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
              src={producto.imagen || "/placeholder.svg"}
              alt={producto.nombre}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{producto.nombre}</h1>

            <div className="mb-6">
              <p className="text-2xl font-semibold text-gray-900">{producto.precio} €</p>
              <p className="text-sm text-gray-500 mt-1">Precio por unidad</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Descripción</h2>
              <p className="text-gray-600">{producto.descripcion}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Detalles</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-32">Stock disponible:</span>
                  <span>{producto.stock} unidades</span>
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
                <div className="px-4 py-2 border-t border-b border-gray-300 min-w-[60px] text-center">{cantidad}</div>
                <button
                  onClick={handleIncrementarCantidad}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                  disabled={cantidad >= producto.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {!stockDisponible && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>No hay suficiente stock disponible</span>
                </div>
              )}
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
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 ${
                    stockDisponible
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!stockDisponible}
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
