import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { formatPKR } from '../lib/utils';

interface PriceHistoryChartProps {
  data: { date: string; price: number }[];
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/30 text-zinc-500">
        No price history available yet.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    formattedDate: format(new Date(d.date), 'MMM d'),
  }));

  return (
    <div className="h-64 w-full rounded-2xl border border-white/5 bg-zinc-900/30 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis
            dataKey="formattedDate"
            stroke="#71717a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#71717a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `Rs ${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #ffffff10',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [formatPKR(value), 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
