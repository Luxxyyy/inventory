import http from './http';

export type InventoryResponse = {
  id: number;
  item_name: string;
  supplier: string;
  quantity: number;
  price: number;
  amount: number; // generated column returned by DB
  date_added: string;
};

export async function getInventory() {
  const { data } = await http.get<InventoryResponse[]>('/inventory');
  return data;
}

export async function addInventory(
  item_name: string,
  supplier: string,
  quantity: number,
  price: number
) {
  const { data } = await http.post<InventoryResponse>('/inventory', { item_name, supplier, quantity, price });
  return data;
}

export async function updateInventory(
  id: number,
  item_name: string,
  supplier: string,
  quantity: number,
  price: number
) {
  const { data } = await http.put<InventoryResponse>(`/inventory/${id}`, { item_name, supplier, quantity, price });
  return data;
}

export async function deleteInventory(id: number) {
  const { data } = await http.delete(`/inventory/${id}`);
  return data;
}
