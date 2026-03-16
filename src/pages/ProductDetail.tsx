import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { Product, StoreEntry } from '../lib/types';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { formatPKR, calculateSavings, cn } from '../lib/utils';
import { ArrowLeft, RefreshCw, ExternalLink, TrendingUp, TrendingDown, Info, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || !id) return;

    const unsubscribe = onSnapshot(doc(db, `users/${user.uid}/products`, id), (doc) => {
      if (doc.exists()) {
        setProduct({ id: doc.id, ...doc.data() } as Product);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user, id, navigate]);

  const handleUpdatePrices = async () => {
    if (!user || !product) return;
    setUpdating(true);
    try {
      // Mock price update logic
      const updatedStores = product.stores.map((store) => {
        const newPrice = Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000;
        const previousPrice = store.currentPrice || newPrice + 5000;
        return {
          ...store,
          previousPrice,
          currentPrice: newPrice,
          lastUpdated: new Date(),
          savingsPercent: calculateSavings(previousPrice, newPrice),
        };
      });

      const cheapest = updatedStores.reduce((min, s) => {
        if (s.currentPrice !== null && (min.price === null || s.currentPrice < min.price)) {
          return { price: s.currentPrice, store: s.storeName };
        }
        return min;
      }, { price: null as number | null, store: null as string | null });

      const newHistoryPoint = {
        date: new Date().toISOString(),
        price: cheapest.price || 0,
      };

      const updatedHistory = [...(product.priceHistory || []), newHistoryPoint].slice(-10);

      await updateDoc(doc(db, `users/${user.uid}/products`, product.id), {
        stores: updatedStores,
        cheapestPrice: cheapest.price,
        cheapestStore: cheapest.store,
        priceHistory: updatedHistory,
      });

      toast.success('Prices updated successfully!');
    } catch (error) {
      toast.error('Failed to update prices');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="rounded-full bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-zinc-400">{product.notes || 'No notes added'}</p>
          </div>
        </div>
        <button
          onClick={handleUpdatePrices}
          disabled={updating}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
        >
          <RefreshCw className={cn('h-4 w-4', updating && 'animate-spin')} />
          {updating ? 'Updating...' : 'Update Prices Now'}
        </button>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Price History */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Price History</h2>
            <PriceHistoryChart data={product.priceHistory || []} />
          </section>

          {/* Stores Table */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Store Comparison</h2>
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/5 bg-white/5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-6 py-4">Store</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Savings</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {product.stores.map((store, idx) => {
                    const isCheapest = store.currentPrice === product.cheapestPrice;
                    const lastUpdated = store.lastUpdated?.toDate ? store.lastUpdated.toDate() : new Date(store.lastUpdated);
                    
                    return (
                      <tr key={idx} className={cn('transition-colors hover:bg-white/5', isCheapest && 'bg-emerald-500/5')}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{store.storeName}</span>
                            {isCheapest && (
                              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-500">
                                Cheapest
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-bold text-white">{formatPKR(store.currentPrice)}</p>
                            {store.previousPrice && store.currentPrice && store.currentPrice < store.previousPrice && (
                              <p className="text-xs text-zinc-500 line-through">{formatPKR(store.previousPrice)}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {store.savingsPercent ? (
                            <div className="flex items-center gap-1 text-emerald-500">
                              <TrendingDown className="h-3 w-3" />
                              <span className="font-medium">{store.savingsPercent}%</span>
                            </div>
                          ) : (
                            <span className="text-zinc-600">---</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-zinc-500">
                          {format(lastUpdated, 'MMM d, h:mm a')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={store.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400"
                          >
                            Visit <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-bold text-white">Price Insight</h3>
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Best Price Found</p>
                  <p className="text-xl font-bold text-white">{formatPKR(product.cheapestPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Store</p>
                  <p className="text-xl font-bold text-white">{product.cheapestStore || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-white/5 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-zinc-400" />
                <p className="text-xs leading-relaxed text-zinc-400">
                  Prices are updated manually for this demo. In production, this would be connected to a real-time scraping service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
