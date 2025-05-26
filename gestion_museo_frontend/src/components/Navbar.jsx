"use client"

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Example({ userRole, userInfo, selectedEstablecimiento, isPreview = false }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { establecimientoId } = useParams()

  // Construir rutas según si es preview o no
  const getNavHref = (page) => {
    if (isPreview) {
      const basePreviewPath = `/preview/${establecimientoId || "1"}`
      switch (page) {
        case "Inicio":
          return basePreviewPath
        case "Entradas":
          return `${basePreviewPath}/entradas`
        case "Productos":
          return `${basePreviewPath}/productos`
        case "Tickets":
          return `${basePreviewPath}/tickets`
        case "Carrito":
          return `${basePreviewPath}/carrito`
        default:
          return basePreviewPath
      }
    } else {
      switch (page) {
        case "Inicio":
          return "/home"
        case "Entradas":
          return "/entradas"
        case "Productos":
          return "/productos"
        case "Tickets":
          return "/tickets"
        case "Carrito":
          return "/carrito"
        default:
          return "/home"
      }
    }
  }

  const navigation = [
    { name: "Inicio", href: getNavHref("Inicio") },
    { name: "Entradas", href: getNavHref("Entradas") },
    { name: "Productos", href: getNavHref("Productos") },
    { name: "Tickets", href: getNavHref("Tickets") },
    { name: "Carrito", href: getNavHref("Carrito") },
  ].map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }))

  // Obtener nombre del establecimiento/comercio
  const comercioNombre = selectedEstablecimiento?.comercio?.nombre || userInfo?.comercio?.nombre || "COMERCIO"

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/")
  }

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <span className="text-xl font-semibold text-gray-800">{comercioNombre}</span>
            </div>

            <div className="hidden sm:flex sm:items-center sm:justify-center flex-1">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <div className="size-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {userInfo?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden">
                {!isPreview && (
                  <MenuItem>
                    <a href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mi Perfil
                    </a>
                  </MenuItem>
                )}
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                "block rounded-md px-3 py-2 text-base font-medium transition-colors",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
