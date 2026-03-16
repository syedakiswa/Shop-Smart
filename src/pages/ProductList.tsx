import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { Product } from '../lib/types';
import { ProductCard } from '../components/ProductCard';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const ProductList: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/products`, id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tracked Products</h1>
          <p className="mt-1 text-zinc-400">Manage and monitor your price alerts.</p>
        </div>
        <Link
          to="/products/add"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-zinc-900/50 pl-12 pr-4 py-4 text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-zinc-900/30">
          <p className="text-zinc-500">No products found.</p>
          {search && (
            <button onClick={() => setSearch('')} className="mt-2 text-sm text-emerald-500 hover:underline">
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};
