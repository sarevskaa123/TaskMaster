package com.teodora.taskmaster.service;

import com.teodora.taskmaster.entity.Project;
import com.teodora.taskmaster.entity.User;
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
        return projectRepository.findByOwnerId(userId);
    }

    public Project addUserToProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        project.getUsers().add(user);
        return projectRepository.save(project);
    }
}
