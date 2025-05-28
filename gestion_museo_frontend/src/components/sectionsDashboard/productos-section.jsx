"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { API_URL } from "../../utilities/apirest"
import axios from "axios"

export function ProductosSection({ currentUser, selectedEstablecimiento }) {
  const [productos, setProductos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProducto, setEditingProducto] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    establecimiento_id: selectedEstablecimiento || 0,
  })

  useEffect(() => {
    if (selectedEstablecimiento) {
      fetchProductos()
    } else {
      setProductos([])
      setLoading(false)
    }
  }, [selectedEstablecimiento])

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      const response = await axios.get(`${API_URL}api/producto/establecimiento/${selectedEstablecimiento}`, {
        headers,
      })
      setProductos(response.data)
    } catch (error) {
      console.error("Error fetching productos:", error)
      setProductos([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleEdit = (producto) => {
    setEditingProducto(producto)
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      establecimiento_id: producto.establecimiento_id || producto.establecimiento?.id,
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingProducto(null)
    setFormData({
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      establecimiento_id: selectedEstablecimiento,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      if (editingProducto) {
        await axios.put(`${API_URL}api/producto/${editingProducto.id}`, formData, { headers })
      } else {
        await axios.post(`${API_URL}api/producto`, formData, { headers })
      }

      fetchProductos()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving producto:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`${API_URL}api/producto/${id}`, { headers })
      fetchProductos()
    } catch (error) {
      console.error("Error deleting producto:", error)
    }
  }

  if (loading && selectedEstablecimiento) {
    return <div>Cargando productos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra los productos del establecimiento</p>
        </div>
        {selectedEstablecimiento && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        )}
      </div>

      {!selectedEstablecimiento && (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>Selecciona un establecimiento para gestionar sus productos.</AlertDescription>
        </Alert>
      )}

      {selectedEstablecimiento && (
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>Lista de productos del establecimiento seleccionado</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.id}</TableCell>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell className="max-w-xs truncate">{producto.descripcion}</TableCell>
                    <TableCell>€{Number(producto.precio).toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={producto.stock < 10 ? "text-red-600 font-medium" : ""}>{producto.stock}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(producto)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(producto.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProducto ? "Editar Producto" : "Crear Producto"}</DialogTitle>
            <DialogDescription>
              {editingProducto
                ? "Modifica los datos del producto seleccionado"
                : "Completa los datos para crear un nuevo producto"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="precio">Precio (€)</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingProducto ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
