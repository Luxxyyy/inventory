// Category type 
export type Category = {
  id: number;
  category_name: string;
  date_added: string;
};

// Item type
export type ItemType = {
  id: number;
  item_name: string;
  barcode?: string | null;
  item_image?: string | null;
  category_id: number;
  category_name?: string | null;
  date_added: string;
};
