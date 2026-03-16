import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return '---';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateSavings(oldPrice: number, newPrice: number) {
  if (!oldPrice || !newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}
