"use client"

import { Building2, Users, Store, Package, Plus, Receipt, Settings, LogOut, ShoppingCart } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AppSidebar({
  currentUser,
  activeSection,
  setActiveSection,
  setSelectedComercio,
  setSelectedEstablecimiento,
}) {
  const isSuperAdmin = currentUser.rol === "SUPERADMIN"
  const isAdmin = currentUser.rol === "ADMIN"

  const handleSectionChange = (section) => {
    setActiveSection(section)
    setSelectedComercio(null)
    setSelectedEstablecimiento(null)
  }

  const menuItems = [
    {
      title: "Usuarios",
      icon: Users,
      key: "usuarios",
      show: isSuperAdmin || isAdmin,
    },
    {
      title: "Comercios",
      icon: Building2,
      key: "comercios",
      show: isSuperAdmin,
    },
    {
      title: "Establecimientos",
      icon: Store,
      key: "establecimientos",
      show: true,
    },
    {
      title: "Productos",
      icon: Package,
      key: "productos",
      show: true,
    },
    {
      title: "Extras",
      icon: Plus,
      key: "extras",
      show: true,
    },
    {
      title: "Líneas de Venta",
      icon: Receipt,
      key: "lineas-venta",
      show: true,
    },
    {
      title: "Ventas",
      icon: ShoppingCart,
      key: "ventas",
      show: true,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Dashboard POS</h2>
            <p className="text-sm text-muted-foreground">{currentUser.rol}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((item) => item.show)
                .map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      onClick={() => handleSectionChange(item.key)}
                      isActive={activeSection === item.key}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.username}</p>
            <p className="text-xs text-muted-foreground">{currentUser.rol}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Config
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
