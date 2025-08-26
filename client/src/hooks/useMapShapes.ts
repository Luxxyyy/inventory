import { useCallback } from "react";
import {
  addMapShape,
  updateMapShape,
  deleteMapShape,
  getMapShapes,
} from "../api/mapShape";
import { ShapeDetails } from "../components/map/map_helpers";

export const useMapShapes = () => {
  const loadShapes = useCallback(async () => {
    return await getMapShapes();
  }, []);

  const saveShape = useCallback(async (layer: any, data: ShapeDetails, isEditing: boolean) => {
    const geojson = layer.toGeoJSON();
    const radius = "getRadius" in layer ? (layer as any).getRadius() : null;
    const type = geojson.geometry.type;
    const payload = { type, geojson, radius, ...data };

    let saved;
    if (isEditing) {
      saved = await updateMapShape((layer as any).dbId, payload);
    } else {
      saved = await addMapShape(
        type,
        geojson,
        radius,
        data.title,
        data.description,
        data.status,
        data.color
      );
    }
    (layer as any).dbId = saved.id;
    (layer as any).metadata = payload;
    return payload;
  }, []);

  const removeShapes = useCallback(async (ids: number[]) => {
    await Promise.all(ids.map((id) => deleteMapShape(id)));
  }, []);

  return { loadShapes, saveShape, removeShapes };
};
