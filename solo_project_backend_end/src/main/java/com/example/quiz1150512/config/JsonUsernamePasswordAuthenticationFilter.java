package com.example.quiz1150512.config;

import com.example.quiz1150512.dto.LoginRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // 檢查請求的 Content-Type 是否為 application/json
        if (!request.getContentType().contains("application/json")) {
            // 如果不是 JSON，可以選擇拋出異常或交給父類處理
            // 這裡我們直接拋出異常，因為我們的 API 只接受 JSON
            throw new IllegalArgumentException("請求必須是 application/json 格式");
        }

        try {
            // 從請求的輸入流 (InputStream) 中，讀取 JSON 資料，
            // 並使用 ObjectMapper 將其轉換為 LoginRequest 物件。
            LoginRequest loginRequest = objectMapper.readValue(request.getInputStream(), LoginRequest.class);

            // 從 LoginRequest 物件中，取得 email 和 password。
            // 這裡使用 getEmail() 是因為您的 LoginRequest.java 中定義的欄位是 email。
            String username = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            // 確保從請求中獲取的值不是 null
            if (username == null) {
                username = "";
            }
            if (password == null) {
                password = "";
            }

            // 將獲取到的 email 和 password，封裝成 Spring Security 內部使用的
            // UsernamePasswordAuthenticationToken 物件。
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);

            // 將這個 token 交給 Spring Security 的 AuthenticationManager 進行後續的驗證。
            // AuthenticationManager 會呼叫我們自訂的 UserDetailsService (也就是 UserService)
            // 去資料庫查詢使用者，並比對密碼。
            return this.getAuthenticationManager().authenticate(authToken);

        } catch (IOException e) {
            // 如果 JSON 解析失敗，拋出一個運行時異常。
            throw new RuntimeException("無法解析認證請求的 JSON", e);
        }
    }
}