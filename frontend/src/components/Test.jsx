import { MapContainer, TileLayer } from "react-leaflet";

function Test() {
  return (
    <MapContainer
      center={[-1.286389, 36.817223]}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default Test;