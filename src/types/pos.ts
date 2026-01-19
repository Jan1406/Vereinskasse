export type ProductCategory = 'drinks' | 'food' | 'other';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  icon?: string;
}

export interface ReceiptItem {
  product: Product;
  quantity: number;
}

export interface CompletedReceipt {
  id: string;
  items: ReceiptItem[];
  total: number;
  completedAt: Date;
}

export interface DailySales {
  date: string;
  receipts: CompletedReceipt[];
  total: number;
  itemCount: number;
}
