// src/components/TaskCard.jsx
import React, { useState } from 'react';


const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedDueDate, setEditedDueDate] = useState(task.due_date ? task.due_date.substring(0, 10) : '');
  const [editedPriority, setEditedPriority] = useState(task.priority);

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleToggleComplete = () => {
    onUpdate(task._id, { completed: !task.completed });
  };

  const handleEditSave = async () => {
    const updatedData = {
      title: editedTitle,
      description: editedDescription,
      due_date: editedDueDate || null,
      priority: editedPriority,
    };
    await onUpdate(task._id, updatedData);
    setIsEditing(false); // Exit edit mode after saving
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${getPriorityClass(task.priority)}`}>
      {isEditing ? (
        // Edit Mode
        <div className="task-edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Description"
          />
          <label>Due Date:</label>
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
          />
          <label>Priority:</label>
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="task-actions-edit">
            <button onClick={handleEditSave} className="save-button">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        // Display Mode
        <>
          <div className="task-header">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              title="Mark as complete"
            />
            <h3 className="task-title">{task.title}</h3>
            <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                {task.priority}
            </span>
          </div>
          <div className="task-body">
            {task.description && <p className="task-description">{task.description}</p>}
            {task.due_date && <p className="task-due-date">Due: {formatDate(task.due_date)}</p>}
          </div>
          <div className="task-actions-display">
            <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
            <button onClick={() => onDelete(task._id)} className="delete-button">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;