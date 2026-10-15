package com.example.quiz1150512.dto;

public class SubmissionRequest {

    private Long quizId;
    private String personName; // 【修正】新增 personName 欄位

    // quizId 的 getter 和 setter
    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    // 【修正】新增 personName 的 getter 和 setter
    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }
}