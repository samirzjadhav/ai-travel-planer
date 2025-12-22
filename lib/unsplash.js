// lib/unsplash.js
import fetch from "node-fetch";

export async function fetchImageForPlace(place) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const q = encodeURIComponent(place);
  const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=1&client_id=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const first = json.results?.[0];
  return first
    ? { url: first.urls.small, alt: first.alt_description || place }
    : null;
}
