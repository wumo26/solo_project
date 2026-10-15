package com.example.quiz1150512;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Spring Boot 應用程式主進入點。
 *
 * @SpringBootApplication: 啟用 Spring Boot 的自動設定、元件掃描等核心功能。
 *
 * @EnableJpaRepositories: 啟用 Spring Data JPA 的 Repository 掃描功能。 basePackages -
 * 指定要掃描的套件路徑，這裡指向 JPA Repository 的位置。
 *
 * @MapperScan: 啟用 MyBatis 的 Mapper 掃描功能。 basePackages - 指定要掃描的套件路徑，指向 MyBatis
 * Mapper 的位置。 annotationClass - 指定只掃描帶有 @Mapper 註解的介面。
 *
 * 透過這兩個註解，我們明確地分離了 JPA 和 MyBatis 的掃描範圍，從而解決了 Bean 衝突的問題。
 */
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.quiz1150512.dao")
@MapperScan(basePackages = "com.example.quiz1150512.dao", annotationClass = Mapper.class)
public class Quiz1150512Application {

    public static void main(String[] args) {
        SpringApplication.run(Quiz1150512Application.class, args);
    }
}
