import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import App from './App';
import Register from './Register';
import Login from './Login';
import Header from './Header';
import Projects from './Projects'; // Import the Projects component

function PrivateRoute({ element }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? element : <Navigate to="/login" />;
}

function MainRouter() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<PrivateRoute element={<App />} />} />
                <Route path="/projects" element={<PrivateRoute element={<Projects />} />} />
            </Routes>
        </Router>
    );
}

export default MainRouter;
