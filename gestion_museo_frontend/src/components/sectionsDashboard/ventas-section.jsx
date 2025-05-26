"use client"

import { useState } from "react"
import { Search, ShoppingCart, Calendar, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function VentasSection({ currentUser }) {
  const [ventas, setVentas] = useState([
    {
      id: 1,
      fecha: "2024-01-15T14:30:00",
      metodo_pago: "TARJETA",
      total: 35.5,
      establecimiento_id: 1,
      establecimiento_nombre: "Sucursal Centro",
      usuario_id: 1,
      usuario_nombre: "admin1",
    },
    {
      id: 2,
      fecha: "2024-01-16T10:15:00",
      metodo_pago: "EFECTIVO",
      total: 19.0,
      establecimiento_id: 3,
      establecimiento_nombre: "Local Principal",
      usuario_id: 2,
      usuario_nombre: "vendedor1",
    },
    {
      id: 3,
      fecha: "2024-01-16T16:45:00",
      metodo_pago: "BIZUM",
      total: 42.75,
      establecimiento_id: 1,
      establecimiento_nombre: "Sucursal Centro",
      usuario_id: 1,
      usuario_nombre: "admin1",
    },
    {
      id: 4,
      fecha: "2024-01-17T12:20:00",
      metodo_pago: "GOOGLE_PAY",
      total: 28.9,
      establecimiento_id: 2,
      establecimiento_nombre: "Sucursal Norte",
      usuario_id: 3,
      usuario_nombre: "vendedor2",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filtroMetodoPago, setFiltroMetodoPago] = useState("todos")
  const [filtroFecha, setFiltroFecha] = useState("todos")

  const filteredVentas = ventas.filter((venta) => {
    const matchesSearch =
      venta.establecimiento_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.id.toString().includes(searchTerm)

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

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalVentas = () => {
    return filteredVentas.reduce((sum, venta) => sum + venta.total, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Ventas</h1>
          <p className="text-muted-foreground">Historial y análisis de todas las ventas realizadas</p>
        </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Establecimiento</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVentas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell className="font-medium">#{venta.id}</TableCell>
                  <TableCell>{formatFecha(venta.fecha)}</TableCell>
                  <TableCell>{venta.establecimiento_nombre}</TableCell>
                  <TableCell>{venta.usuario_nombre}</TableCell>
                  <TableCell>
                    <Badge variant={getMetodoPagoBadgeVariant(venta.metodo_pago)}>{venta.metodo_pago}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">€{venta.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
