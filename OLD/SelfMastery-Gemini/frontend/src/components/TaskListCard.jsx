// src/components/TaskListCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';


const TaskListCard = ({ list }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the detail page for this task list
    navigate(`/tasklists/${list._id}`);
  };

  return (
    <div className="task-list-card" onClick={handleCardClick} style={{ backgroundColor: list.color + '20' }}> {/* Faded color */}
      <div className="card-header" style={{ backgroundColor: list.color }}>
        <h3 className="card-title">{list.name}</h3>
      </div>
      <div className="card-body">
        <p className="card-info">Click to view tasks</p>
        {/* Add more details here later, e.g., number of tasks */}
      </div>
    </div>
  );
};

export default TaskListCard;