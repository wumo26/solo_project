package com.example.quiz1150512.dto;

import java.util.List;

import com.example.quiz1150512.entity.Quiz;

public class QuizDetailDto {

    private Long id;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private Boolean isPublished;
    private List<QuestionResponse> questions;

    // fromEntity factory method
    public static QuizDetailDto fromEntity(Quiz quiz, List<QuestionResponse> questions) {
        QuizDetailDto dto = new QuizDetailDto();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        if (quiz.getStartDate() != null) {
            dto.setStartDate(quiz.getStartDate().toString());
        }
        if (quiz.getEndDate() != null) {
            dto.setEndDate(quiz.getEndDate().toString());
        }
        dto.setIsPublished(quiz.getIsPublished());
        dto.setQuestions(questions);
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public List<QuestionResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionResponse> questions) {
        this.questions = questions;
    }
}
