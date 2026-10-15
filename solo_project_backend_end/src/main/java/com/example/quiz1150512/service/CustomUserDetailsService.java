package com.example.quiz1150512.service;

import com.example.quiz1150512.dao.UserDao;
import com.example.quiz1150512.entity.User;
import com.example.quiz1150512.security.service.UserDetailsImpl; // 確保 import 這行
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 【關鍵修正】: 不是 return user; 而是將 user 物件包裝後再回傳
        return UserDetailsImpl.build(user);
    }
}