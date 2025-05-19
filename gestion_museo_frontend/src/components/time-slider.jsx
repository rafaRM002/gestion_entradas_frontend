"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Clock, Sun, Sunrise, Sunset, Moon } from "lucide-react"

export default function TimeSlider({ id, hora, setHora, disponible, horaPasada }) {
  const [hour, setHour] = useState(hora)
  const [minute, setMinute] = useState(0)
  const [timeOfDay, setTimeOfDay] = useState("day")

  const handleSliderChange = (value) => {
    const totalHours = value[0]
    const hours = Math.floor(totalHours)
    const mins = Math.round((totalHours - hours) * 60)
    setHour(hours)
    setMinute(mins)
  }

  useEffect(() => {
    if (hour >= 5 && hour < 8) {
      setTimeOfDay("dawn")
    } else if (hour >= 8 && hour < 18) {
      setTimeOfDay("day")
    } else if (hour >= 18 && hour < 21) {
      setTimeOfDay("dusk")
    } else {
      setTimeOfDay("night")
    }
  }, [hour])

  const formatTime = () => {
    const formattedHour = hour.toString().padStart(2, "0")
    const formattedMinute = minute.toString().padStart(2, "0")
    return `${formattedHour}:${formattedMinute}`
  }

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case "dawn":
        return <Sunrise className="h-8 w-8 text-amber-500" />
      case "day":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "dusk":
        return <Sunset className="h-8 w-8 text-orange-500" />
      case "night":
        return <Moon className="h-8 w-8 text-white" />
      default:
        return <Clock className="h-8 w-8 text-gray-700" />
    }
  }

  const getTimeStyles = () => {
    switch (timeOfDay) {
      case "dawn":
        return "bg-gradient-to-br from-amber-100 to-rose-100 text-amber-900"
      case "day":
        return "bg-gradient-to-br from-sky-100 to-blue-100 text-sky-900"
      case "dusk":
        return "bg-gradient-to-br from-orange-100 to-rose-100 text-orange-900"
      case "night":
        return "bg-gradient-to-br from-indigo-900 to-purple-900 text-white"
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
    }
  }

  const comprobarDisponibilidad = () => {
    if (disponible === false) return <div className="text-red-500 font-semibold">No Disponible</div>
    else if (horaPasada === true) return <div className="text-red-500 font-semibold">Hora pasada</div>
  }

  return (
    <div
      className={`w-full max-w-md mt-6 mx-auto p-6 rounded-xl shadow-lg transition-colors duration-500 ${getTimeStyles()}`}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Línea con icono, hora y AM/PM */}
        <div className="flex items-center gap-3">
          {getTimeIcon()}
          <div className="text-3xl font-bold tracking-tight">{formatTime()}</div>
          <div className="text-sm font-medium opacity-80">{hour < 12 ? "AM" : "PM"}</div>
        </div>

        {/* Mostrar disponibilidad */}
        {comprobarDisponibilidad()}

        {/* Slider */}
        <div className="w-full px-2">
          <Slider
            value={[hour]}
            max={22}
            step={1}
            onValueChange={handleSliderChange}
            onPointerUp={() => setHora(hour)}
            className="my-4"
          />
          <div className="flex justify-between text-xs font-medium opacity-70">
            <span>08:00</span>
            <span>15:00</span>
            <span>22:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}
