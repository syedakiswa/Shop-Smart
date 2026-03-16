import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { AddStoreFormField } from '../components/AddStoreFormField';
import { Plus, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Product name is required'),
  notes: z.string().optional(),
  stores: z.array(z.object({
    storeName: z.enum(['Daraz', 'PriceOye', 'OLX', 'Others']),
    url: z.string().url('Invalid URL'),
  })).min(1, 'At least one store is required').max(5, 'Maximum 5 stores allowed'),
});

type FormData = z.infer<typeof schema>;

export const AddProduct: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      stores: [{ storeName: 'Daraz', url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stores',
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const productData = {
        userId: user.uid,
        name: data.name,
        notes: data.notes || '',
        stores: data.stores.map(s => ({
          ...s,
          currentPrice: null,
          lastUpdated: serverTimestamp(),
        })),
        createdAt: serverTimestamp(),
        cheapestPrice: null,
        cheapestStore: null,
        priceHistory: [],
      };

      await addDoc(collection(db, `users/${user.uid}/products`), productData);
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="text-zinc-400">Enter product details and store links to start tracking.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 rounded-3xl border border-white/5 bg-zinc-900/50 p-8">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Product Name</label>
            <input
              {...register('name')}
              placeholder="e.g. iPhone 15 Pro Max"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              placeholder="Any specific variant or color..."
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Store Links</h3>
            <button
              type="button"
              onClick={() => append({ storeName: 'Daraz', url: '' })}
              disabled={fields.length >= 5}
              className="flex items-center gap-2 text-sm font-medium text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Store
            </button>
          </div>

          <div className="grid gap-4">
            {fields.map((field, index) => (
              <AddStoreFormField
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                onRemove={remove}
                showRemove={fields.length > 1}
              />
            ))}
          </div>
          {errors.stores?.root && <p className="text-xs text-red-500">{errors.stores.root.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-500/20 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {loading ? 'Saving Product...' : 'Start Tracking Product'}
        </button>
      </form>
    </div>
  );
};
