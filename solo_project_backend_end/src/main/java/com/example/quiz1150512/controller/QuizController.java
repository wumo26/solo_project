package com.example.quiz1150512.controller;

import com.example.quiz1150512.dto.ApiResponse;
import com.example.quiz1150512.dto.DeleteRequest;
import com.example.quiz1150512.dto.QuestionResponse;
import com.example.quiz1150512.dto.QuizDetailDto;
import com.example.quiz1150512.dto.QuizRequest;
import com.example.quiz1150512.dto.QuizResponseDto;
import com.example.quiz1150512.dto.QuizStatResponse;
import com.example.quiz1150512.dto.SubmissionPayload;
import com.example.quiz1150512.entity.Quiz;
import com.example.quiz1150512.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) { this.quizService = quizService; }

    @PostMapping("/quizzes")
    public ResponseEntity<Quiz> createQuiz(@Valid @RequestBody QuizRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.createQuiz(request));
    }

    @PutMapping("/quizzes")
    public ResponseEntity<ApiResponse> updateQuiz(@Valid @RequestBody QuizRequest request) {
        quizService.updateQuiz(request);
        return ResponseEntity.ok(ApiResponse.success("done"));
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<QuizResponseDto>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzesWithoutQuestions());
    }

    @GetMapping("/public/quizzes")
    public ResponseEntity<List<QuizResponseDto>> getPublicQuizzes() {
        return ResponseEntity.ok(quizService.getPublicQuizzes());
    }

    @GetMapping("/public/quizzes/{id}")
    public ResponseEntity<QuizDetailDto> getPublicQuizDetails(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getPublicQuizWithDetails(id));
    }
    @GetMapping("/quizzes/mine")
    public ResponseEntity<List<QuizResponseDto>> getMyCreatedQuizzes() {
        return ResponseEntity.ok(quizService.getMyCreatedQuizzes());
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizDetailDto> getQuizDetails(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizWithDetails(id));
    }

    @GetMapping("/quizzes/{id}/questions")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByQuizId(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuestionsByQuizId(id));
    }

    @GetMapping("/public/quizzes/{id}/answers")
    public ResponseEntity<QuizStatResponse> getPublicQuizAnswers(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getPublicQuizStatistics(id));
    }
    @GetMapping("/quizzes/{id}/statistics")
    public ResponseEntity<QuizStatResponse> getQuizStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizStatistics(id));
    }

    @DeleteMapping("/quizzes")
    public ResponseEntity<ApiResponse> deleteQuizzes(@RequestBody DeleteRequest request) {
        quizService.deleteQuizzes(request.getIds());
        return ResponseEntity.ok(ApiResponse.success("done"));
    }

    @PostMapping("/quizzes/{id}/publish")
    public ResponseEntity<Void> publishQuiz(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        quizService.publishQuiz(id, payload.getOrDefault("isPublished", false));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/quizzes/{id}/close")
    public ResponseEntity<Void> closeQuiz(@PathVariable Long id) {
        quizService.closeQuiz(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/quizzes/{id}/pin")
    public ResponseEntity<Void> setPinned(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        quizService.setPinned(id, payload.getOrDefault("isPinned", false));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/quizzes/{id}/submit")
    public ResponseEntity<ApiResponse> submitQuiz(@PathVariable Long id, @RequestBody SubmissionPayload payload) {
        quizService.submitQuiz(id, payload);
        return ResponseEntity.ok(ApiResponse.success("done"));
    }
}
