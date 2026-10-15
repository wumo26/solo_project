package com.example.quiz1150512.service;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ???
import org.springframework.util.CollectionUtils;

import com.example.quiz1150512.dao.QuestionDao; // ???
import com.example.quiz1150512.dao.QuestionOptionDao;
import com.example.quiz1150512.dao.QuizDao;
import com.example.quiz1150512.dao.QuizResponseDao;
import com.example.quiz1150512.dao.ResponseDetailDao;
import com.example.quiz1150512.dao.UserDao;
import com.example.quiz1150512.dto.OptionRequest;
import com.example.quiz1150512.dto.OptionResponse;
import com.example.quiz1150512.dto.QuestionRequest;
import com.example.quiz1150512.dto.QuestionResponse;
import com.example.quiz1150512.dto.OptionStatDto;
import com.example.quiz1150512.dto.QuizDetailDto;
import com.example.quiz1150512.dto.QuestionStatDto;
import com.example.quiz1150512.dto.QuizRequest;
import com.example.quiz1150512.dto.QuizResponseDto;
import com.example.quiz1150512.dto.QuizStatResponse;
import com.example.quiz1150512.entity.Question;
import com.example.quiz1150512.entity.QuestionOption;
import com.example.quiz1150512.entity.Quiz;
import com.example.quiz1150512.enums.QuestionType;
import com.example.quiz1150512.security.service.UserDetailsImpl;

@Service
public class QuizService {

    @Autowired
    private QuizDao quizDao;
    @Autowired
    private QuestionDao questionDao;
    @Autowired
    private QuestionOptionDao questionOptionDao;
    @Autowired
    private QuizResponseDao quizResponseDao;
    @Autowired
    private ResponseDetailDao responseDetailDao;
    @Autowired
    private UserDao userDao;

    @Transactional(rollbackFor = Exception.class)
    public Quiz createQuiz(QuizRequest request) {
        validateQuizTime(request.getStartDate(), request.getEndDate());
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setStartDate(request.getStartDate());
        quiz.setEndDate(request.getEndDate());
        quiz.setIsPublished(Boolean.TRUE.equals(request.getIsPublished()));
        quiz.setIsClosed(false);
        quiz.setIsPinned(false);
        UserDetailsImpl creator = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        quiz.setCreatorId(creator.getId());
        quiz = quizDao.save(quiz);
        saveQuestionsAndOptions(quiz.getId(), request.getQuestions());
        return quiz;
    }

    @Transactional
    public void updateQuiz(QuizRequest request) {
        validateQuizTime(request.getStartDate(), request.getEndDate());
        Long id = request.getId();
        if (id == null || id <= 0) {
            throw new RuntimeException("Quiz not found with id: " + id);
        }
        Quiz quiz = new Quiz();
        quiz.setId(id);
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setStartDate(request.getStartDate());
        quiz.setEndDate(request.getEndDate());
        quiz.setIsPublished(Boolean.TRUE.equals(request.getIsPublished()));
        quiz.setIsClosed(false);
        quiz.setIsPinned(false);
        UserDetailsImpl creator = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        quiz.setCreatorId(creator.getId());
        quizDao.save(quiz);
        questionOptionDao.deleteByQuizId(id);
        questionDao.deleteByQuizId(id);
        saveQuestionsAndOptions(id, request.getQuestions());
    }

    @Transactional(readOnly = true)
    public List<QuizResponseDto> getAllQuizzesWithoutQuestions() {
        return quizDao.findAllByOrderByIsPinnedDescCreatedAtDesc().stream()
                .map(this::toQuizResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizResponseDto> getPublicQuizzes() {
        return quizDao.findByIsPublishedTrueOrIsClosedTrueOrderByIsPinnedDescCreatedAtDesc().stream()
                .map(this::toQuizResponseDto)
                .collect(Collectors.toList());
    }

    private QuizResponseDto toQuizResponseDto(Quiz quiz) {
        QuizResponseDto dto = new QuizResponseDto();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setStartDate(quiz.getStartDate());
        dto.setEndDate(quiz.getEndDate());
        dto.setIsPublished(Boolean.TRUE.equals(quiz.getIsPublished()));
        dto.setIsClosed(Boolean.TRUE.equals(quiz.getIsClosed()));
        dto.setIsPinned(Boolean.TRUE.equals(quiz.getIsPinned()));
        dto.setCreatorId(quiz.getCreatorId());
        dto.setCreatorName(quiz.getCreatorId() == null ? "Unknown creator" : userDao.findById(quiz.getCreatorId()).map(u -> u.getName()).orElse("Unknown creator"));
        dto.setQuestions(null);
        return dto;
    }
    @Transactional(readOnly = true)
    public QuizDetailDto getPublicQuizWithDetails(Long quizId) {
        Quiz quiz = quizDao.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        if (!Boolean.TRUE.equals(quiz.getIsPublished()) && !Boolean.TRUE.equals(quiz.getIsClosed())) {
            throw new org.springframework.security.access.AccessDeniedException("This quiz is not public");
        }
        return QuizDetailDto.fromEntity(quiz, getQuestionsByQuizId(quizId));
    }
    @Transactional(readOnly = true)
    public QuizDetailDto getQuizWithDetails(Long quizId) {
        Quiz quiz = quizDao.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        List<QuestionResponse> questions = getQuestionsByQuizId(quizId);
        return QuizDetailDto.fromEntity(quiz, questions);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByQuizId(Long quizId) {
        List<Question> questions = questionDao.findByQuizId(quizId);
        return questions.stream().map(this::convertToQuestionDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizStatResponse getPublicQuizStatistics(Long quizId) {
        Quiz quiz = quizDao.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        if (!Boolean.TRUE.equals(quiz.getIsPublished()) && !Boolean.TRUE.equals(quiz.getIsClosed())) {
            throw new org.springframework.security.access.AccessDeniedException("This quiz is not public");
        }
        return getQuizStatistics(quizId);
    }
    @Transactional(readOnly = true)
    public QuizStatResponse getQuizStatistics(Long quizId) {
        Quiz quiz = quizDao.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        long totalRespondents = quizResponseDao.countByQuizId(quizId);

        List<QuestionStatDto> questionStats = questionDao.findByQuizId(quizId).stream()
                .map(question -> buildQuestionStatistics(question, totalRespondents))
                .collect(Collectors.toList());

        QuizStatResponse response = new QuizStatResponse();
        response.setQuizId(quizId);
        response.setQuizTitle(quiz.getTitle());
        response.setTotalRespondents(totalRespondents);
        response.setQuestionStats(questionStats);
        return response;
    }

    private QuestionStatDto buildQuestionStatistics(Question question, long totalRespondents) {
        QuestionStatDto stats = new QuestionStatDto();
        stats.setQuestionId(question.getId());
        stats.setQuestionNum(question.getQuestionNum());
        stats.setQuestionTitle(question.getTitle());
        stats.setQuestionType(question.getType());

        if (question.getType() == QuestionType.TEXT) {
            stats.setTextAnswers(responseDetailDao.findByQuestionId(question.getId()).stream()
                    .map(com.example.quiz1150512.entity.ResponseDetail::getAnswerText)
                    .filter(answer -> answer != null && !answer.isBlank())
                    .collect(Collectors.toList()));
            return stats;
        }

        List<OptionStatDto> optionStats = questionOptionDao.findByQuestionId(question.getId()).stream()
                .map(option -> {
                    long selectedCount = responseDetailDao.countByQuestionIdAndOptionId(question.getId(), option.getId());
                    BigDecimal percentage = totalRespondents == 0
                            ? BigDecimal.ZERO
                            : BigDecimal.valueOf(selectedCount)
                                    .multiply(BigDecimal.valueOf(100))
                                    .divide(BigDecimal.valueOf(totalRespondents), 2, RoundingMode.HALF_UP);
                    return new OptionStatDto(option.getId(), option.getOptionCode(), option.getOptionText(),
                            selectedCount, percentage);
                })
                .collect(Collectors.toList());
        stats.setOptionStats(optionStats);
        return stats;
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteQuizzes(List<Long> ids) {
        if (CollectionUtils.isEmpty(ids)) {
            return;
        }
        for (Long quizId : ids) {
            if (quizId == null || !quizDao.existsById(quizId)) {
                continue;
            }
            responseDetailDao.deleteByQuizId(quizId);
            quizResponseDao.deleteByQuizId(quizId);
            questionOptionDao.deleteByQuizId(quizId);
            questionDao.deleteByQuizId(quizId);
            quizDao.deleteById(quizId);
        }
    }

    @Transactional
    public void submitQuiz(Long quizId, com.example.quiz1150512.dto.SubmissionPayload payload) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = userDetails.getEmail();
        com.example.quiz1150512.entity.QuizResponse quizResponse = new com.example.quiz1150512.entity.QuizResponse();
        quizResponse.setQuizId(quizId);
        quizResponse.setUserId(userDetails.getId());
        quizResponse.setUserEmail(userEmail);
        quizResponse.setSubmittedAt(java.time.LocalDateTime.now());
        quizResponse = quizResponseDao.save(quizResponse);
        for (com.example.quiz1150512.dto.AnswerPayload answerPayload : payload.getAnswers()) {
            if (answerPayload.getOptionIds() != null && !answerPayload.getOptionIds().isEmpty()) {
                for (Long optionId : answerPayload.getOptionIds()) {
                    com.example.quiz1150512.entity.ResponseDetail detail = new com.example.quiz1150512.entity.ResponseDetail();
                    detail.setQuizResponse(quizResponse);
                    detail.setQuestionId(answerPayload.getQuestionId());
                    detail.setOptionId(optionId);
                    responseDetailDao.save(detail);
                }
            } else if (answerPayload.getAnswerText() != null && !answerPayload.getAnswerText().isBlank()) {
                com.example.quiz1150512.entity.ResponseDetail detail = new com.example.quiz1150512.entity.ResponseDetail();
                detail.setQuizResponse(quizResponse);
                detail.setQuestionId(answerPayload.getQuestionId());
                detail.setAnswerText(answerPayload.getAnswerText());
                responseDetailDao.save(detail);
            }
        }
    }
    private void saveQuestionsAndOptions(Long quizId, List<QuestionRequest> questionRequests) {
        for (QuestionRequest qReq : questionRequests) {
            validateQuestionOptions(qReq);
            Question question = new Question();
            question.setQuizId(quizId);
            question.setQuestionNum(qReq.getQuestionNum());
            question.setTitle(qReq.getTitle());
            question.setType(qReq.getType());
            question.setIsRequired(qReq.getIsRequired());
            questionDao.save(question);
            Long newQuestionId = question.getId();
            if (!CollectionUtils.isEmpty(qReq.getOptions())) {
                for (OptionRequest oReq : qReq.getOptions()) {
                    questionOptionDao.insertOption(newQuestionId, oReq.getOptionCode(), oReq.getOptionText());
                }
            }
        }
    }

    private QuestionResponse convertToQuestionDto(Question question) {
        QuestionResponse qDto = new QuestionResponse();
        qDto.setId(question.getId());
        qDto.setQuestionNum(question.getQuestionNum());
        qDto.setTitle(question.getTitle());
        qDto.setType(question.getType());
        qDto.setIsRequired(question.getIsRequired());
        List<QuestionOption> options = questionOptionDao.findByQuestionId(question.getId());
        List<OptionResponse> oDtos = options.stream().map(o -> {
            OptionResponse oDto = new OptionResponse();
            oDto.setId(o.getId());
            oDto.setOptionCode(o.getOptionCode());
            oDto.setOptionText(o.getOptionText());
            return oDto;
        }).collect(Collectors.toList());
        qDto.setOptions(oDtos);
        return qDto;
    }

    private void validateQuizTime(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("???????????????????????????????????????????????");
        }
    }

    private void validateQuestionOptions(QuestionRequest qReq) {
        if (qReq.getType() != QuestionType.TEXT) {
            if (qReq.getOptions() == null || qReq.getOptions().isEmpty()) {
                throw new IllegalArgumentException(
                        "Question #" + qReq.getQuestionNum() + " requires at least one option!!");
            }
        }
    }

    @Transactional
    public void publishQuiz(Long id, boolean isPublished) {
        Quiz quiz = quizDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quiz.setIsPublished(isPublished);
        quiz.setIsClosed(false);
        quizDao.save(quiz);
    }

    @Transactional(readOnly = true)
    public List<QuizResponseDto> getMyCreatedQuizzes() {
        UserDetailsImpl user = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return quizDao.findByCreatorId(user.getId()).stream().map(quiz -> {
            QuizResponseDto dto = new QuizResponseDto(); dto.setId(quiz.getId()); dto.setTitle(quiz.getTitle()); dto.setDescription(quiz.getDescription()); dto.setStartDate(quiz.getStartDate()); dto.setEndDate(quiz.getEndDate()); dto.setIsPublished(quiz.getIsPublished()); dto.setCreatorId(user.getId()); dto.setCreatorName(user.getUsername()); return dto;
        }).collect(Collectors.toList());
    }
    @Transactional
    public void closeQuiz(Long id) {
        Quiz quiz = quizDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quiz.setIsPublished(false);
        quiz.setIsClosed(true);
        quizDao.save(quiz);
    }

    @Transactional
    public void setPinned(Long id, boolean isPinned) {
        Quiz quiz = quizDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quiz.setIsPinned(isPinned);
        quizDao.save(quiz);
    }
}

