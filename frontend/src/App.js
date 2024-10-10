import React, { useState } from 'react';
import './App.css';
import TaskList from './TaskList';
import Header from './Header';
import axios from 'axios';

function App() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('LOW');
    const [deadline, setDeadline] = useState('');  // New state for deadline

    const handleCreateTask = async (e) => {
        e.preventDefault();

        const newTask = {
            title,
            description,
            status: "TODO",
            priority,
        };

        // Add deadline if it's set
        if (deadline) {
            newTask.deadline = deadline;
        }

        try {
            await axios.post('http://localhost:8080/api/tasks', newTask);
            window.location.reload();
        } catch (error) {
            console.error('Error creating task:', error.response?.data || error.message);
        }
    };

    return (
        <div className="App">
            <Header />
            <div className="container">
                <div className="task-section">
                    <TaskList />
                </div>
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
                        <div className="form-row">  {/* New wrapper for priority and date */}
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
                                    type="date"  // Changed to date to remove time input
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                            </label>
                        </div>
                        <button type="submit">Add Task</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
