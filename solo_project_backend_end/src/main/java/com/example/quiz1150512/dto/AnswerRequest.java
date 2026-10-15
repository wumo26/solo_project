package com.example.quiz1150512.dto;

import jakarta.validation.constraints.NotNull;

public class AnswerRequest {

    @NotNull
    private Long questionId;

    private String answerText;

    public @NotNull Long getQuestionId() {
        return questionId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setQuestionId(@NotNull Long questionId) {
        this.questionId = questionId;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }
}
