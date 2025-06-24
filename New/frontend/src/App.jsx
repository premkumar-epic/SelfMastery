import React from 'react';
// Import your pages here
import Dashboard from './pages/Dashboard';
// import Auth from './pages/Auth';
// import ProfileSettings from './pages/ProfileSettings';
// import TaskListDetail from './pages/TaskListDetail';

function App() {
  return (
    // You'll eventually add routing here (e.g., with react-router-dom)
    // For now, let's just display the Dashboard
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Dashboard />
    </div>
  );
}

export default App;
