package com.example.quiz1150512.service;

import com.example.quiz1150512.dao.UserDao;
import com.example.quiz1150512.dto.UserProfileResponse;
import com.example.quiz1150512.dto.UserRequest;
import com.example.quiz1150512.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {
    @Autowired private UserDao userDao;
    @Autowired private PasswordEncoder passwordEncoder;

    public User register(UserRequest request) {
        if (userDao.findByPhone(request.getPhone()).isPresent()) throw new IllegalArgumentException("Phone number is already registered.");
        if (userDao.findByEmail(request.getEmail()).isPresent()) throw new IllegalArgumentException("Email is already registered.");
        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        return userDao.save(user);
    }

    public UserProfileResponse getProfile(String email) {
        return toProfile(userDao.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found.")));
    }

    public UserProfileResponse updateProfile(String email, UserRequest request) {
        User user = userDao.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (!user.getPhone().equals(request.getPhone()) && userDao.findByPhone(request.getPhone()).isPresent()) {
            throw new IllegalArgumentException("Phone number is already registered.");
        }
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAge(request.getAge());
        return toProfile(userDao.save(user));
    }

    private UserProfileResponse toProfile(User user) {
        return new UserProfileResponse(user.getId(), user.getName(), user.getPhone(), user.getEmail(), user.getAge());
    }
}