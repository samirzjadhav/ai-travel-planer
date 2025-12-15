"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SavedPage() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("saved_itineraries");
    setSaved(raw ? JSON.parse(raw) : []);
  }, []);

  if (!saved.length) {
    return <div>No saved itineraries yet. Generate one and click Save!</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Saved Plans</h2>
      <ul className="space-y-4">
        {saved.map((s) => (
          <li key={s.id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">
                  {s.title || `Trip to ${s.destination}`}
                </div>
                <div className="text-sm text-slate-500">
                  {s.days} days · {s.costEstimate || "N/A"}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  className="px-3 py-1 border rounded"
                  href={`/itinerary/${s.id}`}
                >
                  Open
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
