'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TestCase, EvalScores } from '@/lib/types';
import { CRITERIA_COLUMNS } from '@/lib/constants';
import { getAvgTextColor } from '@/lib/scoring';
import HeatmapCell from './heatmap-cell';
import { useEvalStore } from '@/lib/eval-store';

interface HeatmapRowProps {
  testCase: TestCase;
  index: number;
}

export default function HeatmapRow({ testCase, index }: HeatmapRowProps) {
  const setDrillDownTarget = useEvalStore((s) => s.setDrillDownTarget);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const status = useEvalStore((s) => s.status);
  const isPlaceholder = testCase.id.startsWith('placeholder-');

const handleCellClick = (criterionKey: keyof Omit<EvalScores, 'avg'>) => {
  if (testCase.status !== 'scored') return;
  setDrillDownTarget({
    testCaseId: testCase.id,
    criterion: criterionKey,
  });
};

  return (
    <motion.div
      layout
      className="flex items-center gap-2 py-1"
    >
      {/* Row label */}
      <div className="w-40 shrink-0">
        <AnimatePresence mode="wait">
          <motion.span
            key={testCase.name}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`
              text-sm font-medium truncate block
              ${isPlaceholder
                ? 'text-zinc-700'
                : 'text-zinc-300'
              }
            `}
          >
            {testCase.name}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Criteria cells */}
      <div className="flex flex-1 gap-2">
        {CRITERIA_COLUMNS.map((col, colIndex) => (
          <motion.div
            key={col.key}
            className="flex-1"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ delay: colIndex * 0.15 }}
          >
            <HeatmapCell
              criterionKey={col.key}
              value={testCase.scores?.[col.key]}
              status={
                isPlaceholder
                  ? 'pending'
                  : testCase.status === 'scored'
                  ? 'scored'
                  : testCase.status
              }
              onClick={() => handleCellClick(col.key)}
              
            />
          </motion.div>
        ))}

        {/* Avg cell */}
        <div className="w-16 shrink-0 h-10 flex items-center justify-center">
          <AnimatePresence>
            {testCase.scores?.avg !== undefined ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className={`
                  text-sm font-semibold
                  ${getAvgTextColor(testCase.scores.avg)}
                `}
              >
                {testCase.scores.avg}%
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-zinc-700 text-sm"
              >
                {isPlaceholder ? '—' : '...'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}