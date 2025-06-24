// models/taskList.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskListSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  order: { type: Number, required: true }, // For custom ordering of lists
});

const TaskList = mongoose.model('TaskList', taskListSchema);
module.exports = TaskList;