package com.teodora.taskmaster.controller;

import com.teodora.taskmaster.entity.Task;
import com.teodora.taskmaster.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, @RequestParam String username) {
        Task createdTask = taskService.createTask(task, username);
        return ResponseEntity.ok(createdTask);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getTasksForUser(@RequestParam String username) {
        List<Task> tasks = taskService.getTasksForUser(username);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task task, @RequestParam String username) {
        task.setId(taskId);
        Task updatedTask = taskService.updateTask(task, username);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId, @RequestParam String username) {
        taskService.deleteTask(taskId, username);
        return ResponseEntity.noContent().build();
    }
}
