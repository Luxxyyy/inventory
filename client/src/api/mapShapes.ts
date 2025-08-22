const API_BASE_URL = "http://localhost:8080/api/map-shapes";

export async function getMapShapes() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch shapes");
  return response.json();
}

export async function addMapShape(type: string, geojson: any, radius: number | null) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, geojson, radius }),
  });
  if (!response.ok) throw new Error("Failed to add shape");
  return response.json();
}

export async function deleteMapShape(id: number) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete shape");
  return response.json();
}
