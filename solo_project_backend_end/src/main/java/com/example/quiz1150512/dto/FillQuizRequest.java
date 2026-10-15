package com.example.quiz1150512.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class FillQuizRequest {

    @NotNull
    private Integer quizId;

    @NotEmpty
    private List<QuestionAnswerRequest> answers;

    public Integer getQuizId() {
        return quizId;
    }

    public List<QuestionAnswerRequest> getAnswers() {
        return answers;
    }
}
