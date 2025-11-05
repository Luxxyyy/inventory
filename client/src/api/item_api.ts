import http from "./http";

export type ItemResponse = {
  id: number;
  item_name: string;
  barcode?: string | null;
  item_image?: string | null;
  category_id: number;
  date_added: string;
};

//Fetch all items
export async function getItems(): Promise<ItemResponse[]> {
  const { data } = await http.get<ItemResponse[]>("/items");
  return data;
}

//Create new item
export async function addItem(
  item_name: string,
  barcode: string | null,
  category_id: number,
  item_image?: string | null
) {
  const { data } = await http.post("/items", {
    item_name,
    barcode: barcode || null,
    category_id,
    item_image: item_image || null,
  });
  return data;
}

//Update item
export async function updateItem(
  id: number,
  item_name: string,
  category_id: number,
  barcode?: string | null,
  item_image?: string | null
) {
  const { data } = await http.put(`/items/${id}`, {
    item_name,
    barcode: barcode || null,
    category_id,
    item_image: item_image || null,
  });
  return data;
}

//Delete item
export async function deleteItem(id: number) {
  const { data } = await http.delete(`/items/${id}`);
  return data;
}
