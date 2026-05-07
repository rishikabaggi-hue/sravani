import React from 'react';
import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';

export const TypingIndicator = ({ users = [] }) => {
  if (users.length === 0) return null;

  return (
    <motion.div className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] bg-white/50 dark:bg-slate-800/45 border border-[var(--outline)] rounded-full px-3 py-1">
      <span className="font-medium text-[var(--text-primary)]">{users.join(', ')}</span>
      <span className="text-xs">typing</span>
      <motion.div
        className="flex gap-0.5"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        <Dot size={15} />
        <Dot size={15} />
        <Dot size={15} />
      </motion.div>
    </motion.div>
  );
};

export default TypingIndicator;
