'use client';

import React, { type FC } from 'react';

import { motion } from 'framer-motion';

type LoadingBounceProps = {
  size?: number; // dot size
  color?: string; // tailwind color class
};

const LoadingBounce: FC<LoadingBounceProps> = ({
  size = 12,
  color = 'bg-blue-600',
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className={`${color} rounded-full`}
          style={{ width: size, height: size }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default LoadingBounce;
