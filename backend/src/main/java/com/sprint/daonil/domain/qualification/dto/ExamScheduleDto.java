package com.sprint.daonil.domain.qualification.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamScheduleDto {
    private String jmcd;
    private Integer year;
    private Integer period;

    // 필기 일정
    private LocalDateTime docRegStart;
    private LocalDateTime docRegEnd;
    private LocalDateTime docExamStart;
    private LocalDateTime docExamEnd;
    private LocalDateTime docPass;

    // 실기 일정
    private LocalDateTime pracRegStart;
    private LocalDateTime pracRegEnd;
    private LocalDateTime pracExamStart;
    private LocalDateTime pracExamEnd;
    private LocalDateTime pracPass;
}

