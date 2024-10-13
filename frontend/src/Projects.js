import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Projects.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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
        const username = localStorage.getItem('username');  // Get the username from localStorage

        if (!username) {
            alert('No username found in localStorage. Please log in again.');
            return;
        }

        try {
            // Send the username as a query parameter
            const response = await axios.post(`http://localhost:8080/api/projects?username=${username}`, newProject);
            // Update the projects state without reloading the page
            setProjects([...projects, response.data]);
            // Reset the form fields after successful creation
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error creating project:', error);
        }
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
                        <li key={project.id}>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
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
