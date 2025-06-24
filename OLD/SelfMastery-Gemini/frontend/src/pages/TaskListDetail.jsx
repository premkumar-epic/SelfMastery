// src/pages/TaskListDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getTaskListById,
  getTasksByTaskList,
  createTask,
  updateTask, // Will be used by TaskCard, but imported here for consistency
  deleteTask // Will be used by TaskCard
} from '../services/api.js';
import TaskCard from '../components/TaskCard.jsx'; // Import the new TaskCard component


const TaskListDetail = () => {
  const { listId } = useParams(); // Get listId from URL
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [taskList, setTaskList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for new task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium'); // Default priority
  const [creatingTask, setCreatingTask] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
  }, [user, authLoading, navigate]);

  // Fetch task list details AND tasks for this list
  useEffect(() => {
    const fetchDetails = async () => {
      if (!user || !listId) { // Ensure user and listId are available
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const listResponse = await getTaskListById(listId);
        setTaskList(listResponse.data);

        const tasksResponse = await getTasksByTaskList(listId);
        setTasks(tasksResponse.data);
      } catch (err) {
        console.error('Error fetching task list or tasks:', err);
        setError(err.response?.data?.error || 'Failed to load task list details or tasks.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user and listId are available and not loading auth
    if (user && listId && !authLoading) {
        fetchDetails();
    }
  }, [listId, user, authLoading]); // Re-fetch when listId or user changes

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setCreatingTask(true);
    try {
      const newTaskData = {
        title: newTaskTitle,
        description: newTaskDescription,
        due_date: newTaskDueDate || null, // Allow null if not set
        priority: newTaskPriority,
      };
      const response = await createTask(listId, newTaskData);
      setTasks([...tasks, response.data]); // Add new task to the local state
      // Clear form fields
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskPriority('medium');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.error || 'Failed to create task.');
    } finally {
      setCreatingTask(false);
    }
  };

  // Function to handle task updates (passed to TaskCard)
  const handleTaskUpdate = async (taskId, updatedData) => {
    setError('');
    try {
      const response = await updateTask(taskId, updatedData);
      // Update the task in the local state
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.error || 'Failed to update task.');
    }
  };

  // Function to handle task deletion (passed to TaskCard)
  const handleTaskDelete = async (taskId) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        // Remove the task from the local state
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError(err.response?.data?.error || 'Failed to delete task.');
      }
    }
  };

  if (authLoading || loading) {
    return <div className="task-list-detail-container">Loading task list...</div>;
  }

  if (error) {
    return <div className="task-list-detail-container error-message">{error}</div>;
  }

  if (!taskList) {
    return <div className="task-list-detail-container no-list-found">Task list not found.</div>;
  }

  return (
    <div className="task-list-detail-container">
      <header className="list-detail-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <h1 style={{ color: taskList.color || '#333' }}>{taskList.name}</h1>
      </header>

      <section className="create-task-section">
        <h2>Add New Task</h2>
        <form onSubmit={handleCreateTask} className="create-task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
            disabled={creatingTask}
          />
          <textarea
            placeholder="Description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            disabled={creatingTask}
          />
          <div className="form-row">
            <label>
              Due Date:
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                disabled={creatingTask}
              />
            </label>
            <label>
              Priority:
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                disabled={creatingTask}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <button type="submit" disabled={creatingTask}>
            {creatingTask ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </section>

      <section className="tasks-list-section">
        <h2>Tasks</h2>
        {tasks.length === 0 ? (
          <p className="no-tasks-message">No tasks in this list yet. Add one above!</p>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TaskListDetail;