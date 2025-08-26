import { MapShape } from "../types/mapShape_type";

// GET all shapes
export async function getMapShapes(): Promise<MapShape[]> {
  const response = await fetch("/api/map-shapes");
  if (!response.ok) throw new Error("Failed to fetch shapes");
  return response.json();
}

// POST new shape
export async function addMapShape(
  type: string,
  geojson: any,
  radius: number | null,
  title: string,
  description: string,
  status: string,
  color: string
): Promise<MapShape> {
  const response = await fetch("/api/map-shapes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, geojson, radius, title, description, status, color }),
  });
  if (!response.ok) throw new Error("Failed to add shape");
  return response.json();
}

// PUT update shape
export async function updateMapShape(id: number, data: Partial<MapShape>): Promise<MapShape> {
  const response = await fetch(`/api/map-shapes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update shape");
  return response.json();
}

// DELETE shape
export async function deleteMapShape(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`/api/map-shapes/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete shape");
  return response.json();
}
