'use client';

import React from 'react';

import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="bg-transparent flex items-center justify-center h-screen">
      <motion.div
        className="relative w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(4)].map((_, index) => (
          <span
            key={index}
            className="absolute w-full h-full border-4 rounded-full"
            style={{
              borderColor:
                index % 2 === 0
                  ? '#fb7185 transparent transparent transparent'
                  : '#22d3ee transparent transparent transparent',
              transform: `rotate(${90 * index}deg)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
