import React from 'react';
import { motion } from 'framer-motion';

export const Loader = ({ size = 'md', fullscreen = false }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  const spinner = (
    <motion.div
      className={`${sizes[size]} rounded-full border-[3px] border-transparent border-t-teal-500 border-r-cyan-500 border-b-orange-400`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center py-4">{spinner}</div>;
};

export default Loader;
