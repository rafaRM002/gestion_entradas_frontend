"use client"

import { useState } from "react"
import { Search, Receipt, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function LineasVentaSection({ currentUser }) {
  const [lineasVenta, setLineasVenta] = useState([
    {
      id: 1,
      cantidad: 2,
      subtotal: 25.0,
      entrada_id: 1,
      entrada_nombre: "Entrada General",
      producto_id: 1,
      producto_nombre: "Hamburguesa Clásica",
      venta_id: 1,
      venta_fecha: "2024-01-15",
      venta_total: 35.5,
    },
    {
      id: 2,
      cantidad: 1,
      subtotal: 15.0,
      entrada_id: 2,
      entrada_nombre: "Entrada VIP",
      producto_id: 2,
      producto_nombre: "Pizza Margherita",
      venta_id: 1,
      venta_fecha: "2024-01-15",
      venta_total: 35.5,
    },
    {
      id: 3,
      cantidad: 3,
      subtotal: 10.5,
      entrada_id: 1,
      entrada_nombre: "Entrada General",
      producto_id: 3,
      producto_nombre: "Café Americano",
      venta_id: 2,
      venta_fecha: "2024-01-16",
      venta_total: 19.0,
    },
    {
      id: 4,
      cantidad: 2,
      subtotal: 9.0,
      entrada_id: 1,
      entrada_nombre: "Entrada General",
      producto_id: 4,
      producto_nombre: "Cappuccino",
      venta_id: 2,
      venta_fecha: "2024-01-16",
      venta_total: 19.0,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVenta, setSelectedVenta] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredLineasVenta = lineasVenta.filter(
    (linea) =>
      linea.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linea.entrada_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linea.venta_id.toString().includes(searchTerm),
  )

  const handleViewVenta = (ventaId) => {
    setSelectedVenta(ventaId)
    setIsDialogOpen(true)
  }

  const getLineasByVenta = (ventaId) => {
    return lineasVenta.filter((linea) => linea.venta_id === ventaId)
  }

  const getVentaInfo = (ventaId) => {
    const linea = lineasVenta.find((l) => l.venta_id === ventaId)
    return linea
      ? {
          fecha: linea.venta_fecha,
          total: linea.venta_total,
        }
      : null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Líneas de Venta</h1>
          <p className="text-muted-foreground">Detalle de todas las líneas de venta registradas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Líneas de Venta</CardTitle>
          <CardDescription>Cada línea representa un producto vendido en una venta específica</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por producto, entrada o venta..."
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
                  <TableCell className="font-medium">{linea.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={() => handleViewVenta(linea.venta_id)}
                    >
                      #{linea.venta_id}
                    </Button>
                  </TableCell>
                  <TableCell>{linea.producto_nombre}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{linea.entrada_nombre}</Badge>
                  </TableCell>
                  <TableCell>{linea.cantidad}</TableCell>
                  <TableCell>€{linea.subtotal.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewVenta(linea.venta_id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Detalle de Venta #{selectedVenta}
            </DialogTitle>
            <DialogDescription>
              {selectedVenta && getVentaInfo(selectedVenta) && (
                <>
                  Fecha: {getVentaInfo(selectedVenta)?.fecha} | Total: €{getVentaInfo(selectedVenta)?.total.toFixed(2)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedVenta && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLineasByVenta(selectedVenta).map((linea) => (
                    <TableRow key={linea.id}>
                      <TableCell className="font-medium">{linea.producto_nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{linea.entrada_nombre}</Badge>
                      </TableCell>
                      <TableCell>{linea.cantidad}</TableCell>
                      <TableCell>€{linea.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
