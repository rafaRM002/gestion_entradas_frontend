"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"

const currentUser = {
  id: 1,
  username: "admin",
  rol: "ADMIN", // ADMIN, VENDEDOR, SUPERADMIN
  comercio_id: 1,
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("usuarios")
  const [selectedComercio, setSelectedComercio] = useState(null)
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          currentUser={currentUser}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setSelectedComercio={setSelectedComercio}
          setSelectedEstablecimiento={setSelectedEstablecimiento}
        />
        <main className="flex-1 p-6">
          <DashboardContent
            currentUser={currentUser}
            activeSection={activeSection}
            selectedComercio={selectedComercio}
            selectedEstablecimiento={selectedEstablecimiento}
            setSelectedComercio={setSelectedComercio}
            setSelectedEstablecimiento={setSelectedEstablecimiento}
          />
        </main>
      </div>
    </SidebarProvider>
  )
}
