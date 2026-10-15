package com.example.quiz1150512.config;

import com.example.quiz1150512.security.service.UserDetailsImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ApiAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;
    private final SecretKey secretKey;

    public ApiAuthenticationSuccessHandler(ObjectMapper objectMapper, @Value("${jwt.secret}") String secret) {
        this.objectMapper = objectMapper;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 從 Authentication 物件中提取角色
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Generate JWT Token
        String token = Jwts.builder()
                .setSubject(userDetails.getEmail())
                .claim("name", userDetails.getUsername()) // 注意：UserDetailsImpl 中的 getUsername() 對應到 User 的 name
                .claim("userId", userDetails.getId())
                .claim("roles", roles) // 將角色加入到 claims 中
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
                .signWith(secretKey)
                .compact();

        // Prepare the JSON response for the frontend
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", userDetails.getId());
        userResponse.put("email", userDetails.getEmail());
        userResponse.put("name", userDetails.getUsername());

        Map<String, Object> data = new HashMap<>();
        data.put("message", "Login successful");
        data.put("token", token); // The token the frontend is waiting for!
        data.put("user", userResponse);

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(objectMapper.writeValueAsString(data));
        response.getWriter().flush();
    }
}
