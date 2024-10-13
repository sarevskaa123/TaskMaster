package com.teodora.taskmaster.service;

import com.teodora.taskmaster.entity.Project;
import com.teodora.taskmaster.entity.User;
import com.teodora.taskmaster.exception.ProjectNotFoundException;
import com.teodora.taskmaster.repository.ProjectRepository;
import com.teodora.taskmaster.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Project createProject(Project project, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        project.setOwner(owner);
        project.getUsers().add(owner);
        return projectRepository.save(project);
    }

    public List<Project> getProjectsForUser(Long userId) {
        return projectRepository.findProjectsByOwnerIdOrUsers_Id(userId);
    }

    public Project addUserToProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        project.getUsers().add(user);
        return projectRepository.save(project);
    }

    public void deleteProject(Long projectId) {
        if (projectRepository.existsById(projectId)) {
            projectRepository.deleteById(projectId);
        } else {
            throw new ProjectNotFoundException("Project with id " + projectId + " not found");
        }
    }

    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project with id " + projectId + " not found"));
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));

        existingProject.setName(updatedProject.getName());
        existingProject.setDescription(updatedProject.getDescription());

        return projectRepository.save(existingProject);
    }
}
