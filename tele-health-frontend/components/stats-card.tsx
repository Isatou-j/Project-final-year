'use client';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
};
// Reusable Stats Card Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
}: StatsCardProps) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend && <p className="text-sm text-green-600 mt-1">↑ {trend}</p>}
          </div>
          <div className={`${colorMap[color]} p-4 rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
