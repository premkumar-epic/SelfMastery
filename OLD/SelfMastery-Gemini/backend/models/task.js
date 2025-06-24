// models/task.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  list_id: { type: Schema.Types.ObjectId, ref: 'TaskList', required: true }, // Reference to TaskList model
  title: { type: String, required: true },
  description: { type: String },
  due_date: { type: Date },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  completed: { type: Boolean, default: false },
  reminder: { type: Date },
  recurring: { type: String }, // e.g., 'daily', 'weekly', 'monthly'
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;