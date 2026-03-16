import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Trash2 } from 'lucide-react';

interface AddStoreFormFieldProps {
  index: number;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

export const AddStoreFormField: React.FC<AddStoreFormFieldProps> = ({
  index,
  register,
  errors,
  onRemove,
  showRemove,
}) => {
  return (
    <div className="grid gap-4 rounded-2xl border border-white/5 bg-black/50 p-4 sm:grid-cols-12">
      <div className="sm:col-span-4">
        <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Store</label>
        <select
          {...register(`stores.${index}.storeName`)}
          className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="Daraz">Daraz</option>
          <option value="PriceOye">PriceOye</option>
          <option value="OLX">OLX</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="sm:col-span-7">
        <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Product URL</label>
        <input
          {...register(`stores.${index}.url`)}
          placeholder="https://..."
          className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
        />
        {errors.stores?.[index]?.url && (
          <p className="mt-1 text-[10px] text-red-500">{(errors.stores[index] as any).url.message}</p>
        )}
      </div>

      <div className="flex items-end justify-center sm:col-span-1">
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="mb-1 rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
