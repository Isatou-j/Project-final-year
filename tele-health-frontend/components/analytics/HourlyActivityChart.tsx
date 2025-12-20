import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HourlyActivityData {
  hour: string;
  appointments: number;
}

interface HourlyActivityChartProps {
  data: HourlyActivityData[];
}

export const HourlyActivityChart: React.FC<HourlyActivityChartProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Hours Analysis</CardTitle>
        <CardDescription>
          Appointment distribution throughout the day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='colorActivity' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#8b5cf6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='hour' stroke='#888' fontSize={12} />
            <YAxis stroke='#888' fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Area
              type='monotone'
              dataKey='appointments'
              stroke='#8b5cf6'
              strokeWidth={2}
              fill='url(#colorActivity)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
