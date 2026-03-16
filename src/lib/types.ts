import { Timestamp } from 'firebase/firestore';

export interface StoreEntry {
  storeName: 'Daraz' | 'PriceOye' | 'OLX' | 'Others';
  url: string;
  currentPrice: number | null;
  previousPrice?: number;
  lastUpdated: any;
  savingsPercent?: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  notes?: string;
  stores: StoreEntry[];
  createdAt: any;
  cheapestPrice: number | null;
  cheapestStore: string | null;
  priceHistory: PricePoint[];
}
