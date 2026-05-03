'use client';

import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import { getScoreColor } from '@/lib/scoring';
import { EvalScores } from '@/lib/types';

interface HeatmapCellProps {
  criterionKey: keyof Omit<EvalScores, 'avg'>;
  value?: number | boolean;
  status: 'pending' | 'running' | 'scored' | 'error';
  onClick?: () => void;
}

export default function HeatmapCell({
  criterionKey,
  value,
  status,
  onClick,
}: HeatmapCellProps) {
  const isBoolean = criterionKey === 'brevity';
  const isClickable = status === 'scored' && onClick;

  const bgColor =
    status === 'scored'
      ? isBoolean
        ? value
          ? 'bg-green-500'
          : 'bg-red-500'
        : getScoreColor(value as number)
      : 'bg-zinc-800';

  return (
    <motion.div
      onClick={isClickable ? onClick : undefined}
      className={`
        flex-1
        h-10
        rounded-sm
        flex
        items-center
        justify-center
        relative
        overflow-hidden
        select-none
        ${bgColor}
        ${isClickable ? 'cursor-pointer' : 'cursor-default'}
        ${status === 'scored' ? 'hover:brightness-110' : ''}
        transition-[filter]
        duration-150
      `}
      initial={false}
      animate={
        status === 'running'
          ? { opacity: [0.3, 0.7, 0.3] }
          : { opacity: 1 }
      }
      transition={
        status === 'running'
          ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      {status === 'scored' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          {isBoolean ? (
            value ? (
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            ) : (
              <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            )
          ) : (
            <span className="text-sm font-semibold text-white">
              {value as number}
            </span>
          )}
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-300" />
        </motion.div>
      )}
    </motion.div>
  );
}