import http from "./http";

export type SaleResponse = {
    id: number;
    item_id: number;
    item_name: string;
    quantity_sold: number;
    selling_price: number;
    profit: number;
    date_sold: string;
};

// Get all sales
export async function getSales(): Promise<SaleResponse[]> {
    const { data } = await http.get<SaleResponse[]>("/sales");
    return data;
}

// Add a new sale
export async function addSale(
    item_id: number,
    quantity_sold: number,
    selling_price: number
): Promise<SaleResponse> {
    const { data } = await http.post<SaleResponse>("/sales", {
        item_id,
        quantity_sold,
        selling_price,
        date_sold: new Date().toISOString(),
    });
    return data;
}

// Update an existing sale
export async function updateSale(
    id: number,
    item_id: number,
    quantity_sold: number,
    selling_price: number
): Promise<SaleResponse> {
    const { data } = await http.put<SaleResponse>(`/sales/${id}`, {
        item_id,
        quantity_sold,
        selling_price,
        date_sold: new Date().toISOString(),
    });
    return data;
}

// Delete a sale
export async function deleteSale(id: number): Promise<void> {
    await http.delete(`/sales/${id}`);
}
