"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, Star } from "lucide-react"
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

export function ExtrasSection({ currentUser, selectedEstablecimiento }) {
  const [extras, setExtras] = useState([
    {
      id: 1,
      nombre: "Queso Extra",
      descripcion: "Porción adicional de queso",
      establecimiento_id: 1,
      establecimiento_nombre: "Sucursal Centro",
    },
    {
      id: 2,
      nombre: "Bacon",
      descripcion: "Tiras de bacon crujiente",
      establecimiento_id: 1,
      establecimiento_nombre: "Sucursal Centro",
    },
    {
      id: 3,
      nombre: "Leche de Soja",
      descripcion: "Sustituto de leche normal",
      establecimiento_id: 3,
      establecimiento_nombre: "Local Principal",
    },
    {
      id: 4,
      nombre: "Sirope de Vainilla",
      descripcion: "Sirope sabor vainilla",
      establecimiento_id: 3,
      establecimiento_nombre: "Local Principal",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [editingExtra, setEditingExtra] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })

  const filteredExtras = extras.filter((extra) => {
    const matchesSearch =
      extra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extra.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedEstablecimiento) {
      return matchesSearch && extra.establecimiento_id === selectedEstablecimiento
    }

    return matchesSearch
  })

  const handleEdit = (extra) => {
    setEditingExtra(extra)
    setFormData({
      nombre: extra.nombre,
      descripcion: extra.descripcion,
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingExtra(null)
    setFormData({
      nombre: "",
      descripcion: "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!selectedEstablecimiento) return

    if (editingExtra) {
      setExtras(extras.map((e) => (e.id === editingExtra.id ? { ...e, ...formData } : e)))
    } else {
      const establecimiento = extras.find((e) => e.establecimiento_id === selectedEstablecimiento)
      const newExtra = {
        id: Math.max(...extras.map((e) => e.id)) + 1,
        ...formData,
        establecimiento_id: selectedEstablecimiento,
        establecimiento_nombre: establecimiento?.establecimiento_nombre || "Establecimiento",
      }
      setExtras([...extras, newExtra])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id) => {
    setExtras(extras.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Extras</h1>
          <p className="text-muted-foreground">Administra los extras disponibles para los productos</p>
        </div>
        {selectedEstablecimiento && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Extra
          </Button>
        )}
      </div>

      {!selectedEstablecimiento && (
        <Alert>
          <Star className="h-4 w-4" />
          <AlertDescription>Selecciona un establecimiento para gestionar sus extras.</AlertDescription>
        </Alert>
      )}

      {selectedEstablecimiento && (
        <Card>
          <CardHeader>
            <CardTitle>Extras</CardTitle>
            <CardDescription>Lista de extras del establecimiento seleccionado</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar extras..."
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
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExtras.map((extra) => (
                  <TableRow key={extra.id}>
                    <TableCell className="font-medium">{extra.id}</TableCell>
                    <TableCell className="font-medium">{extra.nombre}</TableCell>
                    <TableCell className="max-w-xs truncate">{extra.descripcion}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(extra)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(extra.id)}>
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
            <DialogTitle>{editingExtra ? "Editar Extra" : "Crear Extra"}</DialogTitle>
            <DialogDescription>
              {editingExtra
                ? "Modifica los datos del extra seleccionado"
                : "Completa los datos para crear un nuevo extra"}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingExtra ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
