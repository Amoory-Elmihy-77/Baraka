const DailyTask = require('../models/DailyTask');

async function createTask(req, res) {
  try {
    const { title, date, prayerTime, category, isCompleted } = req.body;
    const task = await DailyTask.create({
      user: req.user.id,
      title,
      date,
      prayerTime,
      category,
      isCompleted,
    });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create task', error: err.message });
  }
}

async function getTasks(req, res) {
  try {
    const tasks = await DailyTask.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
}

async function getTaskById(req, res) {
  try {
    const task = await DailyTask.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to fetch task', error: err.message });
  }
}

async function updateTask(req, res) {
  try {
    const updated = await DailyTask.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update task', error: err.message });
  }
}

async function deleteTask(req, res) {
  try {
    const deleted = await DailyTask.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to delete task', error: err.message });
  }
}

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };


