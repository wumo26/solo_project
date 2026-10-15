package com.example.quiz1150512.dto;

import java.util.List;

public class PagedQuizResult {

    private List<QuizResponseDto> content;
    private long totalElements;
    private int totalPages;
    private int number;
    private int size;

    public PagedQuizResult(List<QuizResponseDto> content, long totalElements, int totalPages, int number, int size) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.number = number;
        this.size = size;
    }

    // Getters and Setters
    public List<QuizResponseDto> getContent() {
        return content;
    }

    public void setContent(List<QuizResponseDto> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
