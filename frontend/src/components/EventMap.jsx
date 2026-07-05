/*import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function EventMap({ location }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    async function geocode() {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location + ", Kenya"
          )}`
        );

        const data = await response.json();

        if (data.length > 0) {
          setPosition([
            parseFloat(data[0].lat),
            parseFloat(data[0].lon),
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    geocode();
  }, [location]);

  if (!position) {
    return <p>Loading map...</p>;
  }

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "12px",
        marginTop: "15px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default EventMap;