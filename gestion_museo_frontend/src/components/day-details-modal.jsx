"use client"
import { useState } from "react"
import { Calendar, Clock, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { API_URL } from "../utilities/apirest"

export default function DayDetailsModal({ isOpen, onClose, day, onCancel }) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!day) return null

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCancelarReserva = async (eventId) => {
    console.log("Cancelando reserva con ID:", eventId)
    try {
      setIsLoading(true)
      const url = API_URL + "api/reservas/" + eventId
      const token = localStorage.getItem("authToken")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await axios.delete(url, { headers })
      if (onCancel) onCancel(eventId)
      setConfirmDialogOpen(false)
    } catch (error) {
      console.error("Error al cancelar la reserva:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openConfirmDialog = (eventId) => {
    setSelectedEventId(eventId)
    setConfirmDialogOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">{formatDate(day.date)}</DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-6 py-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {day.events.length} {day.events.length === 1 ? "evento" : "eventos"}
            </Badge>
          </div>

          <ScrollArea className="p-6 max-h-[60vh]">
            {day.events.length > 0 ? (
              <div className="space-y-4">
                {day.events.map((event) => (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="font-medium text-lg mb-2">{event.title}</h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatTime(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openConfirmDialog(event.id)}
                          className="mt-2 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-1xl font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                        >
                          Cancelar Reserva
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay eventos programados para este día</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar cancelación
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              ¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleCancelarReserva(selectedEventId)} disabled={isLoading}>
              {isLoading ? "Cancelando..." : "Sí, cancelar reserva"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
