"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { API_URL } from "../utilities/apirest"
import { useEffect } from "react"
import TimeSlider from "../components/time-slider"
import SelectorPersonas from "../components/person-chooser"
import axios from "axios"
export default function Mostrador({ cart, setCart }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [hora, setHora] = useState(15)
  const [disponibilidadHora, setDisponibilidadHora] = useState(true)
  const [personas, setPersonas] = useState(1)
  const [personasDisponibles, setPersonasDisponibles] = useState(4)
  const [loading, setLoading] = useState(true)
  const [añadido, setAñadido] = useState(false)
  const [precioTotal, setPrecioTotal] = useState()
  const [horaPasada, setHoraPasada] = useState(false)

  if (!location.state || !location.state.elemento) return null

  const { elemento } = location.state
  useEffect(() => {
    console.log("Personas seleccionadas: ", personas)
  }, [personas])

  useEffect(() => {
    const existeEnCarrito = cart.some((item) => {
      return item.id === elemento.id
    })
    if (existeEnCarrito) setAñadido(true)
    else setAñadido(false)
  }, [cart, elemento, hora])

  useEffect(() => {
    const url = API_URL + "api/capacidadDisponible"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    axios
      .post(url, { idPublicacion: elemento.id }, { headers })
      .then((response) => {
        setPersonasDisponibles(response.data.max_reservables)
      })
      .catch((error) => {
        console.error("Error al cargar los informativos:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [personasDisponibles])

  useEffect(() => {
    setPrecioTotal(elemento.precio * personas)
  }, [personas])

  useEffect(() => {
    axios
      .get(API_URL + "api/horaFecha")
      .then((response) => {
        if (response.data.fecha == elemento.fecha_evento.split(" ")[0]) {
          const horaEntera = Number.parseInt(response.data.hora.split(":")[0], 10)
          if (horaEntera < hora) setHoraPasada(false)
          else setHoraPasada(true)
        } else setHoraPasada(false)
      })
      .catch((error) => {
        console.error("Error al cargar los informativos:", error)
      })
  }, [disponibilidadHora, hora])

  useEffect(() => {
    const url = API_URL + "api/disponibilidadReserva"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    axios
      .post(url, { idPublicacion: elemento.id, horaReserva: hora + ":00" }, { headers })
      .then((response) => {
        setDisponibilidadHora(response.data.disponible)
      })
      .catch((error) => {
        console.error("Error al cargar los informativos:", error)
      })
  }, [hora, disponibilidadHora])

  useEffect(() => {
    if (!location.state || !location.state.elemento) navigate("/notFound")
  }, [location.state, navigate])

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (disponibilidadHora) {
      const nuevoElemento = {
        ...elemento,
        horaReserva: hora,
        precio: precioTotal,
        personas: Number.parseInt(personas),
      }
      setCart((prev) => [...prev, nuevoElemento])
      setAñadido(true)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("es-ES", options)
  }

  const imagenes = elemento.imagen.split(";")
  return (
    <div class="bg-white">
      <div class="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" class="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li>
              <div class="flex items-center">
                <p href="" class="mr-2 text-sm font-medium text-gray-900">
                  Publicaciones
                </p>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <a href={"/" + elemento.tipo + "s"} class="mr-2 text-sm font-medium text-gray-900 capitalize">
                  {elemento.tipo + "s"}
                </a>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>

            <li class="text-sm">
              <p href="#" aria-current="page" class="font-medium text-gray-500 hover:text-gray-600">
                {elemento.titulo}
              </p>
            </li>
          </ol>
        </nav>

        <div class="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <img
            src={API_URL + "storage/photos/" + imagenes[0] || "/placeholder.svg"}
            alt="Two each of gray, white, and black shirts laying flat."
            class="hidden size-full rounded-lg object-cover lg:block"
          />
          <div class="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <img
              src={API_URL + "storage/photos/" + imagenes[1] || "/placeholder.svg"}
              alt="Model wearing plain black basic tee."
              class="aspect-3/2 w-full rounded-lg object-cover"
            />
            <img
              src={API_URL + "storage/photos/" + imagenes[2] || "/placeholder.svg"}
              alt="Model wearing plain gray basic tee."
              class="aspect-3/2 w-full rounded-lg object-cover"
            />
          </div>
          <img
            src={API_URL + "storage/photos/" + imagenes[3] || "/placeholder.svg"}
            alt="Model wearing plain white basic tee."
            class="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto"
          />
        </div>

        <div class="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{elemento.titulo}</h1>
          </div>
          {/*Funcion de Carga*/}
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <div class="mt-4 lg:row-span-3 lg:mt-0">
              {elemento.tipo !== "informativo" ? (
                <form class="mt-5" onSubmit={handleAddToCart}>
                  <h2 class="sr-only">Product information</h2>
                  <p class="text-3xl tracking-tight text-gray-900">${precioTotal}</p>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Momento del Día</h3>
                    {/*Slider*/}
                    <TimeSlider
                      id={elemento.id}
                      setHora={setHora}
                      hora={hora}
                      disponible={disponibilidadHora}
                      horaPasada={horaPasada}
                    />
                  </div>

                  <div class="mt-10">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-900">Personas</h3>
                    </div>
                    {/*Selector de Personas*/}
                    <SelectorPersonas personasDisponibles={personasDisponibles} setPersonas={setPersonas} />
                  </div>

                  {/*Añadido al carrito*/}
                  {añadido && <p className="mt-4 text-green-600 font-medium text-center">Añadido al carrito</p>}

                  {/*Comprobaciones antes de compra*/}
                  {disponibilidadHora && personasDisponibles > 0 && !añadido && !horaPasada ? (
                    <button
                      type="submit"
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                    >
                      Añadir al Carrito
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-300 px-8 py-3 text-base font-medium text-white cursor-not-allowed"
                    >
                      Añadir al Carrito
                    </button>
                  )}
                </form>
              ) : (
                <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 font-medium">Este producto no está disponible para alquiler</p>
                  <p className="text-gray-500 text-sm mt-2">Este artículo es de tipo informativo</p>
                </div>
              )}
            </div>
          )}

          <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            <div>
              <h3 class="sr-only">Description</h3>

              <div class="space-y-6">
                <p class="text-base text-gray-900">{elemento.descripcion}</p>
              </div>
              <div class="space-y-6 mt-4">
                <p class="text-base text-gray-500">{formatDate(elemento.fecha_evento)}</p>
              </div>
            </div>

            <div class="mt-10">
              <h3 class="text-sm font-medium text-gray-900">Highlights</h3>

              <div class="mt-4">
                <ul role="list" class="list-disc space-y-2 pl-4 text-sm">
                  <li class="text-gray-400 flex items-center">
                    <i class="fas fa-sun text-yellow-500 mr-2"></i>
                    <span class="text-gray-600">Te lo Pasarás de Lujo</span>
                  </li>
                  <li class="text-gray-400 flex items-center">
                    <i class="fas fa-money-check-alt text-green-500 mr-2"></i>
                    <span class="text-gray-600">100% Reembolsable</span>
                  </li>
                  <li class="text-gray-400 flex items-center">
                    <i class="fas fa-shield-alt text-blue-500 mr-2"></i>
                    <span class="text-gray-600">Portal de compra 100% seguro</span>
                  </li>
                  <li class="text-gray-400 flex items-center">
                    <i class="fas fa-times-circle text-red-500 mr-2"></i>
                    <span class="text-gray-600">Cancela cuando Quieras</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-10">
              <h2 class="text-sm font-medium text-gray-900">Detalles</h2>

              <div class="mt-4 space-y-6">
                <p class="text-sm text-gray-600">
                  Disfruta de tu día en la playa con nuestros artículos de alquiler, pensados para ofrecerte la máxima
                  comodidad y funcionalidad. Todos nuestros productos están cuidadosamente seleccionados para adaptarse
                  a tus necesidades, ya sea que busques relajarte bajo el sol, practicar actividades acuáticas o
                  disfrutar de un paseo junto al mar. Reserva el tuyo con antelación y asegúrate de tener lo mejor para
                  tu experiencia costera.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
