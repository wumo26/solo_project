package com.example.quiz1150512.service;

import com.example.quiz1150512.dao.QuestionDao;
import com.example.quiz1150512.dao.QuestionOptionDao;
import com.example.quiz1150512.dao.QuizDao;
import com.example.quiz1150512.dao.QuizResponseDao;
import com.example.quiz1150512.dao.ResponseDetailDao;
import com.example.quiz1150512.dto.MyResponsesDto;
import com.example.quiz1150512.entity.ResponseDetail;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProfileResponseService {
    private final QuizResponseDao responses;
    private final ResponseDetailDao details;
    private final QuizDao quizzes;
    private final QuestionDao questions;
    private final QuestionOptionDao options;

    public ProfileResponseService(QuizResponseDao responses, ResponseDetailDao details, QuizDao quizzes,
                                  QuestionDao questions, QuestionOptionDao options) {
        this.responses = responses;
        this.details = details;
        this.quizzes = quizzes;
        this.questions = questions;
        this.options = options;
    }

    public List<MyResponsesDto> findByUser(String email) {
        return responses.findByUserEmail(email).stream().map(response -> {
            Map<Long, List<ResponseDetail>> answersByQuestion = new LinkedHashMap<>();
            for (ResponseDetail detail : details.findByQuizResponse_Id(response.getId())) {
                answersByQuestion.computeIfAbsent(detail.getQuestionId(), ignored -> new ArrayList<>()).add(detail);
            }

            List<MyResponsesDto.AnswerItem> answerItems = answersByQuestion.entrySet().stream()
                    .map(entry -> new MyResponsesDto.AnswerItem(
                            questions.findById(entry.getKey()).map(question -> question.getTitle()).orElse("題目已刪除"),
                            entry.getValue().stream().map(this::answerText).filter(text -> !text.isBlank()).reduce((first, second) -> first + "、" + second).orElse("未回答")
                    ))
                    .toList();

            String quizTitle = quizzes.findById(response.getQuizId()).map(quiz -> quiz.getTitle()).orElse("問卷已刪除");
            return new MyResponsesDto(response.getQuizId(), quizTitle, response.getSubmittedAt(), answerItems);
        }).toList();
    }

    private String answerText(ResponseDetail detail) {
        if (detail.getAnswerText() != null && !detail.getAnswerText().isBlank()) {
            return detail.getAnswerText();
        }
        return detail.getOptionId() == null ? "" : options.findById(detail.getOptionId())
                .map(option -> option.getOptionText()).orElse("");
    }
}