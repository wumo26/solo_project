package com.example.quiz1150512.dto;
import java.time.LocalDateTime;
import java.util.List;
public record MyResponsesDto(Long quizId, String quizTitle, LocalDateTime submittedAt, List<AnswerItem> answers) {
  public record AnswerItem(String questionTitle, String answer) {}
}