import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../lib/types';
import { formatPKR, cn } from '../lib/utils';
import { TrendingDown, Trash2, ExternalLink, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const savings = product.stores.reduce((acc, s) => {
    if (s.previousPrice && s.currentPrice && s.currentPrice < s.previousPrice) {
      return acc + (s.previousPrice - s.currentPrice);
    }
    return acc;
  }, 0);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-6 transition-all hover:border-emerald-500/50 hover:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-white group-hover:text-emerald-400">{product.name}</h3>
          <p className="text-xs text-zinc-500">{product.notes || 'No notes'}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(product.id)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Lowest Price</p>
            <p className="text-xl font-bold text-white">{formatPKR(product.cheapestPrice)}</p>
          </div>
          {savings > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-500">
              <TrendingDown className="h-3 w-3" />
              Save {formatPKR(savings)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Found at:</span>
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-300">
            {product.cheapestStore || 'N/A'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Link
          to={`/products/${product.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
