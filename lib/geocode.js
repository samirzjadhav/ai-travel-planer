import fetch from "node-fetch";

export async function geocodePlace(place) {
  const q = encodeURIComponent(place);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ai-travel-planner-example/1.0" },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json || !json[0]) return null;
  return { lat: Number(json[0].lat), lng: Number(json[0].lon) };
}
