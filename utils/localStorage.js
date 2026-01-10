export function saveItineraryToLocal(item) {
  const raw = localStorage.getItem("saved_itineraries");
  const arr = raw ? JSON.parse(raw) : [];
  arr.unshift(item);
  localStorage.setItem("saved_itineraries", JSON.stringify(arr));
  return item.id;
}
