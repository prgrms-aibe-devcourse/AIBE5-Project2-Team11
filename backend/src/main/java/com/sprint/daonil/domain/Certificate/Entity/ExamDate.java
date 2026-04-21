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
    @JoinColumn(name = "jmCd", referencedColumnName = "JMCD")
    private Qualification qualification;

    // 일반 필드
    private LocalDateTime docRegStart;
    private LocalDateTime docRegEnd;
    private LocalDateTime docVacancyStart;
    private LocalDateTime docVacancyEnd;
    private LocalDateTime docExamStart;
    private LocalDateTime docExamEnd;
    private LocalDateTime docPass;

    private LocalDateTime pracRegStart;
    private LocalDateTime pracRegEnd;
    private LocalDateTime pracVacancyStart;
    private LocalDateTime pracVacancyEnd;
    private LocalDateTime pracExamStart;
    private LocalDateTime pracExamEnd;
    private LocalDateTime pracPass;
}