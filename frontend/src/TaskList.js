import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const ItemTypes = {
    TASK: 'task',
};

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [filterDueDate, setFilterDueDate] = useState('ALL');

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            axios.get(`http://localhost:8080/api/tasks?username=${username}`)
                .then(response => {
                    setTasks(response.data);
                })
                .catch(error => {
                    console.error('Error fetching tasks:', error.response?.data || error.message);
                });
        }
    }, []);

    const handleDeleteTask = async (id) => {
        try {
            const username = localStorage.getItem('username');
            await axios.delete(`http://localhost:8080/api/tasks/${id}?username=${username}`);
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

    const moveTask = async (taskId, newStatus) => {
        const taskToMove = tasks.find(task => task.id === taskId);
        const updatedTask = { ...taskToMove, status: newStatus };

        setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));

        try {
            const username = localStorage.getItem('username');
            const payload = {
                ...updatedTask,
                projectId: taskToMove.project ? taskToMove.project.id : null
            };

            await axios.put(`http://localhost:8080/api/tasks/${taskId}?username=${username}`, payload);
            console.log('Task status updated successfully!');
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };


    return (
        <DndProvider backend={HTML5Backend}>
            <div className="task-filters">
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

            <div className="kanban-board">
                {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                    <TaskColumn
                        key={status}
                        status={status}
                        tasks={filterTasks().filter(task => task.status === status)}
                        moveTask={moveTask}
                        getPriorityColor={getPriorityColor}
                        isTaskOverdue={isTaskOverdue}
                        handleDeleteTask={handleDeleteTask}
                    />
                ))}
            </div>
        </DndProvider>
    );
}

function TaskColumn({ status, tasks, moveTask, getPriorityColor, isTaskOverdue, handleDeleteTask }) {
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
                    handleDeleteTask={handleDeleteTask}
                />
            ))}
        </div>
    );
}

function DraggableTask({ task, getPriorityColor, isTaskOverdue, handleDeleteTask }) {
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
            <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
        </div>
    );
}

export default TaskList;
