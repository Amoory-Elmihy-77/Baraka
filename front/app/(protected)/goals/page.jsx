'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import GoalCard from '@/components/goals/GoalCard';
import Modal from '@/components/common/Modal';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'week',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      toast.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (goalId) => {
    try {
      const goal = goals.find((g) => g._id === goalId);
      const response = await api.put(`/goals/${goalId}`, {
        isCompleted: !goal.isCompleted,
      });
      setGoals(goals.map((g) => (g._id === goalId ? response.data : g)));
      toast.success(goal.isCompleted ? 'Goal marked incomplete' : 'Goal completed!');
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  const handleClearProgress = async (goalId) => {
    try {
      const response = await api.put(`/goals/${goalId}`, {
        progress: 0,
        isCompleted: false,
      });
      setGoals(goals.map((g) => (g._id === goalId ? response.data : g)));
      toast.success('Progress cleared');
    } catch (error) {
      toast.error('Failed to clear progress');
    }
  };

  const openDelete = (goal) => {
    setDeletingGoal(goal);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingGoal) return;
    try {
      await api.delete(`/goals/${deletingGoal._id}`);
      setGoals(goals.filter((g) => g._id !== deletingGoal._id));
      toast.success('Goal deleted');
    } catch (error) {
      toast.error('Failed to delete goal');
    } finally {
      setIsDeleteOpen(false);
      setDeletingGoal(null);
    }
  };

  const openEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({ title: goal.title || '', type: goal.type || 'week' });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingGoal) return;
    setIsSubmitting(true);
    try {
      const payload = { title: formData.title, type: formData.type };
      const response = await api.put(`/goals/${editingGoal._id}`, payload);
      setGoals(goals.map((g) => (g._id === editingGoal._id ? response.data : g)));
      toast.success('Goal updated');
      setIsEditOpen(false);
      setEditingGoal(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { title: formData.title, type: formData.type };
      const response = await api.post('/goals', payload);
      setGoals([...goals, response.data]);
      toast.success('Goal created successfully!');
      setFormData({ title: '', type: 'week' });
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading goals...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600 mt-1">Set and track your long-term goals</p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Goal
        </motion.button>
      </div>

      {/* Grouped sections: week, month, year */}
      {goals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No goals yet</p>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Your First Goal
          </motion.button>
        </div>
      ) : (
        <div className="space-y-10">
          <GoalsSection
            title="Weekly Goals"
            goals={goals.filter((g) => (g.type || 'week') === 'week')}
            onToggleComplete={handleToggleComplete}
            onClearProgress={handleClearProgress}
            onDelete={openDelete}
            onEdit={openEdit}
          />
          <GoalsSection
            title="Monthly Goals"
            goals={goals.filter((g) => g.type === 'month')}
            onToggleComplete={handleToggleComplete}
            onClearProgress={handleClearProgress}
            onDelete={openDelete}
            onEdit={openEdit}
          />
          <GoalsSection
            title="Yearly Goals"
            goals={goals.filter((g) => g.type === 'year')}
            onToggleComplete={handleToggleComplete}
            onClearProgress={handleClearProgress}
            onDelete={openDelete}
            onEdit={openEdit}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Goal"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter goal title"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              onClick={() => setIsModalOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Goal"
        size="md"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="editTitle"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="editType" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="editType"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              onClick={() => setIsEditOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Goal"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{deletingGoal?.title}</span>? This action cannot be undone.</p>
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
              onClick={confirmDelete}
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

function GoalsSection({ title, goals, onToggleComplete, onClearProgress, onDelete, onEdit }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">{goals.length} item(s)</span>
      </div>
      {goals.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg text-gray-500 text-center">No items</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onToggleComplete={onToggleComplete}
              onClearProgress={onClearProgress}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

