import L from "leaflet";

const defaultDetails = {
  title: "",
  description: "",
  status: "",
  color: "",
};

export type ShapeDetails = typeof defaultDetails;

export const attachPopup = (
  layer: any,
  metadata: ShapeDetails,
  onEdit: (layer: any) => void
) => {
  layer.bindPopup(`
    <div>
      <strong>${metadata.title || "Untitled"}</strong><br/>
      ${metadata.description || ""}<br/>
      Status: ${metadata.status || "N/A"}<br/>
      <button class="popup-edit-btn">Edit</button>
    </div>
  `);

  layer.on("popupopen", () => {
    const btn = document.querySelector(".popup-edit-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        onEdit(layer);
      });
    }
  });
};
