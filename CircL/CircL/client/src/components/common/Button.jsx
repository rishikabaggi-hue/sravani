import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'text-white shadow-lg shadow-teal-900/25 bg-gradient-to-r from-teal-600 to-cyan-700 hover:brightness-110 focus:ring-2 focus:ring-teal-500/30',
    secondary:
      'text-[var(--text-primary)] bg-white/60 dark:bg-slate-800/60 border border-[var(--outline)] hover:bg-white/80 dark:hover:bg-slate-800/80',
    danger:
      'text-white bg-gradient-to-r from-red-600 to-orange-600 hover:brightness-105 focus:ring-2 focus:ring-red-500/30',
    ghost:
      'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/40 dark:hover:bg-slate-800/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -1.5, scale: 1.01 } : {}}
      whileTap={!disabled ? { y: 0, scale: 0.99 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
