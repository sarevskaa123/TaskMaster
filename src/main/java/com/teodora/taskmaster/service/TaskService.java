package com.teodora.taskmaster.service;

import com.teodora.taskmaster.entity.Project;
import com.teodora.taskmaster.entity.Task;
import com.teodora.taskmaster.entity.User;
import com.teodora.taskmaster.repository.TaskRepository;
import com.teodora.taskmaster.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectService = projectService;
    }

    public Task createTask(Task task, String username, Long projectId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

        if (projectId != null) {
            Project project = projectService.getProjectById(projectId);
            task.setProject(project);  // Set the project to the task
        }

        task.setUser(user);
        return taskRepository.save(task);
    }

    public List<Task> getTasksForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        return taskRepository.findAllByUser(user);
    }

    public Task updateTask(Task task, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        if (task.getUser().equals(user)) {
            return taskRepository.save(task);
        }
        throw new IllegalArgumentException("User not authorized to update this task");
    }

    public void deleteTask(Long taskId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (task.getUser().equals(user)) {
            taskRepository.delete(task);
        } else {
            throw new IllegalArgumentException("User not authorized to delete this task");
        }
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        Project project = projectService.getProjectById(projectId);
        return taskRepository.findByProject(project);
    }
}
