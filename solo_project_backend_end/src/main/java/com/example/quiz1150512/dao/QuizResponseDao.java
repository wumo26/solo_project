package com.example.quiz1150512.dao;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.quiz1150512.entity.QuizResponse;

@Repository
public interface QuizResponseDao extends JpaRepository<QuizResponse, Long> {
    boolean existsByQuizIdAndUserEmail(Long quizId, String userEmail);
    Optional<QuizResponse> findByQuizIdAndUserEmail(Long quizId, String userEmail);
    List<QuizResponse> findByQuizId(Long quizId);
    List<QuizResponse> findByUserEmail(String userEmail);
    long countByQuizId(Long quizId);
    @Modifying
    @Query(value = "DELETE FROM quiz_response WHERE quiz_id = :quizId", nativeQuery = true)
    void deleteByQuizId(@Param("quizId") Long quizId);
}