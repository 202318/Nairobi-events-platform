import { useEffect, useRef, useState } from "react";

function EventMap({ location }) {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState("");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!location || !mapRef.current) return;

    const initMap = () => {
      if (!window.google?.maps || !mapRef.current) return;

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: `${location}, Nairobi, Kenya` }, (results, status) => {
        if (status !== "OK" || !results[0]) {
          setMapError("Unable to load the map for this location.");
          return;
        }

        const coords = results[0].geometry.location;
        const map = new window.google.maps.Map(mapRef.current, {
          center: coords,
          zoom: 15,
        });

        new window.google.maps.Marker({ position: coords, map });
      });
    };

    if (!apiKey) {
      setMapError("Google Maps is not configured for this app.");
      return;
    }

    if (window.google?.maps) {
      initMap();
      return;
    }

    const existingScript = document.querySelector('script[data-google-maps="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", initMap, { once: true });
      existingScript.addEventListener("error", () => setMapError("Unable to load Google Maps."), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");
    script.onload = initMap;
    script.onerror = () => setMapError("Unable to load Google Maps.");
    document.head.appendChild(script);
  }, [location, apiKey]);

  return (
    <div style={{ width: "100%", marginTop: "16px" }}>
      {mapError ? (
        <p style={{ padding: "12px", borderRadius: "10px", background: "#f3f4f6" }}>
          {mapError}
        </p>
      ) : (
        <div
          ref={mapRef}
          style={{ width: "100%", height: "220px", borderRadius: "14px" }}
        />
      )}
    </div>
  );
}

export default EventMap;