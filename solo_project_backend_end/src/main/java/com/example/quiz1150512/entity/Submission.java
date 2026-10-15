package com.example.quiz1150512.entity;

public class Submission {
    public Long id;
    public Long quizId;
    public String answerText;
    public String optionCode;

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public void setOptionCode(String optionCode) {
        this.optionCode = optionCode;
    }

    public Long getId() {
        return id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public String getOptionCode() {
        return optionCode;
    }
}
