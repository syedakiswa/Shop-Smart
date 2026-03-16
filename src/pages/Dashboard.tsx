import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { Product } from '../lib/types';
import { ProductCard } from '../components/ProductCard';
import { TrendingDown, Package, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { formatPKR } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/products`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const totalSavings = products.reduce((acc, p) => {
    const savings = p.stores.reduce((sAcc, s) => {
      if (s.previousPrice && s.currentPrice) {
        return sAcc + (s.previousPrice - s.currentPrice);
      }
      return sAcc;
    }, 0);
    return acc + savings;
  }, 0);

  const topDeals = [...products]
    .filter(p => p.cheapestPrice !== null)
    .sort((a, b) => (a.cheapestPrice || 0) - (b.cheapestPrice || 0))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.displayName || 'Shopper'}</h1>
        <p className="mt-2 text-zinc-400">Here's what's happening with your tracked products.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Tracked Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Savings</p>
              <p className="text-2xl font-bold text-white">{formatPKR(totalSavings)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Active Deals</p>
              <p className="text-2xl font-bold text-white">{topDeals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Deals */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Top Deals Right Now</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-emerald-500 hover:text-emerald-400">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        {topDeals.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30">
            <p className="text-zinc-500">No products tracked yet.</p>
            <Link to="/products/add" className="mt-4 text-sm font-medium text-emerald-500 hover:underline">
              Add your first product
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};
