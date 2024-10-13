package com.teodora.taskmaster.repository;

import com.teodora.taskmaster.entity.Project;
import com.teodora.taskmaster.entity.Task;
import com.teodora.taskmaster.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByUser(User user);
    List<Task> findByProject(Project project);
}
