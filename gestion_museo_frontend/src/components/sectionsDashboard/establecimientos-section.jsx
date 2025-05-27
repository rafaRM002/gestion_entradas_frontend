"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Building, Eye } from "lucide-react"
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
import { API_URL } from "../../utilities/apirest"
import axios from "axios"

export function EstablecimientosSection({
  currentUser,
  selectedComercio,
  selectedEstablecimiento,
  setSelectedEstablecimiento,
  onPreviewEstablecimiento,
}) {
  const [establecimientos, setEstablecimientos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingEstablecimiento, setEditingEstablecimiento] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    comercio_id: selectedComercio || currentUser.comercio_id || 0,
  })

  useEffect(() => {
    fetchEstablecimientos()
  }, [selectedComercio])

  const fetchEstablecimientos = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      let url = `${API_URL}api/establecimiento`
      if (selectedComercio) {
        url += `/${selectedComercio}`
      } else if (currentUser.rol === "ADMIN" && currentUser.comercio_id) {
        url += `/${currentUser.comercio_id}`
      }

      const response = await axios.get(url, { headers })
      setEstablecimientos(response.data)
    } catch (error) {
      console.error("Error fetching establecimientos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEstablecimientos = establecimientos.filter((establecimiento) => {
    const matchesSearch =
      establecimiento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establecimiento.comercio?.nombre.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleEdit = (establecimiento) => {
    setEditingEstablecimiento(establecimiento)
    setFormData({
      nombre: establecimiento.nombre,
      comercio_id: establecimiento.comercio_id,
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingEstablecimiento(null)
    setFormData({
      nombre: "",
      comercio_id: selectedComercio || currentUser.comercio_id || 0,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      if (editingEstablecimiento) {
        await axios.put(`${API_URL}api/establecimiento/${editingEstablecimiento.id}`, formData, { headers })
      } else {
        await axios.post(`${API_URL}api/establecimiento`, formData, { headers })
      }

      fetchEstablecimientos()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving establecimiento:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`${API_URL}api/establecimientos/${id}`, { headers })

      if (selectedEstablecimiento === id) {
        setSelectedEstablecimiento(null)
      }
      fetchEstablecimientos()
    } catch (error) {
      console.error("Error deleting establecimiento:", error)
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

  if (loading) {
    return <div>Cargando establecimientos...</div>
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedEstablecimiento(null)}>
                Deseleccionar
              </Button>
              <Button
                variant="default"
                onClick={() => onPreviewEstablecimiento(selectedEstablecimiento)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Previsualizar
              </Button>
            </div>
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
                  <TableCell>{establecimiento.comercio?.nombre || "Sin comercio"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPreviewEstablecimiento(establecimiento.id)}
                        title="Previsualizar establecimiento"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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