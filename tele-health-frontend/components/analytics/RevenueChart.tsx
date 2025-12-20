import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  timeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  timeframe = '30d',
  onTimeframeChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Total revenue and trends over time
            </CardDescription>
          </div>
          {onTimeframeChange && (
            <Select defaultValue={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='7d'>Last 7 Days</SelectItem>
                <SelectItem value='30d'>Last 30 Days</SelectItem>
                <SelectItem value='90d'>Last 90 Days</SelectItem>
                <SelectItem value='1y'>Last Year</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='date' stroke='#888' fontSize={12} />
            <YAxis stroke='#888' fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={value => `$${value.toLocaleString()}`}
            />
            <Area
              type='monotone'
              dataKey='revenue'
              stroke='#3b82f6'
              strokeWidth={2}
              fill='url(#colorRevenue)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
