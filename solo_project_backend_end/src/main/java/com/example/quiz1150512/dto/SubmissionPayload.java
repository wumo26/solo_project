package com.example.quiz1150512.dto;

import java.util.List;

public class SubmissionPayload {

    private List<AnswerPayload> answers;

    // Getters and Setters
    public List<AnswerPayload> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerPayload> answers) {
        this.answers = answers;
    }
}
