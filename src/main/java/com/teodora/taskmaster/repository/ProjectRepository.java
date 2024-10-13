package com.teodora.taskmaster.repository;

import com.teodora.taskmaster.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId);

    // Find projects where the user is either the owner or a member
    @Query("SELECT p FROM Project p WHERE p.owner.id = :userId OR :userId IN (SELECT u.id FROM p.users u)")
    List<Project> findProjectsByOwnerIdOrUsers_Id(Long userId);
}
