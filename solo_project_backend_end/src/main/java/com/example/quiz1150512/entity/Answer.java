package com.example.quiz1150512.entity;

public class Answer {
    public Long id;
    public Long submissionId;
    public String questionId;
    public String answerText;

    public void setId(Long id) {
        this.id = id;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public Long getId() {
        return id;
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public String getQuestionId() {
        return questionId;
    }

    public String getAnswerText() {
        return answerText;
    }
}
