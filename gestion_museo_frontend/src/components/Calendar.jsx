"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { API_URL } from "../utilities/apirest"
import DayDetailsModal from "./day-details-modal"

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const url = API_URL + "api/obtenerReservasUsuario"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .get(url, { headers })
      .then((response) => {
        const colores = ["bg-red-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-blue-200", "bg-pink-200"]

        const eventosTransformados = response.data.map((reserva, index) => ({
          id: reserva.id.toString(),
          title: reserva.publicacion.titulo,
          date: new Date(reserva.fecha_reserva),
          color: colores[index % colores.length],
        }))

        setEvents(eventosTransformados)

        if (eventosTransformados.length > 0) {
          setCurrentMonth(eventosTransformados[0].date)
        }
      })
      .catch((error) => {
        console.error("Error al cargar los eventos:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getMonthData = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    let firstDayOfWeek = firstDay.getDay() - 1
    if (firstDayOfWeek === -1) firstDayOfWeek = 6

    const daysFromPrevMonth = firstDayOfWeek
    const totalDays = 42
    const calendarDays = []

    const prevMonth = new Date(year, month - 1)
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      calendarDays.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i),
        isCurrentMonth: false,
      })
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    const nextMonth = new Date(year, month + 1)
    const remainingDays = totalDays - calendarDays.length

    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        isCurrentMonth: false,
      })
    }

    const weeks = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7))
    }

    return weeks
  }

  const weeks = getMonthData(currentMonth)

  const formatMonth = (date) => {
    return date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleToday = () => {
    setCurrentMonth(new Date())
  }

  const handleCancelReserva = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId)
    setEvents(updatedEvents)

    if (selectedDay) {
      const updatedDayEvents = selectedDay.events.filter((event) => event.id !== eventId)
      setSelectedDay({ ...selectedDay, events: updatedDayEvents })
    }
  }

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handleDayClick = (day, events) => {
    setSelectedDay({
      date: day.date,
      events: events,
    })
    setIsModalOpen(true)
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full mt-5 mb-15 mx-auto bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold capitalize">{formatMonth(currentMonth)}</h2>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg overflow-hidden">
                <Button variant="ghost" size="sm" className="rounded-none border-r h-10" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none h-10" onClick={handleToday}>
                  Hoy
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none border-l h-10" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2 text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-6 h-[calc(100vh-12rem)] min-h-[600px] scroll-y-no-scrollbar overflow-y-auto">
            {weeks.flat().map((day, index) => {
              const dayEvents = getEventsForDate(day.date)

              return (
                <div
                  key={index}
                  className={`border-b border-r p-1 relative 
                    ${!day.isCurrentMonth ? "text-gray-400" : ""}
                    ${isToday(day.date) ? "bg-blue-100" : ""}
                    cursor-pointer hover:bg-gray-50`}
                  onClick={() => handleDayClick(day, dayEvents)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <span className="p-1 font-medium text-sm">{day.date.getDate()}</span>
                    </div>
                    <div className="flex-1 overflow-y-hidden mt-1 space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs truncate px-1 py-0.5 rounded ${event.color} text-black`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {selectedDay && (
        <DayDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={selectedDay}
          onCancel={handleCancelReserva}
        />
      )}
    </>
  )
}
