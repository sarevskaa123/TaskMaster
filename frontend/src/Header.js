import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');  // Clear username as well
        alert("Logout successful!");
        navigate('/');
    };

    return (
        <header className="App-header">
            <div className="header-title">Task Manager</div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>

                    {/* Show Register and Login links only if the user is not logged in */}
                    {!isLoggedIn && location.pathname !== '/register' && (
                        <li><Link to="/register">Register</Link></li>
                    )}
                    {!isLoggedIn && location.pathname !== '/login' && (
                        <li><Link to="/login">Login</Link></li>
                    )}

                    {/* Show Logout link if the user is logged in */}
                    {isLoggedIn && (
                        <li>
                            <span onClick={handleLogout} className="logout-link">Logout</span>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
