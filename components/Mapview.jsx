"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// dynamically import MapContainer components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
import L from "leaflet";

export default function MapView({ itinerary }) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    async function fetchCoords() {
      const allActivities = (itinerary || []).flatMap(
        (d) => d.activities || []
      );
      const uniquePlaces = Array.from(
        new Set(allActivities.map((a) => a.place).filter(Boolean))
      ).slice(0, 12);
      const results = [];

      for (const p of uniquePlaces) {
        try {
          const res = await fetch(
            `/api/geocode?place=${encodeURIComponent(p)}`
          );
          const json = await res.json();
          if (json?.lat && json?.lng)
            results.push({ place: p, lat: json.lat, lng: json.lng });
        } catch (e) {}
      }
      setPlaces(results);
    }
    fetchCoords();
  }, [itinerary]);

  if (!places.length) {
    return (
      <div className="map-container bg-white rounded p-4 text-sm text-slate-500">
        Map will appear here once places are geocoded.
      </div>
    );
  }

  const center = [places[0].lat, places[0].lng];

  return (
    <div className="map-container rounded overflow-hidden">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={new L.Icon.Default()}>
            <Popup>{p.place}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
