import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave } from 'react-icons/fa';
import './ProjectDetails.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

const ItemTypes = {
    TASK: 'task',
};

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
    const [newUsername, setNewUsername] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [filterDueDate, setFilterDueDate] = useState('ALL');

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

    const moveTask = async (taskId, newStatus) => {
        const taskToMove = tasks.find(task => task.id === taskId);
        const updatedTask = { ...taskToMove, status: newStatus };

        setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));

        try {
            const username = localStorage.getItem('username');
            await axios.put(`http://localhost:8080/api/tasks/${taskId}?username=${username}`, {
                ...updatedTask,
                projectId: taskToMove.project ? taskToMove.project.id : null
            });
            console.log('Task status updated successfully!');
        } catch (error) {
            console.error('Error updating task status:', error);
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

    const filterTasks = () => {
        let filteredTasks = tasks;

        if (filterPriority !== 'ALL') {
            filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
        }

        if (filterDueDate === 'UPCOMING') {
            filteredTasks = filteredTasks.filter(task => {
                const deadline = new Date(task.deadline);
                return deadline >= new Date();
            });
        } else if (filterDueDate === 'OVERDUE') {
            filteredTasks = filteredTasks.filter(task => isTaskOverdue(task.deadline));
        }

        return filteredTasks;
    };

    if (!project) return <p>Loading project details...</p>;

    const username = localStorage.getItem('username');
    const isOwner = project.owner && project.owner.username === username;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="project-details-container">
                <div className="project-header">
                    <div className="project-main-info">
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
                                {isEditing ? <FaSave onClick={handleEditProject}/> : <FaEdit/>}
                            </button>
                        )}
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
                            <>
                                <label className="project-description-label">Project Description</label>
                                <div className="project-description">{project.description}</div>
                            </>
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
                </div>

                {/* Project Members Section */}
                <div className="project-members">
                    <h3>Project Members</h3>
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

                {/* Task Filter Section */}
                <div className="filter-section">
                    <label>
                        Filter by Priority:
                        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                            <option value="ALL">All</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </label>

                    <label>
                        Filter by Due Date:
                        <select value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)}>
                            <option value="ALL">All</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </label>
                </div>

                {/* Kanban Board for Drag-and-Drop Tasks */}
                <div className="kanban-board">
                    {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                        <TaskColumn
                            key={status}
                            status={status}
                            tasks={filterTasks().filter(task => task.status === status)}
                            moveTask={moveTask}
                            getPriorityColor={getPriorityColor}
                            isTaskOverdue={isTaskOverdue}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
}

function TaskColumn({ status, tasks, moveTask, getPriorityColor, isTaskOverdue }) {
    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item) => {
            moveTask(item.id, status);
        },
    });

    return (
        <div className="kanban-column" ref={drop}>
            <h3>{status}</h3>
            {tasks.map((task, index) => (
                <DraggableTask
                    key={task.id}
                    task={task}
                    index={index}
                    getPriorityColor={getPriorityColor}
                    isTaskOverdue={isTaskOverdue}
                />
            ))}
        </div>
    );
}

function DraggableTask({ task, getPriorityColor, isTaskOverdue }) {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`task-list`}
            style={{
                borderLeft: `5px solid ${getPriorityColor(task.priority)}`,
                backgroundColor: isTaskOverdue(task.deadline) ? '#f8d7da' : '',
                opacity: isDragging ? 0.5 : 1,
            }}
        >
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
        </div>
    );
}

export default ProjectDetails;
