"use client";
import { useForm } from "react-hook-form";

export default function TravelForm({ onSubmit }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      destination: "Paris, France",
      days: 3,
      budget: 800,
      style: "Balanced",
    },
  });

  function submit(data) {
    data.days = Number(data.days);
    data.budget = Number(data.budget);
    onSubmit && onSubmit(data);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white p-6 rounded-md shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Destination</label>
          <input
            {...register("destination")}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Days</label>
          <input
            type="number"
            {...register("days")}
            className="mt-1 p-2 border rounded w-full"
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Budget (approx)</label>
          <input
            type="number"
            {...register("budget")}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Style</label>
          <select
            {...register("style")}
            className="mt-1 p-2 border rounded w-full"
          >
            <option>Balanced</option>
            <option>Adventure</option>
            <option>Chill</option>
            <option>Budget</option>
            <option>Luxury</option>
            <option>Family</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded"
        >
          Generate Trip
        </button>
      </div>
    </form>
  );
}
