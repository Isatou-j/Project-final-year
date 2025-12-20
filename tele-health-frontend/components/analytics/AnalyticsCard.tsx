import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down';
  description?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'up',
  description,
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
            <p className='text-3xl font-bold mb-2'>{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                <TrendIcon className='w-4 h-4' />
                <span className='font-medium'>{change}</span>
                <span className='text-gray-500 ml-1'>{description}</span>
              </div>
            )}
          </div>
          <div className='bg-blue-50 p-3 rounded-lg'>
            <Icon className='w-6 h-6 text-blue-600' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
