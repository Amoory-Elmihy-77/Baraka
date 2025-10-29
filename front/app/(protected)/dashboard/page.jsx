'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PrayerTaskSection from '@/components/dashboard/PrayerTaskSection';
import AddTaskModal from '@/components/dashboard/AddTaskModal';
import EditTaskModal from '@/components/dashboard/EditTaskModal';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import Modal from '@/components/common/Modal';
import toast from 'react-hot-toast';

const PRAYER_TIMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const response = await api.put(`/tasks/${taskId}`, {
        isCompleted: !task.isCompleted,
      });
      setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
      toast.success(task.isCompleted ? 'Task marked incomplete' : 'Task completed!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const openDelete = (taskId) => {
    setDeletingTaskId(taskId);
    setIsDeleteOpen(true);
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setIsEditOpen(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Task
        </motion.button>
      </div>

      {/* Two per row: each section 50% width on md+ */}
      <div className="flex flex-wrap gap-6">
        {PRAYER_TIMES.map((t) => (
          <div key={t} className="w-full md:w-[calc(50%-0.75rem)]">
            <PrayerTaskSection
              prayerTime={t}
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDelete={openDelete}
              onEdit={openEdit}
            />
          </div>
        ))}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={editingTask}
        onTaskUpdated={handleTaskUpdated}
      />

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this task?</p>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={async () => { if (deletingTaskId) { await handleDelete(deletingTaskId); setIsDeleteOpen(false); setDeletingTaskId(null); } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

