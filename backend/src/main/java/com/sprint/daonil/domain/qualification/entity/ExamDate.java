package com.sprint.daonil.domain.qualification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "`date`", indexes = {
    @Index(name = "idx_jmCd", columnList = "jmCd")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ExamDate {

    @EmbeddedId
    private ExamDateId id;

    @Column(name = "docRegStart")
    private LocalDateTime docRegStart;

    @Column(name = "docRegEnd")
    private LocalDateTime docRegEnd;

    @Column(name = "docVacancyStart")
    private LocalDateTime docVacancyStart;

    @Column(name = "docVacancyEnd")
    private LocalDateTime docVacancyEnd;

    @Column(name = "docExamStart")
    private LocalDateTime docExamStart;

    @Column(name = "docExamEnd")
    private LocalDateTime docExamEnd;

    @Column(name = "docPass")
    private LocalDateTime docPass;

    @Column(name = "pracRegStart")
    private LocalDateTime pracRegStart;

    @Column(name = "pracRegEnd")
    private LocalDateTime pracRegEnd;

    @Column(name = "pracVacancyStart")
    private LocalDateTime pracVacancyStart;

    @Column(name = "pracVacancyEnd")
    private LocalDateTime pracVacancyEnd;

    @Column(name = "pracExamStart")
    private LocalDateTime pracExamStart;

    @Column(name = "pracExamEnd")
    private LocalDateTime pracExamEnd;

    @Column(name = "pracPass")
    private LocalDateTime pracPass;
}

