import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import App from './App';
import Register from './Register';
import Login from './Login';
import Header from './Header';

function MainRouter() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<App />} />
            </Routes>
        </Router>
    );
}

export default MainRouter;
