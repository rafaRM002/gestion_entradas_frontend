"use client"

import { useState } from "react"

const SelectorPersonas = ({ personasDisponibles, setPersonas, selected }) => {
  const [selectedPerson, setSelectedPerson] = useState(selected)

  const handleSelect = (e) => {
    setSelectedPerson(e.target.value)
    setPersonas(e.target.value)
  }

  return (
    <fieldset aria-label="Selecciona número de personas" className="mt-4">
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
        {[1, 2, 3, 4].map((num) => {
          const isDisabled = num > personasDisponibles
          const isSelected = selectedPerson === String(num)

          const baseClasses =
            "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase sm:flex-1 sm:py-6 transition-all duration-150"
          const enabledClasses = "cursor-pointer bg-white text-gray-900 shadow-xs hover:bg-gray-50"
          const disabledClasses = "cursor-not-allowed bg-gray-50 text-gray-200"
          const borderClasses = isSelected ? "border-4 border-indigo-500" : "border-gray-300"

          return (
            <label
              key={num}
              className={`${baseClasses} ${isDisabled ? disabledClasses : enabledClasses} ${borderClasses}`}
            >
              <input
                type="radio"
                name="size-choice"
                value={num}
                className="sr-only"
                onChange={handleSelect}
                checked={isSelected}
                disabled={isDisabled}
              />
              <span>{num}</span>
              {isDisabled ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                >
                  <svg
                    className="absolute inset-0 size-full stroke-2 text-gray-200"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    stroke="currentColor"
                  >
                    <line x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
              ) : (
                <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true" />
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default SelectorPersonas
