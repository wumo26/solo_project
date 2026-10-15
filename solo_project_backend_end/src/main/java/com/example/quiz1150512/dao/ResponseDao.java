package com.example.quiz1150512.dao;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.quiz1150512.entity.QuizResponse;

@Repository
public interface ResponseDao extends CrudRepository<QuizResponse, Long> {

    @Modifying
    @Query(value = "INSERT INTO quiz_response (quiz_id, user_id, submission_date) VALUES (:quizId, :userId, NOW())", nativeQuery = true)
    void insertQuizResponse(@Param("quizId") Integer quizId, @Param("userId") Integer userId);

    @Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
    Long getLastInsertedId();
}
