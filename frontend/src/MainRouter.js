import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import App from './App';
import Register from './Register';
import Login from './Login';

function MainRouter() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<App />} />  {/* Add this line to handle root "/" */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<App />} />
            </Routes>
        </Router>
    );
}

export default MainRouter;
