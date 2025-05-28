"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingBag, Package, Receipt, Loader2, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { API_URL } from "../../utilities/apirest"
import axios from "axios"

export function LineasVentaSection({ currentUser }) {
  const [lineasVenta, setLineasVenta] = useState([])
  const [ventas, setVentas] = useState([])
  const [productos, setProductos] = useState([])
  const [entradas, setEntradas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstablecimiento, setFiltroEstablecimiento] = useState("todos")
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentLinea, setCurrentLinea] = useState(null)
  const [formData, setFormData] = useState({
    venta_id: "",
    producto_id: "",
    entrada_id: "",
    cantidad: 1,
    subtotal: 0,
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })
  const [establecimientos, setEstablecimientos] = useState([])

  // Mostrar notificación
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 3000)
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch líneas de venta
        const lineasResponse = await axios.get(`${API_URL}api/lineaVenta`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setLineasVenta(lineasResponse.data)

        // Fetch ventas for dropdown
        const ventasResponse = await axios.get(`${API_URL}api/ventas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setVentas(ventasResponse.data)

        // Fetch productos for dropdown
        const productosResponse = await axios.get(`${API_URL}api/productos`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setProductos(productosResponse.data)

        // Fetch entradas for dropdown
        const entradasResponse = await axios.get(`${API_URL}api/entradas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setEntradas(entradasResponse.data)

        // Extract unique establecimientos from líneas de venta
        const uniqueEstablecimientos = Array.from(
          new Set(
            lineasResponse.data
              .map((linea) => {
                const establecimiento = linea.venta?.establecimiento
                return establecimiento
                  ? JSON.stringify({ id: establecimiento.id, nombre: establecimiento.nombre })
                  : null
              })
              .filter(Boolean),
          ),
        ).map((jsonString) => JSON.parse(jsonString))

        setEstablecimientos(uniqueEstablecimientos)
      } catch (error) {
        console.error("Error fetching data:", error)
        showNotification("error", "No se pudieron cargar los datos. Por favor, inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter líneas de venta based on search term and filters
  const filteredLineasVenta = lineasVenta.filter((linea) => {
    const matchesSearch =
      linea.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linea.entrada?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linea.id?.toString().includes(searchTerm)

    const matchesEstablecimiento =
      filtroEstablecimiento === "todos" || linea.venta?.establecimiento?.id.toString() === filtroEstablecimiento

    return matchesSearch && matchesEstablecimiento
  })

  // Format date
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get total líneas de venta
  const getTotalSubtotal = () => {
    return filteredLineasVenta.reduce((sum, linea) => sum + Number.parseFloat(linea.subtotal || 0), 0)
  }

  // Get total cantidad
  const getTotalCantidad = () => {
    return filteredLineasVenta.reduce((sum, linea) => sum + Number.parseInt(linea.cantidad || 0), 0)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Auto-calculate subtotal when cantidad or producto_id changes
    if (name === "cantidad" || name === "producto_id") {
      if (formData.producto_id) {
        const producto = productos.find(
          (p) => p.id.toString() === (name === "producto_id" ? value : formData.producto_id),
        )
        if (producto && producto.precio) {
          const cantidad = name === "cantidad" ? Number.parseFloat(value) : Number.parseFloat(formData.cantidad)
          const subtotal = producto.precio * cantidad
          setFormData((prev) => ({ ...prev, subtotal: subtotal.toFixed(2) }))
        }
      }
    }
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })

    // Auto-calculate subtotal when producto_id changes
    if (name === "producto_id") {
      const producto = productos.find((p) => p.id.toString() === value)
      if (producto && producto.precio && formData.cantidad) {
        const subtotal = producto.precio * Number.parseFloat(formData.cantidad)
        setFormData((prev) => ({ ...prev, subtotal: subtotal.toFixed(2) }))
      }
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.venta_id) errors.venta_id = "La venta es obligatoria"
    if (!formData.producto_id) errors.producto_id = "El producto es obligatorio"
    if (!formData.entrada_id) errors.entrada_id = "La entrada es obligatoria"
    if (!formData.cantidad || formData.cantidad <= 0) errors.cantidad = "La cantidad debe ser mayor a 0"
    if (!formData.subtotal || formData.subtotal <= 0) errors.subtotal = "El subtotal debe ser mayor a 0"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Open create form
  const handleOpenCreateForm = () => {
    setIsEditing(false)
    setFormData({
      venta_id: "",
      producto_id: "",
      entrada_id: "",
      cantidad: 1,
      subtotal: 0,
    })
    setFormErrors({})
    setIsFormDialogOpen(true)
  }

  // Open edit form
  const handleOpenEditForm = (linea) => {
    setIsEditing(true)
    setCurrentLinea(linea)
    setFormData({
      venta_id: linea.venta?.id_entrada.toString(),
      producto_id: linea.producto?.id.toString(),
      entrada_id: linea.entrada?.id_entrada.toString(),
      cantidad: linea.cantidad,
      subtotal: linea.subtotal,
    })
    setFormErrors({})
    setIsFormDialogOpen(true)
  }

  // Open view dialog
  const handleOpenViewDialog = (linea) => {
    setCurrentLinea(linea)
    setIsViewDialogOpen(true)
  }

  // Open delete confirmation
  const handleOpenDeleteDialog = (linea) => {
    setCurrentLinea(linea)
    setIsDeleteDialogOpen(true)
  }

  // Submit form (create or edit)
  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const lineaData = {
        venta: { id_entrada: Number.parseInt(formData.venta_id) },
        producto: { id: Number.parseInt(formData.producto_id) },
        entrada: { id_entrada: Number.parseInt(formData.entrada_id) },
        cantidad: Number.parseInt(formData.cantidad),
        subtotal: Number.parseFloat(formData.subtotal),
      }

      if (isEditing) {
        // Update existing línea de venta
        await axios.put(`${API_URL}api/lineaVenta/${currentLinea.id}`, lineaData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })

        // Update local state
        setLineasVenta(lineasVenta.map((linea) => (linea.id === currentLinea.id ? { ...linea, ...lineaData } : linea)))

        showNotification("success", "Línea de venta actualizada correctamente")
      } else {
        // Create new línea de venta
        const response = await axios.post(`${API_URL}api/lineaVenta`, lineaData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })

        // Update local state with the new línea de venta
        setLineasVenta([...lineasVenta, response.data])

        showNotification("success", "Línea de venta creada correctamente")
      }

      setIsFormDialogOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      showNotification(
        "error",
        isEditing ? "No se pudo actualizar la línea de venta" : "No se pudo crear la línea de venta",
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Delete línea de venta
  const handleDelete = async () => {
    if (!currentLinea) return

    setSubmitting(true)
    try {
      await axios.delete(`${API_URL}api/lineaVenta/${currentLinea.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })

      // Update local state
      setLineasVenta(lineasVenta.filter((linea) => linea.id !== currentLinea.id))

      showNotification("success", "Línea de venta eliminada correctamente")

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting línea de venta:", error)
      showNotification("error", "No se pudo eliminar la línea de venta")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification banner */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Líneas de Venta</h1>
          <p className="text-muted-foreground">Gestión de líneas de venta y productos vendidos</p>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Línea de Venta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Líneas</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLineasVenta.length}</div>
            <p className="text-xs text-muted-foreground">líneas de venta registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalCantidad()}</div>
            <p className="text-xs text-muted-foreground">productos vendidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{getTotalSubtotal().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">en líneas de venta</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Líneas de Venta</CardTitle>
          <CardDescription>Historial completo de líneas de venta</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar líneas de venta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filtroEstablecimiento} onValueChange={setFiltroEstablecimiento}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filtrar por establecimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los establecimientos</SelectItem>
                {establecimientos.map((establecimiento) => (
                  <SelectItem key={establecimiento.id} value={establecimiento.id.toString()}>
                    {establecimiento.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLineasVenta.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No se encontraron líneas de venta</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Venta</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLineasVenta.map((linea) => (
                  <TableRow key={linea.id}>
                    <TableCell className="font-medium">#{linea.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">#{linea.venta?.id_entrada}</Badge>
                    </TableCell>
                    <TableCell>{linea.producto?.nombre}</TableCell>
                    <TableCell>{linea.entrada?.nombre}</TableCell>
                    <TableCell>{linea.cantidad}</TableCell>
                    <TableCell>€{Number.parseFloat(linea.subtotal).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenViewDialog(linea)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleOpenEditForm(linea)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleOpenDeleteDialog(linea)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredLineasVenta.length} de {lineasVenta.length} líneas de venta
          </div>
        </CardFooter>
      </Card>

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar" : "Crear"} Línea de Venta</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los detalles de la línea de venta"
                : "Completa el formulario para crear una nueva línea de venta"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="venta_id">Venta</Label>
              <Select value={formData.venta_id} onValueChange={(value) => handleSelectChange("venta_id", value)}>
                <SelectTrigger id="venta_id" className={formErrors.venta_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona una venta" />
                </SelectTrigger>
                <SelectContent>
                  {ventas.map((venta) => (
                    <SelectItem key={venta.id_entrada} value={venta.id_entrada.toString()}>
                      #{venta.id_entrada} - {formatFecha(venta.fecha)} - €{venta.total.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.venta_id && <p className="text-xs text-red-500">{formErrors.venta_id}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="producto_id">Producto</Label>
              <Select value={formData.producto_id} onValueChange={(value) => handleSelectChange("producto_id", value)}>
                <SelectTrigger id="producto_id" className={formErrors.producto_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos.map((producto) => (
                    <SelectItem key={producto.id} value={producto.id.toString()}>
                      {producto.nombre} - €{producto.precio.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.producto_id && <p className="text-xs text-red-500">{formErrors.producto_id}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="entrada_id">Entrada</Label>
              <Select value={formData.entrada_id} onValueChange={(value) => handleSelectChange("entrada_id", value)}>
                <SelectTrigger id="entrada_id" className={formErrors.entrada_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona una entrada" />
                </SelectTrigger>
                <SelectContent>
                  {entradas.map((entrada) => (
                    <SelectItem key={entrada.id_entrada} value={entrada.id_entrada.toString()}>
                      {entrada.nombre} - {entrada.tipo} - €{entrada.precio.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.entrada_id && <p className="text-xs text-red-500">{formErrors.entrada_id}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                name="cantidad"
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={handleInputChange}
                className={formErrors.cantidad ? "border-red-500" : ""}
              />
              {formErrors.cantidad && <p className="text-xs text-red-500">{formErrors.cantidad}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtotal">Subtotal (€)</Label>
              <Input
                id="subtotal"
                name="subtotal"
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={handleInputChange}
                className={formErrors.subtotal ? "border-red-500" : ""}
              />
              {formErrors.subtotal && <p className="text-xs text-red-500">{formErrors.subtotal}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>{isEditing ? "Actualizar" : "Crear"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Detalle de Línea de Venta #{currentLinea?.id}
            </DialogTitle>
            <DialogDescription>
              {currentLinea && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="font-medium">Venta:</span> #{currentLinea.venta?.id_entrada}
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span> {formatFecha(currentLinea.venta?.fecha)}
                  </div>
                  <div>
                    <span className="font-medium">Producto:</span> {currentLinea.producto?.nombre}
                  </div>
                  <div>
                    <span className="font-medium">Precio unitario:</span> €{currentLinea.producto?.precio.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Entrada:</span> {currentLinea.entrada?.nombre} (
                    {currentLinea.entrada?.tipo})
                  </div>
                  <div>
                    <span className="font-medium">Precio entrada:</span> €{currentLinea.entrada?.precio.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Cantidad:</span> {currentLinea.cantidad}
                  </div>
                  <div>
                    <span className="font-medium">Subtotal:</span> €
                    {Number.parseFloat(currentLinea.subtotal).toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Establecimiento:</span> {currentLinea.venta?.establecimiento?.nombre}
                  </div>
                  <div>
                    <span className="font-medium">Comercio:</span>{" "}
                    {currentLinea.venta?.establecimiento?.comercio?.nombre}
                  </div>
                  <div>
                    <span className="font-medium">Vendedor:</span> {currentLinea.venta?.usuario?.username}
                  </div>
                  <div>
                    <span className="font-medium">Método de pago:</span> {currentLinea.venta?.metodo_pago}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la línea de venta #{currentLinea?.id}. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
