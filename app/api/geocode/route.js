// app/api/geocode/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const place = searchParams.get("place");
    if (!place)
      return NextResponse.json({ error: "Missing place" }, { status: 400 });

    const q = encodeURIComponent(place);
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "ai-travel-planner-example/1.0" },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Geocode failed" }, { status: 500 });
    const json = await res.json();
    if (!json || !json[0])
      return NextResponse.json({ error: "No result" }, { status: 404 });

    const r = json[0];
    return NextResponse.json({ lat: Number(r.lat), lng: Number(r.lon) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
