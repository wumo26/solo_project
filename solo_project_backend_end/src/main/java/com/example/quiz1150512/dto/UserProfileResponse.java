package com.example.quiz1150512.dto;

public class UserProfileResponse {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private Integer age;

    public UserProfileResponse(Long id, String name, String phone, String email, Integer age) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.age = age;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public Integer getAge() { return age; }
}