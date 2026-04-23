package com.sprint.daonil.domain.Certificate.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "`date`") // 예약어라 백틱 필수
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExamDate {

    // 복합키: jmCd + year + period
    @EmbeddedId
    private ExamDateId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("jmCd") // 복합키의 jmCd와 연결
    @JoinColumn(name = "jm_cd", referencedColumnName = "JMCD")
    private Qualification qualification;

    // 필기시험 정보
    @Column(name = "doc_reg_start")
    private LocalDateTime docRegStart;
    @Column(name = "doc_reg_end")
    private LocalDateTime docRegEnd;
    @Column(name = "doc_vacancy_start")
    private LocalDateTime docVacancyStart;
    @Column(name = "doc_vacancy_end")
    private LocalDateTime docVacancyEnd;
    @Column(name = "doc_exam_start")
    private LocalDateTime docExamStart;
    @Column(name = "doc_exam_end")
    private LocalDateTime docExamEnd;
    @Column(name = "doc_pass")
    private LocalDateTime docPass;

    // 실기시험 정보
    @Column(name = "prac_reg_start")
    private LocalDateTime pracRegStart;
    @Column(name = "prac_reg_end")
    private LocalDateTime pracRegEnd;
    @Column(name = "prac_vacancy_start")
    private LocalDateTime pracVacancyStart;
    @Column(name = "prac_vacancy_end")
    private LocalDateTime pracVacancyEnd;
    @Column(name = "prac_exam_start")
    private LocalDateTime pracExamStart;
    @Column(name = "prac_exam_end")
    private LocalDateTime pracExamEnd;
    @Column(name = "prac_pass")
    private LocalDateTime pracPass;
}