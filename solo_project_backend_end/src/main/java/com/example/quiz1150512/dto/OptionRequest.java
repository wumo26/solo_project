package com.example.quiz1150512.dto;

import com.example.quiz1150512.constants.ValidationMsg;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class OptionRequest {

    @JsonProperty("option_code")
    @NotBlank(message = ValidationMsg.OPTION_CODE_REQUIRED)
    private String optionCode; // 選項編號 (如: A, B, C 或 數字 1, 2, 3 的字串)
    @JsonProperty("option_text")
    @NotBlank(message = ValidationMsg.OPTION_TEXT_REQUIRED)
    private String optionText; // 選項內容

    public String getOptionCode() {
        return optionCode;
    }

    public void setOptionCode(String optionCode) {
        this.optionCode = optionCode;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }
}
