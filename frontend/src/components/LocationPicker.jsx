import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

function MapClickHandler({ setPosition, onLocationChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      onLocationChange({
        location: "",
        latitude: lat,
        longitude: lng,
      });
    },
  });

  return null;
}

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
}

function LocationPicker({ value, latitude, longitude, onSelect }) {

  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [position, setPosition] = useState([
    latitude || -1.286389,
    longitude || 36.817223,
]);

  useEffect(() => {
  if (query.length < 3) {
    setResults([]);
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", Nairobi, Kenya"
        )}`
      );

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log(err);
    }
  }, 500);

  return () => clearTimeout(timeout);
}, [query]);

    function selectPlace(place) {
    const lat = Number(place.lat);
    const lon = Number(place.lon);

    setQuery(place.display_name);
    setPosition([lat, lon]);
    setResults([]);

    onSelect({
        location: place.display_name,
        latitude: lat,
        longitude: lon,
    });
    }

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-input"
        placeholder="Search location..."
      />

      {results.length > 0 && (
  <div
    style={{
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      maxHeight: "180px",
      overflowY: "auto",
      marginTop: "5px",
    }}
  >
    {results.map((place) => (
      <div
        key={place.place_id}
        onClick={() => selectPlace(place)}
        style={{
          padding: "10px",
          cursor: "pointer",
          borderBottom: "1px solid #eee",
        }}
      >
        📍 {place.display_name}
      </div>
    ))}
  </div>
)}

      <div style={{ marginTop: "15px" }}>
       <MapContainer
        center={position}
        zoom={13}
        style={{
        height: "300px",
        width: "100%",
        borderRadius: "12px",
  }}
>
  <ChangeView center={position} />

 <MapClickHandler
    setPosition={setPosition}
    onLocationChange={onSelect}
/>

  <TileLayer
    attribution="© OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <Marker position={position} />
</MapContainer>

<p>
  <strong>Latitude:</strong> {position[0].toFixed(6)}
</p>

<p>
  <strong>Longitude:</strong> {position[1].toFixed(6)}
</p>
      </div>
    </>
  );
}

export default LocationPicker;