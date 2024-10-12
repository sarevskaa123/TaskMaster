import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/users/register', {
                username,
                password,
                firstName,
                lastName,
                email,
                role: 'USER'
            });
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error.response?.data || error.message);
            alert("Error during registration: " + (error.response?.data || error.message));
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="login-box p-5 shadow-lg">
                <h2 className="mb-4 text-center">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group mb-3">
                        <label>First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
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
                        <button type="submit" className="btn btn-primary btn-block">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
