package com.example.quiz1150512.dto;

import com.example.quiz1150512.constants.ValidationMsg;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class QuizRequest {

    // create 和 update 公用，但只有 update 時此屬性才會有值
    private Long id;

    @NotBlank(message = ValidationMsg.QUIZ_TITLE_REQUIRED)
    private String title;

    private String description;

    @NotNull(message = ValidationMsg.QUIZ_START_DATE_REQUIRED)
    @JsonProperty("start_date")
    private LocalDate startDate;

    @NotNull(message = ValidationMsg.QUIZ_END_DATE_REQUIRED)
    @JsonProperty("end_date")
    private LocalDate endDate;

    @NotNull(message = ValidationMsg.QUIZ_PUBLISHED_REQUIRED)
    @JsonProperty("is_published")
    private Boolean isPublished = false;

    @NotEmpty(message = ValidationMsg.QUIZ_QUESTION_REQUIRED)
    @Valid
    private List<QuestionRequest> questions;

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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public List<QuestionRequest> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionRequest> questions) {
        this.questions = questions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
