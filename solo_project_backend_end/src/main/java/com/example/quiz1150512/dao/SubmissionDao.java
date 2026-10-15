package com.example.quiz1150512.dao;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;

@Mapper
public interface SubmissionDao {

    @Insert("INSERT INTO submission (quiz_id, person_name, submission_time) VALUES (#{quizId}, #{personName}, #{submissionTime})")
    void insertSubmission(
            @Param("quizId") Long quizId,
            @Param("personName") String personName,
            @Param("submissionTime") LocalDateTime submissionTime
    );

}
