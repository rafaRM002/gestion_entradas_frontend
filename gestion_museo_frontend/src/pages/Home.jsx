"use client"

import { useNavigate } from "react-router-dom"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
export default function Home() {
  const navigate = useNavigate()

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
         
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Museo Nacional de Arte</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Descubre nuestra colección permanente y exposiciones temporales
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/entradas")}
              className="px-8 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Comprar Entradas
            </button>
            <button
              onClick={() => navigate("/productos")}
              className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Tienda del Museo
            </button>
          </div>
        </div>
      </section>

      {/* Exposiciones Destacadas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">Exposiciones Destacadas</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Exposición 1 */}
            <div className="group">
              <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Exposición de Arte Moderno"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Arte Moderno: Perspectivas</h3>
              <p className="mt-2 text-gray-600">Hasta el 15 de Diciembre, 2025</p>
            </div>

            {/* Exposición 2 */}
            <div className="group">
              <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1577083288073-40892c0860a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Esculturas Contemporáneas"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Esculturas Contemporáneas</h3>
              <p className="mt-2 text-gray-600">Hasta el 30 de Octubre, 2025</p>
            </div>

            {/* Exposición 3 */}
            <div className="group">
              <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Fotografía Documental"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Fotografía Documental</h3>
              <p className="mt-2 text-gray-600">Hasta el 20 de Noviembre, 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Información del Museo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Visita Nuestro Museo</h2>
              <p className="text-gray-600 mb-6">
                El Museo Nacional de Arte alberga una de las colecciones más importantes del país, con obras que abarcan
                desde el siglo XV hasta la actualidad. Nuestras instalaciones ofrecen una experiencia única para los
                amantes del arte y la cultura.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 font-medium">Horario</p>
                    <p className="text-gray-600">Martes a Domingo: 10:00 - 20:00h</p>
                    <p className="text-gray-600">Lunes: Cerrado</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 font-medium">Ubicación</p>
                    <p className="text-gray-600">Calle del Arte, 123</p>
                    <p className="text-gray-600">28001 Madrid, España</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Interior del museo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
