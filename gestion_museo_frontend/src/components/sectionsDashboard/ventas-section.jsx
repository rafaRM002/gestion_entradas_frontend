"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, Calendar, CreditCard, Loader2, Plus, Edit, Trash2, Eye } from "lucide-react"
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

export function VentasSection({ currentUser }) {
  const [ventas, setVentas] = useState([])
  const [establecimientos, setEstablecimientos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroMetodoPago, setFiltroMetodoPago] = useState("todos")
  const [filtroFecha, setFiltroFecha] = useState("todos")
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentVenta, setCurrentVenta] = useState(null)
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().slice(0, 16),
    metodo_pago: "EFECTIVO",
    total: 0,
    establecimiento_id: "",
    usuario_id: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [lineasVenta, setLineasVenta] = useState([])
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })

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
        // Fetch ventas
        const ventasResponse = await axios.get(`${API_URL}api/ventas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setVentas(ventasResponse.data)

        // Fetch establecimientos for dropdown
        const establecimientosResponse = await axios.get(`${API_URL}api/establecimiento`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setEstablecimientos(establecimientosResponse.data)

        // Fetch usuarios for dropdown
        const usuariosResponse = await axios.get(`${API_URL}api/usuarios`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setUsuarios(usuariosResponse.data)

        // Fetch líneas de venta for details view
        const lineasResponse = await axios.get(`${API_URL}api/lineaVenta`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setLineasVenta(lineasResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        showNotification("error", "No se pudieron cargar los datos. Por favor, inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter ventas based on search term and filters
  const filteredVentas = ventas.filter((venta) => {
    const matchesSearch =
      venta.establecimiento?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.usuario?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.id_entrada?.toString().includes(searchTerm)

    const matchesMetodoPago = filtroMetodoPago === "todos" || venta.metodo_pago === filtroMetodoPago

    const matchesFecha =
      filtroFecha === "todos" ||
      (() => {
        const ventaFecha = new Date(venta.fecha)
        const hoy = new Date()
        const ayer = new Date(hoy)
        ayer.setDate(hoy.getDate() - 1)
        const semanaAtras = new Date(hoy)
        semanaAtras.setDate(hoy.getDate() - 7)

        switch (filtroFecha) {
          case "hoy":
            return ventaFecha.toDateString() === hoy.toDateString()
          case "ayer":
            return ventaFecha.toDateString() === ayer.toDateString()
          case "semana":
            return ventaFecha >= semanaAtras
          default:
            return true
        }
      })()

    return matchesSearch && matchesMetodoPago && matchesFecha
  })

  // Get método pago badge variant
  const getMetodoPagoBadgeVariant = (metodo) => {
    switch (metodo) {
      case "EFECTIVO":
        return "default"
      case "TARJETA":
        return "secondary"
      case "BIZUM":
        return "outline"
      case "GOOGLE_PAY":
        return "destructive"
      default:
        return "outline"
    }
  }

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

  // Get total ventas
  const getTotalVentas = () => {
    return filteredVentas.reduce((sum, venta) => sum + venta.total, 0)
  }

  // Get líneas by venta
  const getLineasByVenta = (ventaId) => {
    return lineasVenta.filter((linea) => linea.venta?.id_entrada === ventaId)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.fecha) errors.fecha = "La fecha es obligatoria"
    if (!formData.metodo_pago) errors.metodo_pago = "El método de pago es obligatorio"
    if (!formData.total || formData.total <= 0) errors.total = "El total debe ser mayor a 0"
    if (!formData.establecimiento_id) errors.establecimiento_id = "El establecimiento es obligatorio"
    if (!formData.usuario_id) errors.usuario_id = "El usuario es obligatorio"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Open create form
  const handleOpenCreateForm = () => {
    setIsEditing(false)
    setFormData({
      fecha: new Date().toISOString().slice(0, 16),
      metodo_pago: "EFECTIVO",
      total: 0,
      establecimiento_id: "",
      usuario_id: "",
    })
    setFormErrors({})
    setIsFormDialogOpen(true)
  }

  // Open edit form
  const handleOpenEditForm = (venta) => {
    setIsEditing(true)
    setCurrentVenta(venta)
    setFormData({
      fecha: new Date(venta.fecha).toISOString().slice(0, 16),
      metodo_pago: venta.metodo_pago,
      total: venta.total,
      establecimiento_id: venta.establecimiento?.id.toString(),
      usuario_id: venta.usuario?.id.toString(),
    })
    setFormErrors({})
    setIsFormDialogOpen(true)
  }

  // Open view dialog
  const handleOpenViewDialog = (venta) => {
    setCurrentVenta(venta)
    setIsViewDialogOpen(true)
  }

  // Open delete confirmation
  const handleOpenDeleteDialog = (venta) => {
    setCurrentVenta(venta)
    setIsDeleteDialogOpen(true)
  }

  // Submit form (create or edit)
  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const ventaData = {
        fecha: formData.fecha,
        metodo_pago: formData.metodo_pago,
        total: Number.parseFloat(formData.total),
        establecimiento: { id: Number.parseInt(formData.establecimiento_id) },
        usuario: { id: Number.parseInt(formData.usuario_id) },
      }

      if (isEditing) {
        // Update existing venta
        await axios.put(`${API_URL}api/ventas/${currentVenta.id_entrada}`, ventaData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })

        // Update local state
        setVentas(
          ventas.map((venta) => (venta.id_entrada === currentVenta.id_entrada ? { ...venta, ...ventaData } : venta)),
        )

        showNotification("success", "Venta actualizada correctamente")
      } else {
        // Create new venta
        const response = await axios.post(`${API_URL}api/ventas`, ventaData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })

        // Update local state with the new venta
        setVentas([...ventas, response.data])

        showNotification("success", "Venta creada correctamente")
      }

      setIsFormDialogOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      showNotification("error", isEditing ? "No se pudo actualizar la venta" : "No se pudo crear la venta")
    } finally {
      setSubmitting(false)
    }
  }

  // Delete venta
  const handleDelete = async () => {
    if (!currentVenta) return

    setSubmitting(true)
    try {
      await axios.delete(`${API_URL}api/ventas/${currentVenta.id_entrada}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })

      // Update local state
      setVentas(ventas.filter((venta) => venta.id_entrada !== currentVenta.id_entrada))

      showNotification("success", "Venta eliminada correctamente")

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting venta:", error)
      showNotification("error", "No se pudo eliminar la venta")
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
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Ventas</h1>
          <p className="text-muted-foreground">Historial y análisis de todas las ventas realizadas</p>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Venta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredVentas.length}</div>
            <p className="text-xs text-muted-foreground">ventas registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{getTotalVentas().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">en ventas filtradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{filteredVentas.length > 0 ? (getTotalVentas() / filteredVentas.length).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">promedio por venta</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ventas</CardTitle>
          <CardDescription>Historial completo de ventas realizadas</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ventas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filtroMetodoPago} onValueChange={setFiltroMetodoPago}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los métodos</SelectItem>
                <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                <SelectItem value="TARJETA">Tarjeta</SelectItem>
                <SelectItem value="BIZUM">Bizum</SelectItem>
                <SelectItem value="GOOGLE_PAY">Google Pay</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroFecha} onValueChange={setFiltroFecha}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las fechas</SelectItem>
                <SelectItem value="hoy">Hoy</SelectItem>
                <SelectItem value="ayer">Ayer</SelectItem>
                <SelectItem value="semana">Última semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredVentas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No se encontraron ventas</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Establecimiento</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentas.map((venta) => (
                  <TableRow key={venta.id_entrada}>
                    <TableCell className="font-medium">#{venta.id_entrada}</TableCell>
                    <TableCell>{formatFecha(venta.fecha)}</TableCell>
                    <TableCell>{venta.establecimiento?.nombre}</TableCell>
                    <TableCell>{venta.usuario?.username}</TableCell>
                    <TableCell>
                      <Badge variant={getMetodoPagoBadgeVariant(venta.metodo_pago)}>{venta.metodo_pago}</Badge>
                    </TableCell>
                    <TableCell>€{venta.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenViewDialog(venta)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleOpenEditForm(venta)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleOpenDeleteDialog(venta)}>
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
            Mostrando {filteredVentas.length} de {ventas.length} ventas
          </div>
        </CardFooter>
      </Card>

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar" : "Crear"} Venta</DialogTitle>
            <DialogDescription>
              {isEditing ? "Modifica los detalles de la venta" : "Completa el formulario para crear una nueva venta"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fecha">Fecha y Hora</Label>
              <Input
                id="fecha"
                name="fecha"
                type="datetime-local"
                value={formData.fecha}
                onChange={handleInputChange}
                className={formErrors.fecha ? "border-red-500" : ""}
              />
              {formErrors.fecha && <p className="text-xs text-red-500">{formErrors.fecha}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="metodo_pago">Método de Pago</Label>
              <Select value={formData.metodo_pago} onValueChange={(value) => handleSelectChange("metodo_pago", value)}>
                <SelectTrigger id="metodo_pago" className={formErrors.metodo_pago ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="TARJETA">Tarjeta</SelectItem>
                  <SelectItem value="BIZUM">Bizum</SelectItem>
                  <SelectItem value="GOOGLE_PAY">Google Pay</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.metodo_pago && <p className="text-xs text-red-500">{formErrors.metodo_pago}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="total">Total (€)</Label>
              <Input
                id="total"
                name="total"
                type="number"
                step="0.01"
                value={formData.total}
                onChange={handleInputChange}
                className={formErrors.total ? "border-red-500" : ""}
              />
              {formErrors.total && <p className="text-xs text-red-500">{formErrors.total}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="establecimiento_id">Establecimiento</Label>
              <Select
                value={formData.establecimiento_id}
                onValueChange={(value) => handleSelectChange("establecimiento_id", value)}
              >
                <SelectTrigger
                  id="establecimiento_id"
                  className={formErrors.establecimiento_id ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona un establecimiento" />
                </SelectTrigger>
                <SelectContent>
                  {establecimientos.map((establecimiento) => (
                    <SelectItem key={establecimiento.id} value={establecimiento.id.toString()}>
                      {establecimiento.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.establecimiento_id && <p className="text-xs text-red-500">{formErrors.establecimiento_id}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="usuario_id">Usuario</Label>
              <Select value={formData.usuario_id} onValueChange={(value) => handleSelectChange("usuario_id", value)}>
                <SelectTrigger id="usuario_id" className={formErrors.usuario_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id.toString()}>
                      {usuario.username} ({usuario.rol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.usuario_id && <p className="text-xs text-red-500">{formErrors.usuario_id}</p>}
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
              <ShoppingCart className="h-5 w-5" />
              Detalle de Venta #{currentVenta?.id_entrada}
            </DialogTitle>
            <DialogDescription>
              {currentVenta && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="font-medium">Fecha:</span> {formatFecha(currentVenta.fecha)}
                  </div>
                  <div>
                    <span className="font-medium">Total:</span> €{currentVenta.total.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Método de pago:</span>{" "}
                    <Badge variant={getMetodoPagoBadgeVariant(currentVenta.metodo_pago)}>
                      {currentVenta.metodo_pago}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Establecimiento:</span> {currentVenta.establecimiento?.nombre}
                  </div>
                  <div>
                    <span className="font-medium">Usuario:</span> {currentVenta.usuario?.username} (
                    {currentVenta.usuario?.rol})
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">Líneas de Venta</h3>
            {currentVenta && getLineasByVenta(currentVenta.id_entrada).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLineasByVenta(currentVenta.id_entrada).map((linea) => (
                    <TableRow key={linea.id}>
                      <TableCell className="font-medium">{linea.id}</TableCell>
                      <TableCell>{linea.producto?.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{linea.entrada?.nombre}</Badge>
                      </TableCell>
                      <TableCell>{linea.cantidad}</TableCell>
                      <TableCell>€{Number.parseFloat(linea.subtotal).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No hay líneas de venta asociadas a esta venta
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la venta #{currentVenta?.id_entrada} y todas sus líneas de venta
              asociadas. Esta acción no se puede deshacer.
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
