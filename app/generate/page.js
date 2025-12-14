"use client";
import { useState } from "react";
import TravelForm from "@/components/TravelForm";
import ItineraryView from "@/components/ItineraryView";

export default function GeneratePage() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate(values) {
    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error || "Something went wrong");
      } else {
        setItinerary(json.itinerary);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Create a Trip</h2>
      <TravelForm onSubmit={handleGenerate} />

      {loading && (
        <div className="mt-6">
          Generating plan -- this may take a few seconds...
        </div>
      )}
      {error && <div className="mt-6 text-red-600">{error}</div>}
      {itinerary && <ItineraryView data={itinerary} />}
    </div>
  );
}
