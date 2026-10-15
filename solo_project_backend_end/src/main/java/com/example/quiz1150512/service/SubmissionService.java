package com.example.quiz1150512.service;

import com.example.quiz1150512.dao.SubmissionDao;
import com.example.quiz1150512.dto.SubmissionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionDao submissionDao;

    public void createSubmission(SubmissionRequest submissionRequest) {
        // 【修正處】: 根據 SubmissionDao 的定義，在此處補上 personName 參數
        submissionDao.insertSubmission(
                submissionRequest.getQuizId(),
                submissionRequest.getPersonName(), // 確保 submissionRequest 中有 getPersonName() 方法
                LocalDateTime.now()
        );
    }
}
