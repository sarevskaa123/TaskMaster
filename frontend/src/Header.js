import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
    const location = useLocation();

    return (
        <header className="App-header">
            <div className="header-title">Task Manager</div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>

                    {/* Show the Register link only if not on the Register page */}
                    {location.pathname !== '/register' && (
                        <li><Link to="/register">Register</Link></li>
                    )}

                    {/* Show the Login link only if not on the Login page */}
                    {location.pathname !== '/login' && (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
