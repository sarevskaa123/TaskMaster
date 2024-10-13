package com.teodora.taskmaster.controller;

import com.teodora.taskmaster.entity.Project;
import com.teodora.taskmaster.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project, @RequestParam String username) {
        Project createdProject = projectService.createProject(project, username);
        return ResponseEntity.ok(createdProject);
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
}
