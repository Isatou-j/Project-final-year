import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AppointmentsData {
  month: string;
  completed: number;
  pending: number;
  cancelled: number;
}

interface AppointmentsChartProps {
  data: AppointmentsData[];
}

export const AppointmentsChart: React.FC<AppointmentsChartProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments Statistics</CardTitle>
        <CardDescription>Breakdown by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='month' stroke='#888' fontSize={12} />
            <YAxis stroke='#888' fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey='completed' fill='#10b981' radius={[8, 8, 0, 0]} />
            <Bar dataKey='pending' fill='#f59e0b' radius={[8, 8, 0, 0]} />
            <Bar dataKey='cancelled' fill='#ef4444' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
