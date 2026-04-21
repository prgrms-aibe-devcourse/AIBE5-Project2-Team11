package com.sprint.daonil.domain.qualification.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualificationResponseDto {
    private Long id;
    private String name;
    private String fieldId;
    private String course;
    private String jmcd;
    private ExamScheduleDto currentExam;
}

