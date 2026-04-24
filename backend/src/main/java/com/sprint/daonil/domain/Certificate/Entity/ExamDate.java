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
    @JoinColumn(name = "`jmCd`", referencedColumnName = "JMCD")
    private Qualification qualification;

    // 필기시험 정보
    @Column(name = "`docRegStart`")
    private LocalDateTime docRegStart;
    @Column(name = "`docRegEnd`")
    private LocalDateTime docRegEnd;
    @Column(name = "`docVacancyStart`")
    private LocalDateTime docVacancyStart;
    @Column(name = "`docVacancyEnd`")
    private LocalDateTime docVacancyEnd;
    @Column(name = "`docExamStart`")
    private LocalDateTime docExamStart;
    @Column(name = "`docExamEnd`")
    private LocalDateTime docExamEnd;
    @Column(name = "`docPass`")
    private LocalDateTime docPass;

    // 실기시험 정보
    @Column(name = "`pracRegStart`")
    private LocalDateTime pracRegStart;
    @Column(name = "`pracRegEnd`")
    private LocalDateTime pracRegEnd;
    @Column(name = "`pracVacancyStart`")
    private LocalDateTime pracVacancyStart;
    @Column(name = "`pracVacancyEnd`")
    private LocalDateTime pracVacancyEnd;
    @Column(name = "`pracExamStart`")
    private LocalDateTime pracExamStart;
    @Column(name = "`pracExamEnd`")
    private LocalDateTime pracExamEnd;
    @Column(name = "`pracPass`")
    private LocalDateTime pracPass;
}