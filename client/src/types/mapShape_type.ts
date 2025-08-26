// Shape details
export interface ShapeDetails {
  title: string;
  description: string;
  status: string;
  color: string;
  size?: string;
}

// Shape on the map
export interface MapShape extends ShapeDetails {
  id: number;
  type: string;
  geojson: GeoJSON.Feature;
  radius: number | null;
}

// Log entry for pipe size history
export interface PipeSizeLog {
  id: number;
  shapeId: number;
  size: string;
  remarks: string;
  createdAt: string; // ISO timestamp
}
