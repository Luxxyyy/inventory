import http from "./http";

export type SupplierResponse = {
  id: number;
  supplier_name: string;
  supplier_image?: string | null;
  date_added: string;
};

export async function getSuppliers(): Promise<SupplierResponse[]> {
  const { data } = await http.get("/suppliers");

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.suppliers)) return data.suppliers;

  console.warn("⚠️ Unexpected suppliers response format:", data);
  return [];
}

export async function addSupplier(
  supplier_name: string,
  supplier_image?: string | null
): Promise<SupplierResponse> {
  const { data } = await http.post("/suppliers", {
    supplier_name,
    supplier_image: supplier_image || null,
  });
  return data;
}

export async function updateSupplier(
  id: number,
  supplier_name: string,
  supplier_image?: string | null
): Promise<SupplierResponse> {
  const { data } = await http.put(`/suppliers/${id}`, {
    supplier_name,
    supplier_image: supplier_image || null,
  });
  return data;
}

export async function deleteSupplier(id: number): Promise<{ message: string }> {
  const { data } = await http.delete(`/suppliers/${id}`);
  return data;
}
