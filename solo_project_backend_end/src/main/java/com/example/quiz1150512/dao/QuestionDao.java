package com.example.quiz1150512.dao;

import com.example.quiz1150512.entity.Question;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionDao extends JpaRepository<Question, Long> {

    @Query(value = "SELECT * FROM question WHERE quiz_id = ?1 ORDER BY question_num ASC", //
            nativeQuery = true)
    public List<Question> findByQuizId(Long quizId);

    @Modifying
    @Query(value = "DELETE FROM question WHERE quiz_id = ?1", nativeQuery = true)
    public void deleteByQuizId(Long quizId);
}
