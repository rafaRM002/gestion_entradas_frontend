"use client"

import { UsuariosSection } from "./sectionsDashboard/usuarios-section"
import { ComerciosSection } from "./sectionsDashboard/comercios-section"
import { EstablecimientosSection } from "./sectionsDashboard/establecimientos-section"
import { ProductosSection } from "./sectionsDashboard/productos-section"
import { ExtrasSection } from "./sectionsDashboard/extras-section"
import { LineasVentaSection } from "./sectionsDashboard/lineas-venta-section"
import { VentasSection } from "./sectionsDashboard/ventas-section"

export function DashboardContent({
  currentUser,
  activeSection,
  selectedComercio,
  selectedEstablecimiento,
  setSelectedComercio,
  setSelectedEstablecimiento,
  onPreviewEstablecimiento,
  comercios = [],
  onComercioSelect,
}) {
  const renderSection = () => {
    switch (activeSection) {
      case "usuarios":
        return <UsuariosSection currentUser={currentUser} />
      case "comercios":
        return (
          <ComerciosSection
            currentUser={currentUser}
            selectedComercio={selectedComercio}
            setSelectedComercio={setSelectedComercio}
            comercios={comercios}
            onComercioSelect={onComercioSelect}
          />
        )
      case "establecimientos":
        return (
          <EstablecimientosSection
            currentUser={currentUser}
            selectedComercio={selectedComercio}
            selectedEstablecimiento={selectedEstablecimiento}
            setSelectedEstablecimiento={setSelectedEstablecimiento}
            onPreviewEstablecimiento={onPreviewEstablecimiento}
          />
        )
      case "productos":
        return <ProductosSection currentUser={currentUser} selectedEstablecimiento={selectedEstablecimiento} />
      case "extras":
        return <ExtrasSection currentUser={currentUser} selectedEstablecimiento={selectedEstablecimiento} />
      case "lineas-venta":
        return <LineasVentaSection currentUser={currentUser} />
      case "ventas":
        return <VentasSection currentUser={currentUser} />
      default:
        return <UsuariosSection currentUser={currentUser} />
    }
  }

  return <div className="space-y-6">{renderSection()}</div>
}
