"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, Building } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

export function EstablecimientosSection({
  currentUser,
  selectedComercio,
  selectedEstablecimiento,
  setSelectedEstablecimiento,
}) {
  const [establecimientos, setEstablecimientos] = useState([
    { id: 1, nombre: "Sucursal Centro", comercio_id: 1, comercio_nombre: "Restaurante El Buen Sabor" },
    { id: 2, nombre: "Sucursal Norte", comercio_id: 1, comercio_nombre: "Restaurante El Buen Sabor" },
    { id: 3, nombre: "Local Principal", comercio_id: 2, comercio_nombre: "Cafetería Central" },
    { id: 4, nombre: "Tienda Mall", comercio_id: 3, comercio_nombre: "Tienda de Ropa Moderna" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [editingEstablecimiento, setEditingEstablecimiento] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
  })

  // Filtrar establecimientos según el rol del usuario
  const getFilteredEstablecimientos = () => {
    let filtered = establecimientos

    // Si es ADMIN, solo mostrar sus establecimientos
    if (currentUser.rol === "ADMIN" && currentUser.comercio_id) {
      filtered = filtered.filter((est) => est.comercio_id === currentUser.comercio_id)
    }

    // Si hay un comercio seleccionado, filtrar por ese comercio
    if (selectedComercio) {
      filtered = filtered.filter((est) => est.comercio_id === selectedComercio)
    }

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (est) =>
          est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          est.comercio_nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredEstablecimientos = getFilteredEstablecimientos()

  const handleEdit = (establecimiento) => {
    setEditingEstablecimiento(establecimiento)
    setFormData({
      nombre: establecimiento.nombre,
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingEstablecimiento(null)
    setFormData({
      nombre: "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const comercio_id = selectedComercio || currentUser.comercio_id || 1

    if (editingEstablecimiento) {
      setEstablecimientos(
        establecimientos.map((est) =>
          est.id === editingEstablecimiento.id ? { ...est, nombre: formData.nombre } : est,
        ),
      )
    } else {
      const comercio = establecimientos.find((est) => est.comercio_id === comercio_id)
      const newEstablecimiento = {
        id: Math.max(...establecimientos.map((est) => est.id)) + 1,
        nombre: formData.nombre,
        comercio_id: comercio_id,
        comercio_nombre: comercio?.comercio_nombre || "Comercio",
      }
      setEstablecimientos([...establecimientos, newEstablecimiento])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id) => {
    setEstablecimientos(establecimientos.filter((est) => est.id !== id))
    if (selectedEstablecimiento === id) {
      setSelectedEstablecimiento(null)
    }
  }

  const handleSelectEstablecimiento = (establecimiento) => {
    setSelectedEstablecimiento(establecimiento.id)
  }

  const canCreateEstablecimiento = () => {
    return (
      currentUser.rol === "SUPERADMIN" || (currentUser.rol === "ADMIN" && (selectedComercio || currentUser.comercio_id))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Establecimientos</h1>
          <p className="text-muted-foreground">
            Administra los establecimientos
            {selectedComercio && " del comercio seleccionado"}
          </p>
        </div>
        {canCreateEstablecimiento() && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Establecimiento
          </Button>
        )}
      </div>

      {!canCreateEstablecimiento() && currentUser.rol === "ADMIN" && !currentUser.comercio_id && (
        <Alert>
          <AlertDescription>Selecciona un comercio para gestionar sus establecimientos.</AlertDescription>
        </Alert>
      )}

      {selectedEstablecimiento && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Establecimiento Seleccionado
            </CardTitle>
            <CardDescription>
              Establecimiento: {establecimientos.find((est) => est.id === selectedEstablecimiento)?.nombre}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setSelectedEstablecimiento(null)}>
              Deseleccionar
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Establecimientos</CardTitle>
          <CardDescription>
            Lista de establecimientos
            {selectedComercio && " del comercio seleccionado"}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar establecimientos..."
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
                <TableHead>Comercio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstablecimientos.map((establecimiento) => (
                <TableRow
                  key={establecimiento.id}
                  className={selectedEstablecimiento === establecimiento.id ? "bg-muted" : ""}
                >
                  <TableCell className="font-medium">{establecimiento.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={() => handleSelectEstablecimiento(establecimiento)}
                    >
                      {establecimiento.nombre}
                    </Button>
                  </TableCell>
                  <TableCell>{establecimiento.comercio_nombre}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(establecimiento)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(establecimiento.id)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEstablecimiento ? "Editar Establecimiento" : "Crear Establecimiento"}</DialogTitle>
            <DialogDescription>
              {editingEstablecimiento
                ? "Modifica los datos del establecimiento seleccionado"
                : "Completa los datos para crear un nuevo establecimiento"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingEstablecimiento ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
