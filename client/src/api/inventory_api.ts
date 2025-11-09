import http from "./http";

// ✅ Type for Inventory
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

// ✅ Get all inventory records
export async function getInventory() {
  const { data } = await http.get<InventoryResponse[]>("/inventory");
  return data;
}

// ✅ Add new inventory record
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

// ✅ Update existing inventory record (adds new quantity to old one, updates price/date)
export async function updateInventory(
  id: number,
  item_id: number,
  supplier_id: number,
  category_id: number,
  quantity: number,
  price: number
) {
  const amount = quantity * price;

  const { data } = await http.put<InventoryResponse>(`/inventory/${id}`, {
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

// ✅ Delete inventory record
export async function deleteInventory(id: number) {
  const { data } = await http.delete(`/inventory/${id}`);
  return data;
}
