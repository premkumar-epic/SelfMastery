// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getTaskLists, createTaskList, getAllTasks, updateTask, deleteTask } from '../services/api.js';

// No longer importing TaskListCard and TaskCard directly here for global use
// They will be refactored separately to use Tailwind/Shadcn

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // For general card use



const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [taskLists, setTaskLists] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('#007bff');
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorLists, setErrorLists] = useState('');
  const [errorTasks, setErrorTasks] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [showCreateListDialog, setShowCreateListDialog] = useState(false); // State for Dialog visibility

  // Task filtering/sorting states
  const [filterCompleted, setFilterCompleted] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch task lists
  const fetchTaskLists = useCallback(async () => {
    if (!user) return;
    setLoadingLists(true);
    setErrorLists('');
    try {
      const response = await getTaskLists();
      setTaskLists(response.data);
    } catch (err) {
      console.error('Error fetching task lists:', err);
      setErrorLists(err.response?.data?.error || 'Failed to load task lists.');
    } finally {
      setLoadingLists(false);
    }
  }, [user]);

  // Fetch all tasks
  const fetchAllTasks = useCallback(async () => {
    if (!user) return;
    setLoadingTasks(true);
    setErrorTasks('');
    try {
      const response = await getAllTasks();
      setAllTasks(response.data);
    } catch (err) {
      console.error('Error fetching all tasks:', err);
      setErrorTasks(err.response?.data?.error || 'Failed to load all tasks.');
    } finally {
      setLoadingTasks(false);
    }
  }, [user]);

  // Initial fetches on component mount or user change
  useEffect(() => {
    fetchTaskLists();
    fetchAllTasks();
  }, [fetchTaskLists, fetchAllTasks]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleCreateTaskList = async (e) => {
    e.preventDefault();
    setErrorLists('');
    setCreatingList(true);
    try {
      const response = await createTaskList({
        name: newListName,
        color: newListColor,
      });
      // Optimistically update the list, then refetch all to ensure latest order
      setTaskLists([...taskLists, response.data]);
      setNewListName('');
      setNewListColor('#007bff');
      setShowCreateListDialog(false); // Close dialog on success
      fetchTaskLists(); // Re-fetch to ensure correct order
    } catch (err) {
      console.error('Error creating task list:', err);
      setErrorLists(err.response?.data?.error || 'Failed to create task list.');
    } finally {
      setCreatingList(false);
    }
  };

  // Task update handler (for TaskCard in Dashboard)
  const handleTaskUpdate = async (taskId, updatedData) => {
    setErrorTasks('');
    try {
      const response = await updateTask(taskId, updatedData);
      setAllTasks(allTasks.map(task => task._id === taskId ? response.data : task));
    } catch (err) {
      console.error('Error updating task:', err);
      setErrorTasks(err.response?.data?.error || 'Failed to update task.');
    }
  };

  // Task delete handler (for TaskCard in Dashboard)
  const handleTaskDelete = async (taskId) => {
    setErrorTasks('');
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setAllTasks(allTasks.filter(task => task._id !== taskId));
      } catch (err) {
        console.error('Error deleting task:', err);
        setErrorTasks(err.response?.data?.error || 'Failed to delete task.');
      }
    }
  };

  // Filtering and Sorting logic for allTasks
  const filteredAndSortedTasks = [...allTasks]
    .filter(task => {
      if (filterCompleted === 'incomplete') return !task.completed;
      if (filterCompleted === 'completed') return task.completed;
      return true; // 'all'
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return dateA - dateB;
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority]; // High to Low
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  if (authLoading || loadingLists || loadingTasks) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading Dashboard...</p>
      </div>
    );
  }

  if (errorLists || errorTasks) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-xl text-red-700 font-medium p-4 rounded-md border border-red-400">
          {errorLists || errorTasks}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome, {user.name}!
        </h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/settings')}>
            Settings
          </Button>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Section: Create New Task List */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create New Task List
        </h2>
        <div className="flex justify-center">
          <Dialog open={showCreateListDialog} onOpenChange={setShowCreateListDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">Add New List</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Task List</DialogTitle>
                <DialogDescription>
                  Enter the name and choose a color for your new task list.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTaskList} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="list-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="list-name"
                    placeholder="e.g., Work Projects"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="list-color" className="text-right">
                    Color
                  </Label>
                  <Input
                    id="list-color"
                    type="color"
                    value={newListColor}
                    onChange={(e) => setNewListColor(e.target.value)}
                    className="col-span-3 h-10 w-20" // Fixed width/height for color picker
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={creatingList}>
                    {creatingList ? 'Creating...' : 'Add List'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Section: Your Task Lists */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Your Task Lists
        </h2>
        {taskLists.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            You don't have any task lists yet. Click "Add New List" above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taskLists.map((list) => (
              // TaskListCard will be refactored to use Tailwind/Shadcn next
              <TaskListCard key={list._id} list={list} />
            ))}
          </div>
        )}
      </section>

      {/* Section: All Your Tasks Overview */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          All Your Tasks
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 p-4 rounded-md bg-gray-100">
          <Label htmlFor="filter-tasks">Show:</Label>
          <Select value={filterCompleted} onValueChange={setFilterCompleted}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="sort-tasks">Sort By:</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredAndSortedTasks.length === 0 ? (
          <p className="text-center text-gray-600 italic">No tasks matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTasks.map((task) => (
              // TaskCard will be refactored to use Tailwind/Shadcn later
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

export default Dashboard;
