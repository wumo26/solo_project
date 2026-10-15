package com.example.quiz1150512.controller;

import com.example.quiz1150512.dto.ApiResponse;
import com.example.quiz1150512.dto.SubmissionRequest;
import com.example.quiz1150512.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<ApiResponse> createSubmission(@RequestBody SubmissionRequest submissionRequest) {
        submissionService.createSubmission(submissionRequest);
        return ResponseEntity.ok(new ApiResponse(true, "Submission created successfully"));
    }
}
