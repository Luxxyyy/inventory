import http from "./http";

export type InventoryResponse = {
  id: number;
  item_id: number;
  supplier_id: number;
  category_id: number;
  item_name: string;
  supplier_name: string;
  category_name: string;
  quantity: number;
  price: number;
  amount: number;
  date_added: string;
};

export async function getInventory() {
  const { data } = await http.get<InventoryResponse[]>("/inventory");
  return data;
}

export async function addInventory(
  item_id: number,
  supplier_id: number,
  category_id: number,
  quantity: number,
  price: number
) {
  const amount = quantity * price;
  const { data } = await http.post<InventoryResponse>("/inventory", {
    item_id,
    supplier_id,
    category_id,
    quantity,
    price,
    amount,
    date_added: new Date().toISOString(),
  });
  return data;
}

// ✅ FIXED: Now correctly recalculates amount and replaces values (not adds)
export async function updateInventory(
  id: number,
  item_id: number,
  supplier_id: number,
  category_id: number,
  quantity: number,
  price: number
) {
  const amount = quantity * price; // recalculate total properly
  const { data } = await http.put<InventoryResponse>(`/inventory/${id}`, {
    item_id,
    supplier_id,
    category_id,
    quantity,
    price,
    amount, // ✅ included
    date_added: new Date().toISOString(),
  });
  return data;
}

export async function deleteInventory(id: number) {
  const { data } = await http.delete(`/inventory/${id}`);
  return data;
}
