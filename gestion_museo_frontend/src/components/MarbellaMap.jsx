import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css" // Estilo de Leaflet

const MarbellaMap = () => {
  // Coordenadas de Marbella
  const position = [36.507, -4.882] // Marbella

  return (
    <div className="my-16">
      <h2 className="text-5xl font-semibold text-center text-blue-900">¿Dónde nos situamos?</h2>
      <div className="mt-8">
        <MapContainer center={position} zoom={50} style={{ height: "400px", width: "100%" }}>
          {/* Mapa de tipo 'tiles' (cuadrícula) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marcador para Marbella */}
          <Marker position={position}>
            <Popup>Estamos situados en Marbella</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

export default MarbellaMap
