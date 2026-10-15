package com.example.quiz1150512.dao;

import com.example.quiz1150512.entity.ResponseDetail;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponseDetailDao extends CrudRepository<ResponseDetail, Long> {
    @Modifying
    @Query(value = "INSERT INTO response_detail (response_id, question_id, option_id, answer_text) VALUES (:responseId, :questionId, :optionId, :answerText)", nativeQuery = true)
    void insertDetail(@Param("responseId") Long responseId, @Param("questionId") Long questionId, @Param("optionId") Long optionId, @Param("answerText") String answerText);
    List<ResponseDetail> findByQuestionId(Long questionId);
    long countByQuestionIdAndOptionId(Long questionId, Long optionId);
    List<ResponseDetail> findByQuizResponse_Id(Long responseId);
    @Modifying
    @Query(value = "DELETE FROM response_detail WHERE response_id IN (SELECT id FROM quiz_response WHERE quiz_id = :quizId)", nativeQuery = true)
    void deleteByQuizId(@Param("quizId") Long quizId);
}