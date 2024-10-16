import React, { useState } from 'react';
import './App.css';
import TaskList from './TaskList';
import Header from './Header';
import axios from 'axios';

function App() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('LOW');
    const [deadline, setDeadline] = useState('');

    const handleCreateTask = async (e) => {
        e.preventDefault();

        const newTask = {
            title,
            description,
            status: "TODO",
            priority,
        };

        if (deadline) {
            newTask.deadline = deadline;
        }

        try {
            const username = localStorage.getItem('username');
            await axios.post(`http://localhost:8080/api/tasks?username=${username}`, newTask);
            window.location.reload();
        } catch (error) {
            console.error('Error creating task:', error.response?.data || error.message);
        }
    };

    return (
        <div className="App">
            <Header />
            <div className="container">
                <div className="form-section">
                    <h2>Add New Task</h2>
                    <form onSubmit={handleCreateTask}>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Task Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="form-row">
                            <label>
                                Priority:
                                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </label>
                            <label>
                                Due (Optional):
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                            </label>
                        </div>
                        <button type="submit">Add Task</button>
                    </form>
                </div>

                <div className="task-section">
                    <TaskList />
                </div>
            </div>
        </div>
    );
}

export default App;
