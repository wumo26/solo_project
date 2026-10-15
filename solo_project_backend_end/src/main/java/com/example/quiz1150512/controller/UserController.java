package com.example.quiz1150512.controller;

import com.example.quiz1150512.dto.ApiResponse;
import com.example.quiz1150512.dto.UserProfileResponse;
import com.example.quiz1150512.dto.UserRequest;
import com.example.quiz1150512.dto.MyResponsesDto;
import com.example.quiz1150512.service.ProfileResponseService;
import com.example.quiz1150512.entity.User;
import com.example.quiz1150512.security.service.UserDetailsImpl;
import com.example.quiz1150512.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired private UserService userService;
    @Autowired private ProfileResponseService profileResponseService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest) {
        try {
            User newUser = userService.register(userRequest);
            return ResponseEntity.ok(new ApiResponse(true, "Registration successful."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getEmail()));
    }

    @GetMapping("/me/responses")
    public ResponseEntity<java.util.List<MyResponsesDto>> getMyResponses(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(profileResponseService.findByUser(userDetails.getEmail()));
    }
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                               @RequestBody UserRequest request) {
        try {
            return ResponseEntity.ok(userService.updateProfile(userDetails.getEmail(), request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}