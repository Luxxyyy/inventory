export async function getMapShapes() {
  const response = await fetch("/api/map-shapes");
  if (!response.ok) throw new Error("Failed to fetch shapes");
  return response.json();
}

export async function addMapShape(
  type: string,
  geojson: any,
  radius: number | null,
  title: string,
  description: string,
  status: string,
  color: string,
  specs: any
) {
  const response = await fetch("/api/map-shapes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, geojson, radius, title, description, status, color, specs }),
  });
  if (!response.ok) throw new Error("Failed to add shape");
  return response.json();
}

export async function updateMapShape(id: number, data: any) {
  const response = await fetch(`/api/map-shapes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update shape");
  return response.json();
}

export async function deleteMapShape(id: number) {
  const response = await fetch(`/api/map-shapes/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete shape");
  return response.json();
}
