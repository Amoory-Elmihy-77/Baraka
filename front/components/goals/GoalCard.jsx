'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

export default function GoalCard({ goal, onToggleComplete, onClearProgress, onDelete, onEdit }) {
  const isCompleted = !!goal.isCompleted;
  const progress = isCompleted ? 100 : (goal.progress || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => onToggleComplete(goal._id)}
            className="flex-shrink-0"
          >
            {isCompleted ? (
              <CheckCircleIconSolid className="h-6 w-6 text-green-500" />
            ) : (
              <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-green-500 transition-colors" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-xl font-semibold mb-2 truncate break-all ${
                isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {goal.title}
            </h3>
            {goal.description && (
              <p
                className={`text-sm text-gray-600 ${
                  isCompleted ? 'line-through' : ''
                }`}
              >
                {goal.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
            >
              Edit
            </button>
          )}
          {onClearProgress && (progress > 0 || isCompleted) && (
            <button
              onClick={() => onClearProgress(goal._id)}
              className="text-amber-600 hover:text-amber-700 transition-colors text-sm"
            >
              Clear progress
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal)}
              className="text-red-500 hover:text-red-700 transition-colors text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isCompleted && (
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
        </div>
      )}

      {goal.targetDate && (
        <p className="text-xs text-gray-500 mt-2">
          Target: {new Date(goal.targetDate).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
}

