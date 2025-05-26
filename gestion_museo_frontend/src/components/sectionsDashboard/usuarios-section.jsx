"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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

export function UsuariosSection({ currentUser }) {
  const [usuarios, setUsuarios] = useState([
    { id: 1, username: "admin1", password: "****", rol: "ADMIN" },
    { id: 2, username: "vendedor1", password: "****", rol: "VENDEDOR" },
    { id: 3, username: "superadmin", password: "****", rol: "SUPERADMIN" },
    { id: 4, username: "admin2", password: "****", rol: "ADMIN" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rol: "VENDEDOR",
  })

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (usuario) => {
    setEditingUser(usuario)
    setFormData({
      username: usuario.username,
      password: "",
      rol: usuario.rol,
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      username: "",
      password: "",
      rol: "VENDEDOR",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsuarios(
        usuarios.map((u) => (u.id === editingUser.id ? { ...u, username: formData.username, rol: formData.rol } : u)),
      )
    } else {
      const newUser = {
        id: Math.max(...usuarios.map((u) => u.id)) + 1,
        username: formData.username,
        password: "****",
        rol: formData.rol,
      }
      setUsuarios([...usuarios, newUser])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id))
  }

  const getRoleBadgeVariant = (rol) => {
    switch (rol) {
      case "SUPERADMIN":
        return "destructive"
      case "ADMIN":
        return "default"
      case "VENDEDOR":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Lista de todos los usuarios registrados en el sistema</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
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
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell>{usuario.username}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(usuario.rol)}>{usuario.rol}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(usuario)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(usuario.id)}
                        disabled={usuario.id === currentUser.id}
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
            <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Modifica los datos del usuario seleccionado"
                : "Completa los datos para crear un nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuario
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="col-span-3"
              />
            </div>
            {!editingUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rol" className="text-right">
                Rol
              </Label>
              <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  {currentUser.rol === "SUPERADMIN" && <SelectItem value="SUPERADMIN">Super Admin</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingUser ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
