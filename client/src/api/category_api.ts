import http from "./http";

export type CategoryResponse = {
  id: number;
  category_name: string;
  date_added: string;
};

export async function getCategories(): Promise<CategoryResponse[]> {
  const { data } = await http.get("/categories");
  return data;
}

export async function addCategory(category_name: string) {
  const { data } = await http.post("/categories", { category_name });
  return data;
}

export async function updateCategory(id: number, category_name: string) {
  const { data } = await http.put(`/categories/${id}`, { category_name });
  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await http.delete(`/categories/${id}`);
  return data;
}
