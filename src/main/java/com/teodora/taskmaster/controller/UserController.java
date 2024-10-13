package com.teodora.taskmaster.controller;

import com.teodora.taskmaster.entity.User;
import com.teodora.taskmaster.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginUser) {
        User user = userService.getUserByUsername(loginUser.getUsername());
        if (user != null && new BCryptPasswordEncoder().matches(loginUser.getPassword(), user.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid credentials"));
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
