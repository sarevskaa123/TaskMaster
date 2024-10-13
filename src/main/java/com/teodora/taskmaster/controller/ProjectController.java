package com.teodora.taskmaster.controller;

import com.teodora.taskmaster.entity.Project;
import com.teodora.taskmaster.entity.Task;
import com.teodora.taskmaster.service.ProjectService;
import com.teodora.taskmaster.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;

    public ProjectController(ProjectService projectService, TaskService taskService) {
        this.projectService = projectService;
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(@RequestParam Long userId) {
        List<Project> projects = projectService.getProjectsForUser(userId);
        return ResponseEntity.ok(projects);
    }

    @PostMapping("/{projectId}/users")
    public ResponseEntity<Project> addUserToProject(@PathVariable Long projectId, @RequestParam String username) {
        Project updatedProject = projectService.addUserToProject(projectId, username);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<Task>> getTasksForProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        Project project = projectService.updateProject(id, updatedProject);
        return ResponseEntity.ok(project);
    }
}
