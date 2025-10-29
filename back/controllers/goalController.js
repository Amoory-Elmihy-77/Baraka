const Goal = require('../models/Goal');

async function createGoal(req, res) {
  try {
    const { title, type, isCompleted } = req.body;
    const goal = await Goal.create({ user: req.user.id, title, type, isCompleted });
    return res.status(201).json(goal);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create goal', error: err.message });
  }
}

async function getGoals(req, res) {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(goals);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch goals', error: err.message });
  }
}

async function getGoalById(req, res) {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    return res.status(200).json(goal);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to fetch goal', error: err.message });
  }
}

async function updateGoal(req, res) {
  try {
    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Goal not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update goal', error: err.message });
  }
}

async function deleteGoal(req, res) {
  try {
    const deleted = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Goal not found' });
    return res.status(200).json({ message: 'Goal deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to delete goal', error: err.message });
  }
}

module.exports = { createGoal, getGoals, getGoalById, updateGoal, deleteGoal };


