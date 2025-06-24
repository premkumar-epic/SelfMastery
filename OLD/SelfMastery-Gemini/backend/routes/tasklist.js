// routes/tasklist.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const TaskList = require('../models/taskList');
const Task = require('../models/task');
const { taskListValidationRules, taskValidationRules } = require('../utils/validation');

// --- Task List API ---

// Get all task lists for a user
router.get('/tasklists', authenticate, async (req, res) => {
  try {
    const userId = req.user._id; // Use _id for MongoDB
    const taskLists = await TaskList.find({ user_id: userId }).sort({ order: 1 });
    res.json(taskLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new task list
router.post('/tasklists', authenticate, taskListValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, color } = req.body;
    const userId = req.user._id; // Use _id for MongoDB

    // Get the maximum order for the user and increment by 1
    const lastTaskList = await TaskList.findOne({ user_id: userId }).sort({ order: -1 }).limit(1);
    const order = lastTaskList ? lastTaskList.order + 1 : 1;

    const newTaskList = new TaskList({ name, color, user_id: userId, order });
    await newTaskList.save();

    res.status(201).json(newTaskList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific task list
router.get('/tasklists/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Use _id for MongoDB
  try {
    const taskList = await TaskList.findOne({ _id: id, user_id: userId });
    if (!taskList) {
      return res.status(404).json({ error: 'Task list not found' });
    }
    res.json(taskList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task list
router.put('/tasklists/:id', authenticate, taskListValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const { name, color } = req.body;
  const userId = req.user._id; // Use _id for MongoDB

  try {
    const updatedTaskList = await TaskList.findOneAndUpdate(
      { _id: id, user_id: userId },
      { name, color },
      { new: true } // Return the updated document
    );
    if (!updatedTaskList) {
      return res.status(404).json({ error: 'Task list not found' });
    }
    res.json(updatedTaskList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task list
router.delete('/tasklists/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Use _id for MongoDB
  try {
    const deletedTaskList = await TaskList.findOneAndDelete({ _id: id, user_id: userId });
    if (!deletedTaskList) {
      return res.status(404).json({ error: 'Task list not found' });
    }
    // Delete all tasks associated with this task list
    await Task.deleteMany({ list_id: id });
    res.json({ message: 'Task list and associated tasks deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Task API ---

// Get all tasks for a specific task list
router.get('/tasklists/:listId/tasks', authenticate, async (req, res) => {
  const { listId } = req.params; // Correctly destructure listId
  const userId = req.user._id; // Use _id for MongoDB
  try {
    // Ensure the task list belongs to the user
    const taskList = await TaskList.findOne({ _id: listId, user_id: userId });
    if (!taskList) {
      return res.status(404).json({
        error: 'Task list not found or does not belong to user',
      });
    }

    // Use listId (camelCase) to find tasks
    const tasks = await Task.find({ list_id: listId }).sort({ due_date: 1, priority: 1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new task in a task list
router.post('/tasklists/:listId/tasks', authenticate, taskValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { listId } = req.params; // Correctly destructure listId
  const { title, description, due_date, priority, reminder, recurring } = req.body;
  const userId = req.user._id; // Use _id for MongoDB

  try {
    // Ensure the task list belongs to the user
    const taskList = await TaskList.findOne({ _id: listId, user_id: userId });
    if (!taskList) {
      return res.status(404).json({
        error: 'Task list not found or does not belong to user',
      });
    }
    // Use listId (camelCase) when creating a new Task
    const newTask = new Task({
      list_id: listId, // Corrected from list_id to listId
      title,
      description,
      due_date,
      priority,
      completed: false,
      reminder,
      recurring,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific task
router.get('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Use _id for MongoDB
  try {
    const task = await Task.findOne({
      _id: id,
      // Ensure the task belongs to a task list owned by the user
      list_id: { $in: await TaskList.find({ user_id: userId }).distinct('_id') },
    });
    if (!task) {
      return res
        .status(404)
        .json({ error: 'Task not found or does not belong to user' });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task
router.put('/tasks/:id', authenticate, taskValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const { title, description, due_date, priority, completed, reminder, recurring } =
    req.body;
  const userId = req.user._id; // Use _id for MongoDB

  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        // Ensure the task belongs to a task list owned by the user
        list_id: { $in: await TaskList.find({ user_id: userId }).distinct('_id') },
      },
      { title, description, due_date, priority, completed, reminder, recurring },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ error: 'Task not found or does not belong to user' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
router.delete('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Use _id for MongoDB
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      // Ensure the task belongs to a task list owned by the user
      list_id: { $in: await TaskList.find({ user_id: userId }).distinct('_id') },
    });
    if (!deletedTask) {
      return res
        .status(404)
        .json({ error: 'Task not found or does not belong to user' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tasks for a user (for dashboard)
router.get('/tasks', authenticate, async (req, res) => {
  const userId = req.user._id; // Use _id for MongoDB
  try {
    // Find all task lists belonging to the user
    const userTaskLists = await TaskList.find({ user_id: userId }).distinct('_id');

    // Find tasks where list_id is in the user's task lists
    const tasks = await Task.find({
      list_id: { $in: userTaskLists },
    }).populate('list_id', 'name'); // Populate list_id to get list name

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;