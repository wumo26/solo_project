package com.example.quiz1150512.dto;

import java.util.List;

public class QuestionAnswerRequest {

    private Long questionId;
    private List<Long> optionIds;
    private String answerText;

    public Long getQuestionId() {
        return questionId;
    }

    public List<Long> getOptionIds() {
        return optionIds;
    }

    public String getAnswerText() {
        return answerText;
    }
}
