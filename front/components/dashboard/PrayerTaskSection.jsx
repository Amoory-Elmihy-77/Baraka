'use client';

import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { AnimatePresence } from 'framer-motion';

const PRAYER_TIMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerTaskSection({
  tasks = [],
  prayerTime,
  onToggleComplete,
  onDelete,
  onEdit,
}) {
  const filteredTasks = tasks.filter((task) => task.prayerTime === prayerTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8 rounded-2xl border border-gray-200 bg-white p-4"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        {prayerTime}
        <span className="text-sm font-normal text-gray-500">
          ({filteredTasks.length})
        </span>
      </h2>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          No tasks for {prayerTime}
        </div>
      ) : (
        <div className="space-y-3 max-h-56 overflow-auto pr-1">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

