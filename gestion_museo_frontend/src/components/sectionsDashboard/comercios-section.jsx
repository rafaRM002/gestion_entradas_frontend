"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Store, Check } from "lucide-react"
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
import { API_URL } from "../../utilities/apirest"
import axios from "axios"

export function ComerciosSection({
  currentUser,
  selectedComercio,
  setSelectedComercio,
  comercios = [],
  onComercioSelect,
}) {
  const [comerciosState, setComercios] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingComercio, setEditingComercio] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    usuario_id: 0,
  })

  useEffect(() => {
    fetchComercios()
    fetchUsuarios()
  }, [])

  const fetchComercios = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      const response = await axios.get(`${API_URL}api/comercios`, { headers })
      setComercios(response.data)
    } catch (error) {
      console.error("Error fetching comercios:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      const response = await axios.get(`${API_URL}api/usuarios`, { headers })
      setUsuarios(response.data.filter((user) => user.rol === "ADMIN"))
    } catch (error) {
      console.error("Error fetching usuarios:", error)
    }
  }

  const filteredComercios = comerciosState.filter(
    (comercio) =>
      comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comercio.usuario?.username.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      if (editingComercio) {
        await axios.put(`${API_URL}api/comercios/${editingComercio.id}`, formData, { headers })
      } else {
        await axios.post(`${API_URL}api/comercios`, formData, { headers })
      }

      fetchComercios()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving comercio:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`${API_URL}api/comercios/${id}`, { headers })

      if (selectedComercio === id) {
        setSelectedComercio(null)
      }
      fetchComercios()
    } catch (error) {
      console.error("Error deleting comercio:", error)
    }
  }

  const handleSelectComercio = (comercio) => {
    if (onComercioSelect) {
      onComercioSelect(comercio.id)
    } else {
      setSelectedComercio(comercio.id)
    }
  }

  if (loading) {
    return <div>Cargando comercios...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Comercios</h1>
          <p className="text-muted-foreground">
            {currentUser.rol === "SUPERADMIN"
              ? "Selecciona un comercio para gestionar o administra todos los comercios del sistema"
              : "Administra todos los comercios del sistema"}
          </p>
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
            <CardDescription>Comercio: {comerciosState.find((c) => c.id === selectedComercio)?.nombre}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedComercio(null)}>
                Deseleccionar
              </Button>
              <Button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("navigate-to-section", { detail: "establecimientos" }))
                }}
              >
                Gestionar Establecimientos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Comercios Disponibles</CardTitle>
          <CardDescription>
            {currentUser.rol === "SUPERADMIN"
              ? "Haz clic en un comercio para seleccionarlo y gestionarlo"
              : "Lista de todos los comercios registrados en el sistema"}
          </CardDescription>
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
                <TableRow
                  key={comercio.id}
                  className={`${selectedComercio === comercio.id ? "bg-muted" : ""} ${
                    currentUser.rol === "SUPERADMIN" ? "cursor-pointer hover:bg-muted/50" : ""
                  }`}
                  onClick={() => currentUser.rol === "SUPERADMIN" && handleSelectComercio(comercio)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {selectedComercio === comercio.id && <Check className="h-4 w-4 text-green-600" />}
                      {comercio.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{comercio.nombre}</TableCell>
                  <TableCell>{comercio.usuario?.username || "Sin asignar"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {currentUser.rol === "SUPERADMIN" && selectedComercio !== comercio.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectComercio(comercio)
                          }}
                        >
                          Seleccionar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(comercio)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(comercio.id)
                        }}
                      >
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