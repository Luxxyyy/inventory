export type PipeLog = {
  id: number;
  shape_id: number;
  size: string;
  remarks: string | null;
  created_at: string;
};

export async function getPipeLogs(shapeId: number): Promise<PipeLog[]> {
  const response = await fetch(`/api/pipe-logs/${shapeId}/logs`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch pipe logs");
  }
  return response.json();
}
