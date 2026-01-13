"use client";
import { useForm } from "react-hook-form";

export default function TravelForm({ onSubmit, loading = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      destination: "Paris, France",
      days: 3,
      budget: 800,
      style: "Balanced",
    },
  });

  function submit(data) {
    const payload = {
      ...data,
      days: Number(data.days),
      budget: Number(data.budget),
    };

    onSubmit?.(payload);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white p-6 rounded-md shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium">Destination</label>
          <input
            {...register("destination", {
              required: "Destination is required",
            })}
            className="mt-1 p-2 border rounded w-full"
          />
          {errors.destination && (
            <p className="text-red-500 text-xs mt-1">
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Days */}
        <div>
          <label className="block text-sm font-medium">Days</label>
          <input
            type="number"
            min={1}
            {...register("days", { min: 1 })}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium">Budget (approx)</label>
          <input
            type="number"
            min={0}
            {...register("budget")}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Style */}
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
          disabled={loading}
          className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Trip"}
        </button>
      </div>
    </form>
  );
}
