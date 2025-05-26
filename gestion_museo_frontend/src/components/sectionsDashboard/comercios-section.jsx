"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, Store } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ComerciosSection({ currentUser, selectedComercio, setSelectedComercio }) {
  const [comercios, setComercios] = useState([
    { id: 1, nombre: "Restaurante El Buen Sabor", usuario_id: 1, usuario_nombre: "admin1" },
    { id: 2, nombre: "Cafetería Central", usuario_id: 2, usuario_nombre: "admin2" },
    { id: 3, nombre: "Tienda de Ropa Moderna", usuario_id: 1, usuario_nombre: "admin1" },
  ])

  const [usuarios] = useState([
    { id: 1, username: "admin1" },
    { id: 2, username: "admin2" },
    { id: 3, username: "admin3" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [editingComercio, setEditingComercio] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    usuario_id: 0,
  })

  const filteredComercios = comercios.filter(
    (comercio) =>
      comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comercio.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (comercio) => {
    setEditingComercio(comercio)
    setFormData({
      nombre: comercio.nombre,
      usuario_id: comercio.usuario_id,
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingComercio(null)
    setFormData({
      nombre: "",
      usuario_id: 0,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const usuario = usuarios.find((u) => u.id === formData.usuario_id)
    if (!usuario) return

    if (editingComercio) {
      setComercios(
        comercios.map((c) =>
          c.id === editingComercio.id
            ? { ...c, nombre: formData.nombre, usuario_id: formData.usuario_id, usuario_nombre: usuario.username }
            : c,
        ),
      )
    } else {
      const newComercio = {
        id: Math.max(...comercios.map((c) => c.id)) + 1,
        nombre: formData.nombre,
        usuario_id: formData.usuario_id,
        usuario_nombre: usuario.username,
      }
      setComercios([...comercios, newComercio])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id) => {
    setComercios(comercios.filter((c) => c.id !== id))
  }

  const handleSelectComercio = (comercio) => {
    setSelectedComercio(comercio.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Comercios</h1>
          <p className="text-muted-foreground">Administra todos los comercios del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Comercio
        </Button>
      </div>

      {selectedComercio && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Comercio Seleccionado
            </CardTitle>
            <CardDescription>Comercio: {comercios.find((c) => c.id === selectedComercio)?.nombre}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setSelectedComercio(null)}>
              Deseleccionar
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Comercios</CardTitle>
          <CardDescription>Lista de todos los comercios registrados en el sistema</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comercios..."
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
                <TableHead>Propietario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComercios.map((comercio) => (
                <TableRow key={comercio.id} className={selectedComercio === comercio.id ? "bg-muted" : ""}>
                  <TableCell className="font-medium">{comercio.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={() => handleSelectComercio(comercio)}
                    >
                      {comercio.nombre}
                    </Button>
                  </TableCell>
                  <TableCell>{comercio.usuario_nombre}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(comercio)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(comercio.id)}>
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
            <DialogTitle>{editingComercio ? "Editar Comercio" : "Crear Comercio"}</DialogTitle>
            <DialogDescription>
              {editingComercio
                ? "Modifica los datos del comercio seleccionado"
                : "Completa los datos para crear un nuevo comercio"}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usuario" className="text-right">
                Propietario
              </Label>
              <Select
                value={formData.usuario_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, usuario_id: Number.parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id.toString()}>
                      {usuario.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingComercio ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
