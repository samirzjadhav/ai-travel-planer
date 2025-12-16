"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ItineraryView from "../../../components/ItineraryView";

export default function ItineraryPage() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("saved_itineraries");
    if (!raw) return;
    const arr = JSON.parse(raw);
    const found = arr.find((x) => x.id === id);
    setItinerary(found?.itinerary || null);
  }, [id]);

  if (!itinerary) return <div>Loading itinerary...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        {itinerary.destination
          ? `Trip to ${itinerary.destination}`
          : "Itinerary"}
      </h2>
      <ItineraryView data={itinerary} />
    </div>
  );
}
