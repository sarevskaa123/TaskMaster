import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log("Fetched userId:", userId);

        if (userId) {
            axios.get(`http://localhost:8080/api/projects?userId=${userId}`)
                .then(response => {
                    console.log("Fetched projects:", response.data);
                    setProjects(response.data);
                })
                .catch(error => console.error('Error fetching projects:', error));
        } else {
            console.error('No userId found in localStorage.');
        }
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const newProject = { name, description };
        const username = localStorage.getItem('username');

        if (!username) {
            alert('No username found in localStorage. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/projects?username=${username}`, newProject);
            setProjects([...projects, response.data]);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/projects/${id}`);
            setProjects(projects.filter(project => project.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleProjectClick = (id) => {
        navigate(`/projects/${id}`);
    };

    return (
        <div className="projects-container">
            <h2>Your Projects</h2>
            <form className="projects-form" onSubmit={handleCreateProject}>
                <input
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Create Project</button>
            </form>
            <ul className="projects-list">
                {projects.length > 0 ? (
                    projects.map(project => (
                        <li key={project.id} className="project-item">
                            <div className="project-card" onClick={() => handleProjectClick(project.id)}>
                                <div className="project-card-content">
                                    <h3>{project.name}</h3>
                                    <p>{project.description}</p>
                                </div>
                                <button className="delete-button" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProject(project.id);
                                }}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No projects available</p>
                )}
            </ul>
        </div>
    );
}

export default Projects;
