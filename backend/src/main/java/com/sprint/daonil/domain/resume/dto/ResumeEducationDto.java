package com.sprint.daonil.domain.resume.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeEducationDto {

    private String schoolName;
    private String major;
    private LocalDate startDate;
    private LocalDate endDate;
    private String degree;
}