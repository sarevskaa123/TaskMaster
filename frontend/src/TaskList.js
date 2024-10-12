import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function TaskList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH':
                return 'red';
            case 'MEDIUM':
                return 'orange';
            case 'LOW':
                return 'green';
            default:
                return 'gray';
        }
    };

    const isTaskOverdue = (deadline) => {
        if (!deadline) return false;
        const currentDate = new Date();
        const taskDeadline = new Date(deadline);
        return currentDate > taskDeadline;
    };

    return (
        <div>
            <ul>
                {tasks.map((task, index) => (
                    <li key={task.id} className={`task-list ${index % 2 === 0 ? '' : 'task-list-alt'}`} style={{
                        borderLeft: `5px solid ${getPriorityColor(task.priority)}`,
                        backgroundColor: isTaskOverdue(task.deadline) ? '#f8d7da' : ''
                    }}>
                        <div style={{ flexGrow: 1 }}>
                            <h2>{task.title}</h2>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <p>Priority: <span style={{ color: getPriorityColor(task.priority) }}>{task.priority}</span></p>
                            <p>Created At: {new Date(task.createdAt).toLocaleDateString()}</p>
                            {task.deadline && (
                                <p>
                                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                                    {isTaskOverdue(task.deadline) && <span style={{ color: 'red' }}> (Overdue)</span>}
                                </p>
                            )} {/* Only display if deadline is set */}
                        </div>
                        <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;
