package com.teodora.taskmaster.controller;

import com.teodora.taskmaster.entity.User;
import com.teodora.taskmaster.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.usernameExists(user.getUsername())) {
            return ResponseEntity.status(400).body("Username is already taken");
        }

        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.status(400).body("Email is already registered");
        }

        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginUser) {
        User user = userService.getUserByUsername(loginUser.getUsername());
        if (user != null && new BCryptPasswordEncoder().matches(loginUser.getPassword(), user.getPassword())) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
