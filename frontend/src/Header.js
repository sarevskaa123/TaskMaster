import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="App-header">
            <div className="header-title">Task Manager</div>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/tasks">Tasks</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Register</a></li>
                </ul>
        </nav>
</header>
)
    ;
}

export default Header;
