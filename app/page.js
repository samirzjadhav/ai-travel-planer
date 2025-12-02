import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold !mb-4">AI Travel Planner</h1>
      <p className="mb-6 max-w-xl text-center">
        Generate a day-by-day itinerary using Ai. Try a simple or create your
        custom plan.
      </p>
      <div className="flex gap-4">
        <Link
          href="/generate"
          className="!px-6 py-3 !bg-sky-600 text-white rounded-lg shadow hover:opacity-90 "
        >
          Generate Plan
        </Link>
      </div>
    </main>
  );
}
