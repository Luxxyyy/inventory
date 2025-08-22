import http from './http'; // your axios instance

export type MapShape = {
  id?: number;
  type: string;
  geojson: GeoJSON.Feature;
  radius?: number | null;
};

export type MapShapesResponse = MapShape[];

export async function getMapShapes(): Promise<MapShapesResponse> {
  const { data } = await http.get('/map-shapes');
  return data;
}

export async function addMapShape(
  type: string,
  geojson: GeoJSON.Feature,
  radius?: number | null
) {
  const { data } = await http.post('/map-shapes', { type, geojson, radius });
  return data;
}
