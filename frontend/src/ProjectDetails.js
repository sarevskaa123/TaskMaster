import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaEdit, FaSave } from 'react-icons/fa';  // Icons for edit and save
import './ProjectDetails.css';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('LOW');
    const [deadline, setDeadline] = useState('');
    const [showForm, setShowForm] = useState(false); // Manage form visibility
    const [isEditing, setIsEditing] = useState(false); // For editing mode

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/${id}`)
            .then(response => {
                setProject(response.data);
            })
            .catch(error => console.error('Error fetching project details:', error));

        axios.get(`http://localhost:8080/api/projects/${id}/tasks`)
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const newTask = {
            title,
            description,
            status: "TODO",
            priority,
            deadline: deadline || null,
            projectId: id,
        };

        try {
            const username = localStorage.getItem('username');
            await axios.post(`http://localhost:8080/api/tasks?username=${username}&projectId=${id}`, newTask);

            axios.get(`http://localhost:8080/api/projects/${id}/tasks`)
                .then(response => {
                    setTasks(response.data);
                })
                .catch(error => console.error('Error fetching tasks after adding new task:', error));

            setTitle('');
            setDescription('');
            setPriority('LOW');
            setDeadline('');
            setShowForm(false);
        } catch (error) {
            console.error('Error creating task:', error.response?.data || error.message);
        }
    };

    const handleEditProject = async () => {
        try {
            const updatedProject = {
                id: project.id,
                name: project.name,
                description: project.description,
            };

            await axios.put(`http://localhost:8080/api/projects/${id}`, updatedProject);

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating project:', error.response?.data || error.message);
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

    if (!project) return <p>Loading project details...</p>;

    const username = localStorage.getItem('username');
    const isOwner = project.owner && project.owner.username === username;

    return (
        <div className="project-details-container">
            <div className="project-header">
                {isEditing ? (
                    <div className="edit-fields">
                        <label htmlFor="project-name">Project Title</label>
                        <input
                            id="project-name"
                            type="text"
                            value={project.name}
                            onChange={(e) => setProject({ ...project, name: e.target.value })}
                        />
                    </div>
                ) : (
                    <h2>{project.name}</h2>
                )}

                {isOwner && (
                    <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
                        {isEditing ? <FaSave onClick={handleEditProject} /> : <FaEdit />}
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="edit-fields">
                    <label htmlFor="project-description">Project Description</label>
                    <textarea
                        id="project-description"
                        value={project.description}
                        onChange={(e) => setProject({ ...project, description: e.target.value })}
                    />
                </div>
            ) : (
                <p>{project.description}</p>
            )}

            {!showForm && (
                <button className="toggle-button" onClick={() => setShowForm(true)}>
                    Add New Task
                </button>
            )}

            {showForm && (
                <div className="form-section">
                    <h3>Add New Task</h3>
                    <form onSubmit={handleCreateTask}>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Task Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
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
            )}

            <h3>Tasks for this project</h3>
            <ul className="tasks-list">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <li key={task.id} className={`task-list ${index % 2 === 0 ? '' : 'task-list-alt'}`} style={{
                            borderLeft: `5px solid ${getPriorityColor(task.priority)}`,
                            backgroundColor: isTaskOverdue(task.deadline) ? '#f8d7da' : ''
                        }}>
                            <div style={{ flexGrow: 1 }}>
                                <h2>{task.title}</h2>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <p>Priority: <span style={{ color: getPriorityColor(task.priority) }}>{task.priority}</span></p>
                                {task.deadline && (
                                    <p>
                                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                                        {isTaskOverdue(task.deadline) && <span style={{ color: 'red' }}> (Overdue)</span>}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No tasks available for this project</p>
                )}
            </ul>
        </div>
    );
}

export default ProjectDetails;
