'use client';

import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import { getScoreColor } from '@/lib/scoring';
import { EvalScores } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeatmapCellProps {
  criterionKey: keyof Omit<EvalScores, 'avg'>;
  value?: number | boolean;
  status: 'pending' | 'running' | 'scored' | 'error';
  reasoning?: string;
  onClick?: () => void;
}

export default function HeatmapCell({
  criterionKey,
  value,
  status,
  reasoning,
  onClick,
}: HeatmapCellProps) {
  const isBoolean = criterionKey === 'brevity';
  const isClickable = status === 'scored' && onClick;
  const isScored = status === 'scored';

  const bgColor =
    status === 'scored'
      ? isBoolean
        ? value
          ? 'bg-green-500'
          : 'bg-red-500'
        : getScoreColor(value as number)
      : status === 'error'
      ? 'bg-red-900'
      : 'bg-zinc-800';

  const scoreDisplay = isBoolean
    ? value ? 'Pass' : 'Fail'
    : `${value}/5`;

  const cellContent = (
    <motion.div
      onClick={isClickable ? onClick : undefined}
      className={`
        flex-1
        h-10
        rounded-lg
        flex
        items-center
        justify-center
        relative
        overflow-hidden
        select-none
        ${bgColor}
        ${isClickable ? 'cursor-pointer' : 'cursor-default'}
        ${isScored ? 'hover:brightness-110' : ''}
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
      {isScored && (
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

  // Only show tooltip on scored cells with reasoning
  if (!isScored || !reasoning) return cellContent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {cellContent}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="
          max-w-55
          bg-zinc-900
          border-zinc-700
          text-zinc-100
          p-3
          rounded-md
          shadow-xl
        "
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
            Details
          </span>
          <span className="text-sm font-semibold text-white">
            Score: {scoreDisplay}
          </span>
          {reasoning && (
            <span className="text-xs text-zinc-400 leading-relaxed italic">
              &quot;{reasoning}&quot;
            </span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}