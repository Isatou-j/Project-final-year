import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PatientGrowthData {
  month: string;
  patients: number;
  physicians: number;
}

interface PatientGrowthChartProps {
  data: PatientGrowthData[];
}

export const PatientGrowthChart: React.FC<PatientGrowthChartProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Growth</CardTitle>
        <CardDescription>New patient registrations over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={data}>
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
            <Line
              type='monotone'
              dataKey='patients'
              stroke='#3b82f6'
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type='monotone'
              dataKey='physicians'
              stroke='#10b981'
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
