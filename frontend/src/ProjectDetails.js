import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave } from 'react-icons/fa';
import './ProjectDetails.css';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('LOW');
    const [deadline, setDeadline] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskEditData, setTaskEditData] = useState({
        title: '',
        description: '',
        priority: 'LOW',
        deadline: ''
    });

    // State for adding users
    const [newUsername, setNewUsername] = useState('');

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

    const handleTaskEditClick = (task) => {
        setEditingTaskId(task.id);
        setTaskEditData({
            title: task.title,
            description: task.description,
            priority: task.priority,
            deadline: task.deadline
        });
    };

    const handleTaskEditChange = (e) => {
        const { name, value } = e.target;
        setTaskEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateTask = async (taskId) => {
        try {
            const username = localStorage.getItem('username');
            const updatedTask = {
                ...taskEditData,
                deadline: taskEditData.deadline || null,
            };
            await axios.put(`http://localhost:8080/api/tasks/${taskId}?username=${username}&projectId=${id}`, updatedTask);

            axios.get(`http://localhost:8080/api/projects/${id}/tasks`)
                .then(response => {
                    setTasks(response.data);
                })
                .catch(error => console.error('Error fetching tasks after updating:', error));

            setEditingTaskId(null);
        } catch (error) {
            console.error('Error updating task:', error.response?.data || error.message);
        }
    };

    const handleAddUser = async () => {
        if (newUsername.trim() === '') return;

        try {
            await axios.post(`http://localhost:8080/api/projects/${id}/users?username=${newUsername}`);
            setNewUsername('');
            axios.get(`http://localhost:8080/api/projects/${id}`)
                .then(response => {
                    setProject(response.data);
                })
                .catch(error => console.error('Error fetching project details:', error));
        } catch (error) {
            console.error('Error adding user to project:', error.response?.data || error.message);
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
            {/* Flex container for project info and members */}
            <div className="project-header-container">
                <div className="project-main-info">
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
                </div>

                {/* Project Members section */}
                <div className="project-members">
                    <h3>Project Members</h3>

                    {/* Add user to project */}
                    <div className="add-user-form">
                        <label htmlFor="addUser">Add user by username</label>
                        <input
                            type="text"
                            id="addUser"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                        <button onClick={handleAddUser}>Add User</button>
                    </div>
                    <ul className="members-list">
                        {project.users?.length > 0 ? (
                            project.users.map((user) => (
                                <li key={user.username}>{user.username}</li>
                            ))
                        ) : (
                            <p>No members assigned to this project</p>
                        )}
                    </ul>
                </div>
            </div>

            {/* Tasks section aligned under project info */}
            <div className="project-main-section">
                <div className="project-tasks">
                    <h3>Tasks for this project</h3>
                    <ul className="tasks-list">
                        {tasks.length > 0 ? (
                            tasks.map((task, index) => (
                                <li key={task.id} className={`task-list ${index % 2 === 0 ? '' : 'task-list-alt'}`} style={{
                                    borderLeft: `5px solid ${getPriorityColor(task.priority)}`,
                                    backgroundColor: isTaskOverdue(task.deadline) ? '#f8d7da' : ''
                                }}>
                                    {editingTaskId === task.id ? (
                                        <div className="task-edit-form">
                                            <label htmlFor="edit-title">Title:</label>
                                            <input
                                                id="edit-title"
                                                type="text"
                                                name="title"
                                                value={taskEditData.title}
                                                onChange={handleTaskEditChange}
                                            />
                                            <label htmlFor="edit-description">Description:</label>
                                            <textarea
                                                id="edit-description"
                                                name="description"
                                                value={taskEditData.description}
                                                onChange={handleTaskEditChange}
                                            />
                                            <div className="form-row">
                                                <label>
                                                    Priority:
                                                    <select name="priority" value={taskEditData.priority} onChange={handleTaskEditChange}>
                                                        <option value="LOW">Low</option>
                                                        <option value="MEDIUM">Medium</option>
                                                        <option value="HIGH">High</option>
                                                    </select>
                                                </label>
                                                <label>
                                                    Due (Optional):
                                                    <input
                                                        type="date"
                                                        name="deadline"
                                                        value={taskEditData.deadline}
                                                        onChange={handleTaskEditChange}
                                                    />
                                                </label>
                                            </div>
                                            <button onClick={() => handleUpdateTask(task.id)}>
                                                <FaSave /> Save
                                            </button>
                                        </div>
                                    ) : (
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
                                    )}
                                    <button onClick={() => handleTaskEditClick(task)}>
                                        <FaEdit /> Edit
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No tasks available for this project</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;

