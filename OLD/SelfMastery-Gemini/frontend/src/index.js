import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <Router> {/* Wrap App with Router */}
          <AuthProvider> {/* Wrap App with AuthProvider */}
            <App />
          </AuthProvider>
        </Router>
      </React.StrictMode>
    );