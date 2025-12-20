import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SpecializationData {
  name: string;
  value: number;
}

interface SpecializationChartProps {
  data: SpecializationData[];
}

export const SpecializationChart: React.FC<SpecializationChartProps> = ({
  data,
}) => {
  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments by Specialization</CardTitle>
        <CardDescription>
          Distribution across medical specialties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={value => `${value} appointments`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
