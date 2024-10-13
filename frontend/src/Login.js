import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending login request with: ", { username, password });
            const response = await axios.post('http://localhost:8080/api/users/login', { username, password });

            // Expecting the response to include the userId and username
            if (response.data.id && response.data.username) {
                const userId = response.data.id;
                const loggedInUsername = response.data.username;

                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('username', loggedInUsername);
                localStorage.setItem('userId', userId);  // Ensure this is stored correctly
                navigate('/tasks');
            } else {
                alert('Login was successful, but no user details were returned.');
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            alert("Invalid username or password");
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="login-box p-5 shadow-lg">
                <h2 className="mb-4 text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
