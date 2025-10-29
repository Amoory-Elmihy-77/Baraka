'use client';

import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  // API provides category: important_urgent | important_not_urgent | not_important_urgent | not_important_not_urgent
  const categoryToBorderClass = {
    important_urgent: 'border-task-important-urgent',
    important_not_urgent: 'border-task-important-not-urgent',
    not_important_urgent: 'border-task-not-important-urgent',
    not_important_not_urgent: 'border-task-not-important-not-urgent',
  };
  const borderColorClass = categoryToBorderClass[task.category] || 'border-gray-300';
  const categoryToChipClass = {
    important_urgent: 'bg-red-50 text-red-700',
    important_not_urgent: 'bg-amber-50 text-amber-700',
    not_important_urgent: 'bg-blue-50 text-blue-700',
    not_important_not_urgent: 'bg-gray-100 text-gray-700',
  };
  const chipClass = categoryToChipClass[task.category] || 'bg-gray-100 text-gray-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.005 }}
      className={`w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-200 ${
        task.isCompleted ? 'opacity-75' : ''
      }`}
    >
      {/* Top action bar (left-aligned, full-width, no extra content) */}
      <div className="w-full flex items-center gap-4 py-2 border-b mb-2">
        <button onClick={() => onToggleComplete(task._id)} className="flex-shrink-0">
          {task.isCompleted ? (
            <CheckCircleIconSolid className="h-5 w-5 text-green-500" />
          ) : (
            <CheckCircleIcon className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors" />
          )}
        </button>
        {/* Title */}
      {task?.title && (
        <h3
          className={`mt-1 text-sm font-semibold truncate mr-5 ${
            task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
        >
          {task.title}
        </h3>
      )}
        {onEdit && (
          <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-700 text-sm">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(task._id)} className="text-red-600 hover:text-red-700 text-sm">
            Delete
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-gray-600">
        <div className="flex items-center gap-1.5">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{task.prayerTime || 'No time'}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full capitalize ${chipClass}`}>
          {String(task.category || '').replaceAll('_', ' ')}
        </span>
      </div>
    </motion.div>
  );
}

