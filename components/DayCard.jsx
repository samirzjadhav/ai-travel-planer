export default function DayCard({ day }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm mb-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">
          Day {day.day}
          {day.title ? ` — ${day.title}` : ""}
        </h4>
        <div className="text-xs text-slate-500">
          Activities:{" "}
          {Array.isArray(day.activities) ? day.activities.length : 0}
        </div>
      </div>

      <ul className="mt-3 space-y-2 text-sm">
        {Array.isArray(day.activities) &&
          day.activities.map((act, idx) => (
            <li key={idx} className="border-l-2 pl-3">
              <div className="font-medium">
                {act.time || ""} {act.place ? `— ${act.place}` : ""}
              </div>
              <div className="text-slate-600">{act.description}</div>
              {act.estimated_cost && (
                <div className="text-xs text-slate-700 mt-1">
                  Cost: {act.estimated_cost}
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
