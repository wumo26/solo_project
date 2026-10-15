package com.example.quiz1150512.dao;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AnswerDao {
    @Insert("INSERT INTO answer (submission_id, question_id, answer_text) VALUES (#{submissionId}, #{questionId}, #{answerText})")
    void insertAnswer(@Param("submissionId") Long submissionId, @Param("questionId") Long questionId, @Param("answerText") String answerText);
}

